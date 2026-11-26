create function public.catalog_suggestions(skin text, concern text, note text, lang text)
returns jsonb
language sql stable security invoker
set search_path = ''
as $$
  with candidates as (
    select p.*, lower(p.name_en || ' ' || p.description_en) as keywords,
      case lang when 'ru' then p.description_ru when 'en' then p.description_en else p.description_tm end as reason
    from public.catalog_products p
    where p.badge is distinct from 'sold-out'
      and p.image_kind in ('product', 'product_family')
      and lower(p.name_en) !~ '(sample|refill|professional|activator|neutralizer)'
      and skin in ('normal','dry','combination','oily','sensitive')
      and char_length(coalesce(note,'')) <= 500
  ), matches as (
    select c.*,
      case when skin = 'oily' and keywords ~ 'oily skin' then 2
           when skin = 'dry' and keywords ~ 'hydrating|moisturiz' then 2
           when skin = 'sensitive' and keywords ~ 'soothing' then 1 else 0 end
      + (select count(*) from (
          select distinct word from regexp_split_to_table(lower(left(coalesce(note,''),500)), '[^[:alnum:]]+') word
          where length(word) >= 3
        ) terms where strpos(lower(c.name_ru || ' ' || c.description_ru || ' ' || c.keywords || ' ' || c.description_tm), terms.word) > 0) as score
    from candidates c
    where case concern
      when 'gift' then category = 'sets'
      when 'hydration' then keywords ~ 'hydrating|moisturiz'
      when 'glow' then keywords ~ 'brightening|brilliance|cushion compact'
      when 'gentle-care' then keywords ~ 'soothing'
      when 'even-tone' then keywords ~ 'uneven skin tone|brightening'
      when 'daily-routine' then keywords ~ 'facial cleansing|cleansing gel|facial moisturizer|moisturizing cream|facial sunscreen'
      when 'lip-color' then keywords ~ 'lip tint|lipstick'
      when 'cheek-color' then keywords ~ 'blush'
      else false end
  ), variants as (
    select m.*, row_number() over (partition by split_part(name_en, ' · ', 1) order by score desc,sort_order,slug) as variant
    from matches m
  ), picks as (
    select * from variants where variant=1 order by score desc,sort_order,slug limit 3
  )
  select jsonb_build_object(
    'summary', case when count(*)=0 then
      case lang when 'ru' then 'В каталоге пока нет товаров для этой цели.' when 'en' then 'No current products match this goal.' else 'Häzir katalogda bu maksada laýyk önüm ýok.' end
    else
      case lang when 'ru' then 'По вашему запросу в каталоге нашлись эти товары.' when 'en' then 'These items match your selected goal.' else 'Bu önümler saýlan maksadyňyza laýyk gelýär.' end
    end,
    'recommendations',coalesce(jsonb_agg(jsonb_build_object('slug',slug,'reason',reason) order by score desc,sort_order,slug),'[]'::jsonb)
  ) from picks;
$$;
revoke all on function public.catalog_suggestions(text,text,text,text) from public;
grant execute on function public.catalog_suggestions(text,text,text,text) to anon,authenticated;
