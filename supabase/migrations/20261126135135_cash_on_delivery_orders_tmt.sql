create schema if not exists private;
-- Catalog prices were supplied in USD. Convert once using the owner's rate.
alter table public.catalog_products add column source_price_usd numeric(12,2), add column price_needs_review boolean not null default false;
update public.catalog_products set source_price_usd=price, price_needs_review=(price=0.02), price=round(price*18,2), original_price=round(original_price*18,2);

create table public.orders (
 id uuid primary key default gen_random_uuid(),
 order_number bigint generated always as identity unique,
 user_id uuid not null references auth.users(id),
 request_id uuid not null,
 request_payload jsonb not null,
 customer jsonb not null,
 items jsonb not null,
 subtotal numeric(14,2) not null check (subtotal>0),
 currency text not null default 'TMT' check (currency='TMT'),
 payment_method text not null default 'cash_on_delivery' check (payment_method='cash_on_delivery'),
 status text not null default 'pending' check (status in ('pending','confirmed','shipped','delivered','cancelled')),
 created_at timestamptz not null default now(),
 unique(user_id,request_id)
);
create index orders_user_created_idx on public.orders(user_id,created_at desc);
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant select on public.orders to authenticated;
grant update(status) on public.orders to authenticated;
create policy "Read own orders or administer orders" on public.orders for select to authenticated
 using (user_id=(select auth.uid()) or exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin'));
create policy "Administrators update order status" on public.orders for update to authenticated
 using (exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin'))
 with check (exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin'));

create or replace function private.place_order(p_request_id uuid,p_customer jsonb,p_items jsonb,p_expected_total numeric)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 uid uuid:=auth.uid();
 existing public.orders;
 inserted public.orders;
 payload jsonb;
 line jsonb;
 p public.catalog_products;
 snapshot jsonb:='[]'::jsonb;
 amount numeric:=0;
 qty integer;
begin
 if uid is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_request_id is null or jsonb_typeof(p_customer) is distinct from 'object' or jsonb_typeof(p_items) is distinct from 'array' or p_expected_total is null then raise exception 'INVALID_ORDER'; end if;
 if jsonb_array_length(p_items) not between 1 and 50 or length(p_customer::text)>4000 then raise exception 'INVALID_ORDER'; end if;
 if coalesce(length(trim(p_customer->>'name')),0) not between 2 and 100
 or coalesce(p_customer->>'phone','') !~ '^\+?[0-9 ()-]{7,24}$'
 or length(regexp_replace(p_customer->>'phone','[^0-9]','','g')) not between 7 and 15
 or coalesce(p_customer->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
 or length(p_customer->>'email')>254
 or coalesce(length(trim(p_customer->>'country')),0) not between 2 and 80
 or coalesce(length(trim(p_customer->>'city')),0) not between 2 and 100
 or coalesce(length(trim(p_customer->>'address')),0) not between 5 and 300
 or coalesce(length(p_customer->>'note'),0)>1000
 or p_customer->>'consent' is distinct from 'true' then raise exception 'INVALID_CUSTOMER'; end if;
 payload:=jsonb_build_object('customer',p_customer,'items',p_items,'total',p_expected_total);
 -- Serialize submissions per customer, including retries with the same key.
 perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
 select * into existing from public.orders where user_id=uid and request_id=p_request_id;
 if found then
   if existing.request_payload<>payload then raise exception 'REQUEST_CHANGED'; end if;
   return jsonb_build_object('id',existing.id,'order_number',existing.order_number,'subtotal',existing.subtotal);
 end if;
 if (select count(*) from public.orders where user_id=uid and created_at>now()-interval '1 hour')>=5 then raise exception 'ORDER_LIMIT'; end if;
 if (select count(distinct value->>'slug') from jsonb_array_elements(p_items))<>jsonb_array_length(p_items) then raise exception 'INVALID_ITEMS'; end if;
 for line in select value from jsonb_array_elements(p_items) loop
   if coalesce(line->>'quantity','') !~ '^[1-9][0-9]?$' then raise exception 'INVALID_QUANTITY'; end if;
   qty:=(line->>'quantity')::integer;
   select * into p from public.catalog_products where slug=line->>'slug' for share;
   if not found then raise exception 'PRODUCT_UNAVAILABLE'; end if;
   if p.badge='sold-out' then raise exception 'PRODUCT_UNAVAILABLE'; end if;
   if p.price_needs_review or p.price<=0 then raise exception 'PRICE_REVIEW'; end if;
   if jsonb_typeof(line->'unit_price') is distinct from 'number' or (line->>'unit_price')::numeric<>p.price then raise exception 'PRICE_CHANGED'; end if;
   amount:=amount+p.price*qty;
   snapshot:=snapshot||jsonb_build_array(jsonb_build_object('slug',p.slug,'name_ru',p.name_ru,'name_en',p.name_en,'name_tm',p.name_tm,'image',p.image_key,'quantity',qty,'unit_price',p.price));
 end loop;
 if amount<>p_expected_total then raise exception 'PRICE_CHANGED'; end if;
 insert into public.orders(user_id,request_id,request_payload,customer,items,subtotal)
 values(uid,p_request_id,payload,p_customer,snapshot,amount) returning * into inserted;
 return jsonb_build_object('id',inserted.id,'order_number',inserted.order_number,'subtotal',inserted.subtotal);
end $$;
revoke all on function private.place_order(uuid,jsonb,jsonb,numeric) from public,anon;
grant usage on schema private to authenticated;
grant execute on function private.place_order(uuid,jsonb,jsonb,numeric) to authenticated;
create or replace function public.place_order(p_request_id uuid,p_customer jsonb,p_items jsonb,p_expected_total numeric)
returns jsonb language sql security invoker set search_path='' as $$
 select private.place_order(p_request_id,p_customer,p_items,p_expected_total);
$$;
revoke all on function public.place_order(uuid,jsonb,jsonb,numeric) from public,anon;
grant execute on function public.place_order(uuid,jsonb,jsonb,numeric) to authenticated;
