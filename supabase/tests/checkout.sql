begin;
select set_config('test.user_a',gen_random_uuid()::text,true), set_config('test.user_b',gen_random_uuid()::text,true);
insert into auth.users(id,email) values(current_setting('test.user_a')::uuid,'checkout-a-'||current_setting('test.user_a')||'@example.invalid'),(current_setting('test.user_b')::uuid,'checkout-b-'||current_setting('test.user_b')||'@example.invalid');
select set_config('test.product',(select slug from public.catalog_products where not price_needs_review and badge is distinct from 'sold-out' order by slug limit 1),true);
select set_config('test.price',(select price::text from public.catalog_products where slug=current_setting('test.product')),true);
select set_config('test.pending',(select slug from public.catalog_products where price_needs_review limit 1),true);
select set_config('request.jwt.claim.sub',current_setting('test.user_a'),true);
set local role authenticated;
do $$
declare
 c jsonb:='{"name":"Checkout Test","phone":"+99365123456","email":"test@example.invalid","country":"Turkmenistan","city":"Ashgabat","address":"Test street 10","note":"","consent":true}';
 lines jsonb:=jsonb_build_array(jsonb_build_object('slug',current_setting('test.product'),'quantity',2,'unit_price',current_setting('test.price')::numeric));
 total numeric:=current_setting('test.price')::numeric*2;
 key uuid:=gen_random_uuid(); r jsonb; again jsonb; n integer;
begin
 r:=public.place_order(key,c,lines,total);
 again:=public.place_order(key,c,lines,total);
 if r<>again then raise exception 'Retry created different order'; end if;
 if (r->>'subtotal')::numeric<>total then raise exception 'Wrong total'; end if;
 select count(*) into n from public.orders;
 if n<>1 then raise exception 'Expected exactly one visible order, got %',n; end if;
 update public.orders set status='delivered' where id=(r->>'id')::uuid;
 get diagnostics n = row_count;
 if n<>0 then raise exception 'Customer changed order status'; end if;
 begin
   perform public.place_order(gen_random_uuid(),c,jsonb_set(lines,'{0,unit_price}','0'),total);
   raise exception 'Tampered price accepted';
 exception when raise_exception then if sqlerrm<>'PRICE_CHANGED' then raise; end if; end;
 begin
   perform public.place_order(gen_random_uuid(),c,lines,total+1);
   raise exception 'Tampered total accepted';
 exception when raise_exception then if sqlerrm<>'PRICE_CHANGED' then raise; end if; end;
 begin
   perform public.place_order(gen_random_uuid(),c,jsonb_set(lines,'{0,quantity}','1.5'),total);
   raise exception 'Fractional quantity accepted';
 exception when raise_exception then if sqlerrm<>'INVALID_QUANTITY' then raise; end if; end;
 begin
   perform public.place_order(gen_random_uuid(),c,jsonb_set(lines,'{0,slug}',to_jsonb(current_setting('test.pending'))),total);
   raise exception 'Unverified price accepted';
 exception when raise_exception then if sqlerrm<>'PRICE_REVIEW' then raise; end if; end;
 begin
   perform public.place_order(gen_random_uuid(),jsonb_set(c,'{consent}','false'),lines,total);
   raise exception 'Missing consent accepted';
 exception when raise_exception then if sqlerrm<>'INVALID_CUSTOMER' then raise; end if; end;
 begin
   perform public.place_order(key,jsonb_set(c,'{name}','"Different name"'),lines,total);
   raise exception 'Reused request key accepted changed payload';
 exception when raise_exception then if sqlerrm<>'REQUEST_CHANGED' then raise; end if; end;
 perform set_config('request.jwt.claim.sub',current_setting('test.user_b'),true);
 select count(*) into n from public.orders;
 if n<>0 then raise exception 'Other customer can see private order'; end if;
 perform set_config('request.jwt.claim.sub','',true);
 begin
   perform public.place_order(gen_random_uuid(),c,lines,total);
   raise exception 'Unauthenticated order accepted';
 exception when raise_exception then if sqlerrm<>'AUTH_REQUIRED' then raise; end if; end;
end $$;
reset role;
-- All test users and orders are rolled back.
rollback;
