-- =====================================================================
-- GALERIA DE FOTOS + POSTS DO INSTAGRAM
-- Rode este arquivo inteiro no SQL Editor do Supabase.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) GALERIA
-- As fotos NÃO ficam no banco. O banco guarda só a URL pública do
-- arquivo, que vive no Storage. É o que permite ter dezenas de fotos sem
-- inchar as consultas (o resto do painel grava imagem em base64 dentro
-- da coluna, o que não escala para galeria).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  -- caminho do arquivo dentro do bucket, para conseguir apagar de verdade
  storage_path TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gallery_select" ON gallery;
CREATE POLICY "gallery_select" ON gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "gallery_insert" ON gallery;
CREATE POLICY "gallery_insert" ON gallery FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

DROP POLICY IF EXISTS "gallery_update" ON gallery;
CREATE POLICY "gallery_update" ON gallery FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

DROP POLICY IF EXISTS "gallery_delete" ON gallery;
CREATE POLICY "gallery_delete" ON gallery FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- ---------------------------------------------------------------------
-- 2) BUCKET DO STORAGE
-- Público para leitura (o site precisa exibir), escrita só para admin.
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('galeria', 'galeria', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "galeria_public_read" ON storage.objects;
CREATE POLICY "galeria_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'galeria');

DROP POLICY IF EXISTS "galeria_admin_insert" ON storage.objects;
CREATE POLICY "galeria_admin_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'galeria'
    AND auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

DROP POLICY IF EXISTS "galeria_admin_delete" ON storage.objects;
CREATE POLICY "galeria_admin_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'galeria'
    AND auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

-- ---------------------------------------------------------------------
-- 3) POSTS DO INSTAGRAM
-- Guardamos só a URL do post público. A exibição usa o embed oficial do
-- Instagram, que não exige token nem acesso à conta.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_url TEXT NOT NULL,
  -- código do post extraído da URL (o "ABC123" de instagram.com/p/ABC123/)
  shortcode TEXT,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "instagram_posts_select" ON instagram_posts;
CREATE POLICY "instagram_posts_select" ON instagram_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "instagram_posts_insert" ON instagram_posts;
CREATE POLICY "instagram_posts_insert" ON instagram_posts FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

DROP POLICY IF EXISTS "instagram_posts_update" ON instagram_posts;
CREATE POLICY "instagram_posts_update" ON instagram_posts FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

DROP POLICY IF EXISTS "instagram_posts_delete" ON instagram_posts;
CREATE POLICY "instagram_posts_delete" ON instagram_posts FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- ---------------------------------------------------------------------
-- 4) TEXTOS DAS NOVAS SEÇÕES
-- ---------------------------------------------------------------------
INSERT INTO site_settings (key, value, description) VALUES
('galeria_title', 'GALERIA', 'Título da seção Galeria'),
('galeria_subtitle', 'Registros do mandato pelas cidades da Bahia', 'Subtítulo da Galeria'),
('instagram_title', 'NO INSTAGRAM', 'Título da seção Instagram'),
('instagram_subtitle', 'Acompanhe o dia a dia em @diegocastroba', 'Subtítulo do Instagram'),
('instagram_url', 'https://www.instagram.com/diegocastroba/', 'Link do perfil no Instagram')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------
-- 5) BANNER DE TOPO
-- Faixa de campanha exibida antes de tudo, ao entrar no site.
-- ---------------------------------------------------------------------
INSERT INTO site_settings (key, value, description) VALUES
('topo_banner_image', '/banners/topo.avif', 'Banner do Topo - Imagem'),
('topo_banner_link', 'https://api.whatsapp.com/send?phone=5571992493802&text=Ol%C3%A1%2C+quero+material+de+Fl%C3%A1vio+Bolsonaro+22+e+do+Deputado+Estadual+Diego+Castro+22380', 'Banner do Topo - Link',
('topo_banner_texto', 'Clique aqui e solicite material de Flávio Bolsonaro e Diego Castro na Bahia', 'Banner do Topo - Texto da Faixa')
ON CONFLICT (key) DO NOTHING;
