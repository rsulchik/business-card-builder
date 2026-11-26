create schema catalog_private; revoke all on schema catalog_private from public, anon, authenticated;
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING ((select auth.uid()) = id)
WITH CHECK ((select auth.uid()) = id);

CREATE OR REPLACE FUNCTION catalog_private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email_notifications)
  VALUES (
    NEW.id,
    left(COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), 80),
    CASE
      WHEN lower(COALESCE(NEW.raw_user_meta_data ->> 'email_notifications', 'false')) IN ('true', '1') THEN TRUE
      ELSE FALSE
    END
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION catalog_private.handle_new_user();

CREATE OR REPLACE FUNCTION catalog_private.set_profile_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION catalog_private.set_profile_updated_at();
ALTER TABLE public.profiles
  ADD COLUMN skin_type TEXT,
  ADD COLUMN favorite_categories TEXT[] NOT NULL DEFAULT '{}',
  ADD CONSTRAINT profiles_skin_type_valid CHECK (skin_type IS NULL OR skin_type IN ('dry', 'oily', 'combination', 'normal', 'sensitive')),
  ADD CONSTRAINT profiles_favorite_categories_valid CHECK (favorite_categories <@ ARRAY['skincare', 'makeup', 'sets']::TEXT[]);
alter table public.profiles add column role text not null default 'customer' check(role in ('customer','admin'));
revoke all on table public.profiles from public, anon, authenticated; grant select, update(full_name,email_notifications,skin_type,favorite_categories) on public.profiles to authenticated;
CREATE TABLE IF NOT EXISTS public.catalog_products (
  slug TEXT PRIMARY KEY,
  name_tm TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_tm TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  description_en TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('skincare', 'makeup', 'sets')),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(10, 2) CHECK (original_price IS NULL OR original_price >= 0),
  badge TEXT CHECK (badge IS NULL OR badge IN ('sale', 'sold-out')),
  availability_tm TEXT,
  availability_ru TEXT,
  availability_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  image_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Catalog is publicly readable" ON public.catalog_products;
CREATE POLICY "Catalog is publicly readable"
ON public.catalog_products FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can insert catalog products" ON public.catalog_products;
CREATE POLICY "Admins can insert catalog products"
ON public.catalog_products FOR INSERT
TO authenticated
WITH CHECK ((exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')));

DROP POLICY IF EXISTS "Admins can update catalog products" ON public.catalog_products;
CREATE POLICY "Admins can update catalog products"
ON public.catalog_products FOR UPDATE
TO authenticated
USING ((exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')))
WITH CHECK ((exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')));

DROP POLICY IF EXISTS "Admins can delete catalog products" ON public.catalog_products;
CREATE POLICY "Admins can delete catalog products"
ON public.catalog_products FOR DELETE
TO authenticated
USING ((exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')));

CREATE OR REPLACE FUNCTION catalog_private.set_catalog_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_catalog_updated_at ON public.catalog_products;
CREATE TRIGGER set_catalog_updated_at
BEFORE UPDATE ON public.catalog_products
FOR EACH ROW EXECUTE FUNCTION catalog_private.set_catalog_updated_at();


revoke all on table public.catalog_products from public, anon, authenticated; grant select on public.catalog_products to anon, authenticated; grant insert, update, delete on public.catalog_products to authenticated; grant all on public.catalog_products to service_role; revoke all on all functions in schema catalog_private from public, authenticated, anon;
