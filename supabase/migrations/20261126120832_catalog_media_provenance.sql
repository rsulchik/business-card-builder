alter table public.catalog_products
  add column brand text,
  add column image_kind text check (image_kind in ('product','product_family','pending')),
  add column image_source_url text check (image_source_url is null or image_source_url like 'https://%');
