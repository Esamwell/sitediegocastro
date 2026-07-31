import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { id } = req.query;

  // Obter as variáveis de ambiente (as mesmas do Vite, ou vars padrão no painel da Vercel)
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing in Vercel Edge/Serverless function.');
    return res.status(500).send('Configuração do servidor incompleta.');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Buscar a notícia específica
  const { data: news, error } = await supabase
    .from('news')
    .select('title, excerpt, image')
    .eq('id', id)
    .single();

  // URL base do deploy
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    // Buscar o index.html original estático
    const response = await fetch(`${baseUrl}/`);
    let html = await response.text();

    if (news && !error) {
      const ogTitle = news.title;
      const ogImage = news.image || `${baseUrl}/LOGO DIEGO VERDE EXTENSA.png`;
      const ogDescription = news.excerpt || 'Confira a notícia completa no portal de Diego Castro.';
      const newsUrl = `${baseUrl}/noticia/${id}`;

      // Substituir a tag <title>
      html = html.replace(/<title>.*<\/title>/i, `<title>${ogTitle} - Dep. Dr. Diego Castro</title>`);
      
      // Injetar as Meta Tags Open Graph logo antes de fechar a </head>
      const metaTags = `
        <meta property="og:title" content="${ogTitle}" />
        <meta property="og:description" content="${ogDescription}" />
        <meta property="og:image" content="${ogImage}" />
        <meta property="og:url" content="${newsUrl}" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Dep. Dr. Diego Castro" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${ogTitle}" />
        <meta name="twitter:description" content="${ogDescription}" />
        <meta name="twitter:image" content="${ogImage}" />
      `;

      html = html.replace('</head>', `${metaTags}\n</head>`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Cache da requisição para melhorar a performance nas próximas leituras do robô (Vercel Edge Network)
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).send(html);
  } catch (err) {
    console.error('Error fetching base HTML:', err);
    res.status(500).send('Erro interno no servidor ao gerar preview.');
  }
}
