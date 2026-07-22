-- Script para inserir as configurações adicionais (seções faltantes) no Supabase
-- Não irá sobrescrever os que você já alterou!

INSERT INTO public.site_settings (key, value, description) VALUES
('hero_badge_2_value', '100%', 'Selo flutuante valor'),
('hero_badge_2_label', 'Bolsonaro', 'Selo flutuante texto'),

('stats_1_label', 'Projetos de Lei', 'Estatística 1'),
('stats_1_value', '170+', 'Estatística 1'),
('stats_2_label', 'Cidades Visitadas', 'Estatística 2'),
('stats_2_value', 'Mais de 100', 'Estatística 2'),
('stats_3_label', 'Emendas Destinadas', 'Estatística 3'),
('stats_3_value', 'R$ 2,5M', 'Estatística 3'),
('stats_4_label', 'Ações de Fiscalização', 'Estatística 4'),
('stats_4_value', '80+', 'Estatística 4'),

('about_text_1', 'Com uma trajetória marcada pela defesa inegociável da família, da fé e da liberdade, Diego Castro tornou-se a voz que o sistema tenta, a todo custo, silenciar na Bahia.', 'Sobre Diego'),
('about_text_2', 'Primeiro deputado estadual do grupo do ex-presidente Jair Bolsonaro eleito no estado, ele consolidou seu nome como um dos mais ferrenhos opositores ao PT e às políticas de esquerda.', 'Sobre Diego'),
('about_image', '/diego.png', 'Imagem principal sobre'),
('about_image_secondary', '/fotinha redonda.png', 'Imagem secundária sobre'),

('mandato_badge', 'Ações Legislativas', 'Badge do Mandato'),
('mandato_title', 'O mandato que mais produz pela Bahia', 'Título Mandato'),
('mandato_subtitle', 'Com um trabalho intenso e dedicado, Diego Castro se destaca como o deputado mais ativo na defesa dos valores e interesses da Bahia.', 'Subtítulo Mandato'),

('bahia_title', 'DIEGO PELA BAHIA', 'Título Bahia'),
('bahia_subtitle', 'Mais de 100 municípios visitados, levando ações reais.', 'Subtítulo Bahia'),
('bahia_item_1_title', 'Fiscalização Ativa', 'Item Bahia'),
('bahia_item_1_text', 'Onde o problema acontece, nós estamos lá para cobrar.', 'Item Bahia'),
('bahia_item_1_footer', '+80 ações em 2024', 'Item Bahia'),
('bahia_item_2_title', 'Emendas Direcionadas', 'Item Bahia'),
('bahia_item_2_text', 'Recursos que vão direto para quem mais precisa.', 'Item Bahia'),
('bahia_item_2_footer', 'R$ 2,5M investidos', 'Item Bahia'),
('bahia_image', '/fotos-diego/diego-2.jpg', 'Imagem de fundo Bahia'),
('bahia_image_stats_value', '2.5M', 'Estatística imagem Bahia'),
('bahia_image_stats_label', 'Em Emendas Destinadas', 'Estatística imagem Bahia'),

('seguranca_image', '/fotos-diego/diego-3.jpeg', 'Imagem Segurança'),
('seguranca_title', 'LADO A LADO COM AS FORÇAS DE SEGURANÇA', 'Título Segurança'),
('seguranca_subtitle', 'O único deputado que defende abertamente nossos policiais militares e civis, lutando por melhores condições de trabalho e reconhecimento.', 'Subtítulo Segurança'),

('noticias_title', 'NOTÍCIAS DO MANDATO', 'Título Notícias'),
('noticias_subtitle', 'Acompanhe as últimas ações e projetos de lei em tramitação.', 'Subtítulo Notícias'),

('bolsonaro_badge', 'LEALDADE E PRINCÍPIOS', 'Badge Bolsonaro'),
('bolsonaro_title', 'FIEL DEFENSOR DO PRESIDENTE BOLSONARO', 'Título Bolsonaro'),
('bolsonaro_subtitle', 'Sempre marchando lado a lado com Jair Bolsonaro na defesa inegociável da liberdade, da família e dos valores conservadores que construíram nossa nação.', 'Subtítulo Bolsonaro'),
('bolsonaro_stats_1_value', '100%', 'Estatística 1 Bolsonaro'),
('bolsonaro_stats_1_label', 'Alinhamento', 'Estatística 1 Bolsonaro'),
('bolsonaro_stats_2_value', '2026', 'Estatística 2 Bolsonaro'),
('bolsonaro_stats_2_label', 'O Brasil voltará a sorrir', 'Estatística 2 Bolsonaro'),

