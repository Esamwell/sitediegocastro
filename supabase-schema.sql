-- ============================================
-- SCHEMA DO BANCO DE DADOS - Sitediegocastro
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- TABELA: news (Notícias)
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  category TEXT,
  image TEXT,
  excerpt TEXT,
  full_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: videos (Vídeos)
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  thumbnail TEXT,
  duration TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: drive_links (Links de Downloads)
CREATE TABLE IF NOT EXISTS drive_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: security_segments (Segmentações de Segurança)
CREATE TABLE IF NOT EXISTS security_segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  full_content TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: projects (Projetos de Lei)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  status TEXT,
  summary TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: profiles (Perfis de Usuário - Admin)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE ACESSO (READ para todos, WRITE para admin)
-- ============================================

-- News: leitura pública, escrita apenas admin
CREATE POLICY "news_select" ON news FOR SELECT USING (true);
CREATE POLICY "news_insert" ON news FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
CREATE POLICY "news_update" ON news FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
CREATE POLICY "news_delete" ON news FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Videos: leitura pública, escrita apenas admin
CREATE POLICY "videos_select" ON videos FOR SELECT USING (true);
CREATE POLICY "videos_insert" ON videos FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
CREATE POLICY "videos_update" ON videos FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
CREATE POLICY "videos_delete" ON videos FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Drive Links: leitura pública, escrita apenas admin
CREATE POLICY "drive_links_select" ON drive_links FOR SELECT USING (true);
CREATE POLICY "drive_links_insert" ON drive_links FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
CREATE POLICY "drive_links_update" ON drive_links FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
CREATE POLICY "drive_links_delete" ON drive_links FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Security Segments: leitura pública, escrita apenas admin
CREATE POLICY "security_segments_select" ON security_segments FOR SELECT USING (true);
CREATE POLICY "security_segments_insert" ON security_segments FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
CREATE POLICY "security_segments_update" ON security_segments FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
CREATE POLICY "security_segments_delete" ON security_segments FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Projects: leitura pública, escrita apenas admin
CREATE POLICY "projects_select" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_insert" ON projects FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
CREATE POLICY "projects_delete" ON projects FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Profiles: leitura apenas do próprio perfil, escrita apenas admin
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- DADOS INICIAIS (OPCIONAL - Link de exemplo)
-- ============================================

INSERT INTO drive_links (key, url) VALUES
  ('releases', '#'),
  ('fotos_alta', '#'),
  ('biografia', '#'),
  ('biblioteca', '#'),
  ('panfletos', '#'),
  ('artes', '#'),
  ('videos_curtos', '#'),
  ('informativos', '#')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (NEW.id, NEW.email, FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando novo usuário se cadastra
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
