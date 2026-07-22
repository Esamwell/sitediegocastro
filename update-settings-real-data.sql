-- Script para ATUALIZAR as configurações do site com os DADOS REAIS E IMAGENS
-- Conforme as instruções do arquivo PDF.

INSERT INTO public.site_settings (key, value, description) VALUES

-- Página inicial
('hero_badge', '100% BOLSONARO', 'Badge principal'),
('hero_title', 'A VOZ QUE O SISTEMA QUER CALAR', 'Título principal'),
('hero_subtitle', 'Recordista de Projetos de Lei e o deputado que mais investe na Segurança Pública da Bahia. Diego Castro é o guardião dos valores conservadores na ALBA.', 'Subtítulo principal'),
('hero_image', '/diego e bs/diego-castro-e-bolsonaro.png', 'Imagem principal (Hero)'),

('hero_badge_2_value', '100%', 'Selo flutuante valor'),
('hero_badge_2_label', 'Bolsonaro', 'Selo flutuante texto'),

('stats_1_value', '170+', 'Estatística 1 - Valor'),
('stats_1_label', 'Proposições e 95 PLs', 'Estatística 1 - Texto'),
('stats_2_value', 'Mais de 100', 'Estatística 2 - Valor'),
('stats_2_label', 'Cidades na Bahia', 'Estatística 2 - Texto'),
('stats_3_value', 'R$ 2,5M', 'Estatística 3 - Valor'),
('stats_3_label', 'Emendas Segurança', 'Estatística 3 - Texto'),
('stats_4_value', '80+', 'Estatística 4 - Valor'),
('stats_4_label', 'Fiscalizações', 'Estatística 4 - Texto'),

-- Quem é Diego
('about_title', 'Fiel defensor do presidente <span class="text-[#005a1a]">Bolsonaro</span>', 'Título Sobre'),
('about_image', '/fotos-diego/diego-1.jpeg', 'Imagem sobre o Diego (Jovem)'),
('about_image_secondary', '/fotos-diego/diego-2.jpeg', 'Imagem secundária sobre'),

-- Outras imagens de fundo/seções
('bahia_image', '/fotos-diego/diego-3.jpeg', 'Imagem Bahia'),
('seguranca_image', '/fotos-diego/diego-4.jpeg', 'Imagem Segurança'),
('familia_image', '/fotos-diego/diego-5.jpeg', 'Imagem Família'),
('agro_image', '/fotos-diego/diego-6.jpeg', 'Imagem Agro'),
('historia_hero_image', '/fotos-diego/diego-7.jpeg', 'Imagem Linha do Tempo'),

-- Mandato
('mandato_badge', 'Ações Legislativas', 'Badge do Mandato'),
('mandato_title', 'MANDATO PELA BAHIA', 'Título Mandato'),
('mandato_subtitle', 'Recordista de Projetos de Lei na Assembleia Legislativa da Bahia. Atuamos com transparência e coragem em defesa dos interesses do povo baiano.', 'Subtítulo Mandato'),

-- Bolsonaro
('bolsonaro_badge', 'LEALDADE E PRINCÍPIOS', 'Badge Bolsonaro'),
('bolsonaro_title', 'FIEL DEFENSOR DO PRESIDENTE BOLSONARO', 'Título Bolsonaro')

ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description;