('imprensa_title', 'CONTATO PARA A IMPRENSA', 'Título Imprensa'),
('imprensa_text', 'Para solicitar entrevistas, enviar pautas ou entrar em contato com nossa equipe de comunicação.', 'Texto Imprensa'),
('arquivos_title', 'ARQUIVOS PARA DOWNLOAD', 'Título Arquivos'),
('arquivos_text', 'Acesse o acervo completo de fotos em alta resolução, releases e materiais gráficos da campanha.', 'Texto Arquivos'),
('arquivos_btn', 'Acessar Drive de Arquivos', 'Botão Arquivos'),

('contato_title', 'GABINETE DO DEPUTADO', 'Título Contato'),
('contato_subtitle', 'ESTAMOS DE PORTAS ABERTAS PARA VOCÊ', 'Subtítulo Contato'),
('contato_address_1', 'Assembleia Legislativa da Bahia - ALBA', 'Endereço Contato 1'),
('contato_address_2', 'Gabinete 208, Anexo Nelson Mandela', 'Endereço Contato 2'),
('contato_email', 'deputado@diegocastro.com.br', 'Email Contato'),
('contato_phone_1', '(71) 3115-7140', 'Telefone 1 Contato'),
('contato_phone_2', '(71) 99999-9999', 'Telefone 2 Contato'),

('videos_title', 'ACOMPANHE NOSSOS VÍDEOS', 'Título Vídeos'),

('downloads_title_1', 'Materiais para', 'Título Downloads 1'),
('downloads_title_2', 'Download', 'Título Downloads 2'),
('downloads_subtitle', 'Acesse e baixe os materiais oficiais do deputado.', 'Subtítulo Downloads'),

('familia_image', '/fotos-diego/diego-5.jpg', 'Imagem Família'),
('familia_title', 'A BASE DA NOSSA SOCIEDADE', 'Título Família'),
('familia_item_1_title', 'Defesa da Vida', 'Item Família'),
('familia_item_1_text', 'Luta inegociável desde a concepção contra todas as formas de legalização do aborto.', 'Item Família'),
('familia_item_2_title', 'Proteção das Crianças', 'Item Família'),
('familia_item_2_text', 'Combate feroz contra a erotização infantil e ideologia de gênero nas escolas baianas.', 'Item Família'),
('familia_item_3_title', 'Liberdade Religiosa', 'Item Família'),
('familia_item_3_text', 'Garantia do livre exercício da fé e proteção irrestrita aos templos e igrejas.', 'Item Família'),

('agro_image', '/fotos-diego/diego-6.jpg', 'Imagem Agro'),
('agro_title', 'A FORÇA DO NOSSO INTERIOR', 'Título Agro'),
('agro_item_1_title', 'Propriedade Privada', 'Item Agro'),
('agro_item_1_text', 'Tolerância zero contra invasões. Quem produz merece paz e segurança no campo.', 'Item Agro'),
('agro_item_2_title', 'Infraestrutura', 'Item Agro'),
('agro_item_2_text', 'Defesa por melhores estradas e condições para o escoamento da nossa produção agrícola.', 'Item Agro'),
('agro_item_3_title', 'Liberdade Econômica', 'Item Agro'),
('agro_item_3_text', 'Menos impostos e burocracia para quem gera emprego e alimento na Bahia.', 'Item Agro'),

('historia_hero_title', 'MINHA HISTÓRIA', 'História Título'),
('historia_hero_subtitle', 'Uma trajetória de lutas e vitórias', 'História Subtítulo'),
('historia_hero_image', '/fotos-diego/diego-5.jpg', 'História Imagem'),
('historia_main_text', 'Desde cedo percebi que não podíamos mais ficar de braços cruzados enquanto destruíam nossos valores...', 'História Texto'),
('historia_timeline_title', 'A LINHA DO TEMPO DA NOSSA LUTA', 'História Título Linha do Tempo'),
('historia_mission_title', 'O QUE DEFENDE NOSSO MANDATO', 'História Missão Título')
ON CONFLICT (key) DO NOTHING;
