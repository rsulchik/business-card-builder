-- Admin role and editable storefront catalog.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_valid;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_valid CHECK (role IN ('customer', 'admin'));

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_role ON public.profiles;
CREATE TRIGGER protect_profile_role
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email_notifications, role)
  VALUES (
    NEW.id,
    left(COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), 80),
    CASE
      WHEN lower(COALESCE(NEW.raw_user_meta_data ->> 'email_notifications', 'false')) IN ('true', '1') THEN TRUE
      ELSE FALSE
    END,
    CASE WHEN lower(COALESCE(NEW.email, '')) = 'pmkamiran@gmail.com' THEN 'admin' ELSE 'customer' END
  )
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
  RETURN NEW;
END;
$$;

UPDATE public.profiles AS profile
SET role = 'admin'
FROM auth.users AS auth_user
WHERE profile.id = auth_user.id
  AND lower(auth_user.email) = 'pmkamiran@gmail.com';

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
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update catalog products" ON public.catalog_products;
CREATE POLICY "Admins can update catalog products"
ON public.catalog_products FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete catalog products" ON public.catalog_products;
CREATE POLICY "Admins can delete catalog products"
ON public.catalog_products FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.set_catalog_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_catalog_updated_at ON public.catalog_products;
CREATE TRIGGER set_catalog_updated_at
BEFORE UPDATE ON public.catalog_products
FOR EACH ROW EXECUTE FUNCTION public.set_catalog_updated_at();

INSERT INTO public.catalog_products (
  slug, name_tm, name_ru, name_en, description_tm, description_ru, description_en,
  category, price, original_price, badge, availability_tm, availability_ru, availability_en, sort_order, image_key
) VALUES
('radiance-renewal-serum', 'Ýagtylyk üçin täzeleýji serum', 'Сыворотка для сияния', 'Radiance Renewal Serum', 'Gialuron kislotasy, niasinamid we ösümlik ekstraktlary bolan ýüpek ýaly gündelik serum.', 'Шёлковистая ежедневная сыворотка с гиалуроновой кислотой, ниацинамидом и растительными экстрактами.', 'A silky daily serum with hyaluronic acid, niacinamide and botanical extracts.', 'skincare', 48, NULL, NULL, NULL, NULL, NULL, 1, 'radiance-renewal-serum'),
('velvet-cloud-moisturizer', 'Mäkäm Bulut çyglandyryjy krem', 'Увлажняющий крем Velvet Cloud', 'Velvet Cloud Moisturizer', 'Skwalan, şi ýagy we ýulaf ekstrakty bolan ýumşak, rahatlyk berýän ýüz kremi.', 'Мягкий комфортный крем для лица со скваланом, маслом ши и экстрактом овса.', 'A soft, comforting face cream with squalane, shea butter and oat extract.', 'skincare', 36, NULL, NULL, NULL, NULL, NULL, 2, 'velvet-cloud-moisturizer'),
('rose-quartz-facial-oil', 'Gülgüne kwars ýüz ýagy', 'Масло для лица Rose Quartz', 'Rose Quartz Facial Oil', 'Itburnu, jojoba we limnantes ýaglarynyň ýeňil garyndysy.', 'Лёгкая смесь масел шиповника, жожоба и лимнанта для мягкой сияющей кожи.', 'A light blend of rosehip, jojoba and meadowfoam oils for soft, radiant skin.', 'skincare', 42, NULL, NULL, NULL, NULL, NULL, 3, 'rose-quartz-facial-oil'),
('botanical-clay-mask', 'Ösümlikli lýaý maskasy', 'Ботаническая глиняная маска', 'Botanical Clay Mask', 'Ýumşak kaolin lýaýy bilen ýaşyl çaýy we romashkany birleşdirýän ýuwulýan maska.', 'Смываемая маска с мягкой каолиновой глиной, зелёным чаем и ромашкой.', 'A rinse-off mask combining gentle kaolin clay with green tea and chamomile.', 'skincare', 28, 36, 'sale', NULL, NULL, NULL, 4, 'botanical-clay-mask'),
('silk-veil-lip-tint', 'Ýüpek Perde dodaý boýagy', 'Тинт для губ Silk Veil', 'Silk Veil Lip Tint', 'Gündelik ulanyş üçin amatly gülgüne-kahweýi reňkdäki dodaý boýagy.', 'Невесомый розово-коричневый тинт для губ на каждый день.', 'An effortless rose-brown lip tint for every day.', 'makeup', 24, NULL, NULL, NULL, NULL, NULL, 5, 'silk-veil-lip-tint'),
('mineral-glow-highlighter', 'Mineral ýagtylyk haýlaýteri', 'Хайлайтер Mineral Glow', 'Mineral Glow Highlighter', 'Inçe öwülen şampan reňkli haýlaýter.', 'Тонко измельчённый хайлайтер оттенка шампанского.', 'A finely milled champagne highlighter with a soft glow.', 'makeup', 32, NULL, NULL, 'Diňe 4 sany galdy', 'Осталось всего 4', 'Only 4 left', 6, 'mineral-glow-highlighter'),
('petal-soft-cream-blush', 'Gülýaprak ýaly ýumşak krem allık', 'Кремовые румяна Petal Soft', 'Petal Soft Cream Blush', 'Şaftaly-gülgüne reňkdäki, aňsat garyşýan krem allık.', 'Легко растушёвываемые кремовые румяна персиково-розового оттенка.', 'An easy-to-blend cream blush in a peachy rose shade.', 'makeup', 28, NULL, NULL, NULL, NULL, NULL, 7, 'petal-soft-cream-blush'),
('botanical-lash-brow-serum', 'Kirpik we gaş üçin ösümlikli serum', 'Ботаническая сыворотка для ресниц и бровей', 'Botanical Lash & Brow Serum', 'Peptidler, pantenol we ösümlik ekstraktlary bolan ýeňil ideg serumi.', 'Лёгкая сыворотка с пептидами, пантенолом и растительными экстрактами.', 'A lightweight care serum with peptides, panthenol and botanical extracts.', 'skincare', 34, NULL, 'sold-out', NULL, NULL, NULL, 8, 'botanical-lash-brow-serum'),
('daily-dew-skin-set', 'Gündelik Şebnem deri toplumy', 'Набор ухода Daily Dew', 'Daily Dew Skin Set', 'Üç basgançakly doly deri idegi toplumy.', 'Полный трёхступенчатый ритуал ухода за кожей.', 'A complete three-step skincare ritual.', 'sets', 58, NULL, NULL, NULL, NULL, NULL, 9, 'daily-dew-skin-set')
ON CONFLICT (slug) DO UPDATE SET
  name_tm = EXCLUDED.name_tm,
  name_ru = EXCLUDED.name_ru,
  name_en = EXCLUDED.name_en,
  description_tm = EXCLUDED.description_tm,
  description_ru = EXCLUDED.description_ru,
  description_en = EXCLUDED.description_en,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  badge = EXCLUDED.badge,
  availability_tm = EXCLUDED.availability_tm,
  availability_ru = EXCLUDED.availability_ru,
  availability_en = EXCLUDED.availability_en,
  sort_order = EXCLUDED.sort_order,
  image_key = EXCLUDED.image_key;

GRANT SELECT ON public.catalog_products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.catalog_products TO authenticated;
