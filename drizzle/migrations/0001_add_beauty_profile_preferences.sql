ALTER TABLE public.profiles
  ADD COLUMN skin_type TEXT,
  ADD COLUMN favorite_categories TEXT[] NOT NULL DEFAULT '{}',
  ADD CONSTRAINT profiles_skin_type_valid CHECK (skin_type IS NULL OR skin_type IN ('dry', 'oily', 'combination', 'normal', 'sensitive')),
  ADD CONSTRAINT profiles_favorite_categories_valid CHECK (favorite_categories <@ ARRAY['skincare', 'makeup', 'sets']::TEXT[]);