import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Shield, Users, Heart, Flag, BookOpen,
  Briefcase, MapPin, Calendar, Scale, Star, CheckCircle2,
  ExternalLink
} from 'lucide-react';
import PatrioticBackground from './PatrioticBackground';
import ImpactText from './ImpactText';
import { supabase } from '../src/supabaseClient';

const renderText = (text: string) => {
  const parts = text.split(/(Jair Bolsonaro|Bolsonaro)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part === 'Jair Bolsonaro' || part === 'Bolsonaro') {
          return <span key={index} className="text-[#005a1a] font-bold">{part}</span>;
        }
        return part;
      })}
    </>
  );
};

const defaultTimeline = [
  {
    year: '1992',
    paragraphs: ['Nasceu em Salvador, no bairro do Cabula, em 14 de setembro.']
  },
  {
    year: '2004–2008',
    paragraphs: ['Aos 12 anos, fundou, no bairro do Cabula, o projeto social Unidos pelo Futebol e Evangelismo, com o objetivo de afastar crianças e adolescentes das drogas. Aos 16 anos, o projeto já beneficiava mais de 100 jovens e suas famílias.'],
    links: [{ text: 'Perfil sobre o início da trajetória de Diego Castro', url: '#' }]
  },
  {
    year: '2010',
    paragraphs: ['Participou do curso de filosofia do professor Olavo de Carvalho e o conheceu naquele mesmo ano.']
  },
  {
    year: '2011',
    paragraphs: ['Tornou-se o primeiro presidente do Grêmio Estudantil do Colégio Estadual Severino Vieira, fortalecendo sua atuação na liderança estudantil e se tornando uma das referências da juventude conservadora baiana.']
  },
  {
    year: '2013',
    paragraphs: [
      'Iniciou sua graduação em Direito.',
      'Já se posicionava publicamente a favor de Jair Bolsonaro, mencionando seu nome no Facebook.',
      'Neste ano, conheceu o então deputado federal Jair Bolsonaro e tornou-se um fiel aliado.',
      'Fundou a organização latino-americana Unidad, da qual foi presidente, com o objetivo de combater o comunismo nas Américas.',
      'Já naquela época, denunciava Nicolás Maduro, o Foro de São Paulo, Juan Manuel Santos, Daniel Ortega, na Nicarágua, e Evo Morales, na Bolívia.',
      'Foi também um período de aproximação com lideranças internacionais das Américas.'
    ]
  },
  {
    year: '2015',
    paragraphs: ['Desde o início do ano, teve forte presença nas manifestações pelo impeachment de Dilma Rousseff, tornando-se uma das principais vozes da juventude baiana no movimento.']
  },
  {
    year: '2017',
    paragraphs: ['Fundou o Bahia à Direita, maior grupo conservador do estado. Seguindo os passos de Jair Bolsonaro, filiou-se ao então PSL e apoiou sua pré-candidatura à Presidência da República.']
  },
  {
    year: '2018',
    paragraphs: ['Formou-se em Direito pela Unijorge. Coordenou a campanha jovem de Jair Bolsonaro na Bahia junto com o Bahia à Direita. Atuou como subcoordenador de trabalho em Salvador, na Secretaria de Trabalho.']
  },
  {
    year: '2019',
    paragraphs: ['Atuou como subdiretor do Trabalho de Salvador no Serviço Municipal de Intermediação de Mão de Obra, o SIMM, vinculado à Secretaria Municipal de Trabalho, Esporte e Lazer.'],
    links: [{ text: 'Perfil oficial de Diego Castro na ALBA', url: '#' }]
  },
  {
    year: '2020',
    paragraphs: [
      'Ganhou notoriedade nacional pelas ações jurídicas contra medidas consideradas abusivas durante a pandemia.',
      'Levantou-se contra o que classificou como a tirania do governo estadual e as medidas de restrição econômica, atuando em defesa de empresários, comerciantes e igrejas.',
      'Consolidou-se como o advogado que mais ajuizou ações contra o fechamento de igrejas e do comércio na Bahia.',
      'Defendeu o protocolo de tratamento precoce e foi o primeiro a apoiar publicamente a Dra. Raíssa Soares.'
    ]
  },
  {
    year: '2021',
    paragraphs: [
      'Impulsionou a candidatura da Dra. Raíssa Soares ao governo do estado, que depois se converteu em candidatura ao Senado Federal.',
      'Atuou como advogado dela, com papel decisivo em vitórias judiciais contra ações movidas pelo governo do estado e pelo deputado Hilton Coelho, do PSOL.',
      'Acompanhando Jair Bolsonaro, filiou-se ao Partido Liberal.'
    ]
  },
  {
    year: '2022',
    paragraphs: [
      'Percorreu a Bahia com a caravana Bahia Direita em defesa de Jair Bolsonaro, contribuindo para contrapor a narrativa da imprensa considerada de esquerda no estado.',
      'Candidatou-se a deputado estadual e foi eleito, em sua primeira eleição, com 33.827 votos.'
    ],
    links: [{ text: 'Resultado e perfil eleitoral de Diego Castro', url: '#' }]
  },
  {
    year: '2023',
    paragraphs: [
      'Foi, segundo o registro do mandato, o primeiro parlamentar eleito do país a visitar os presos do 8 de janeiro na Papuda e na Colmeia, sete dias após os fatos, ao lado do deputado federal Capitão Alden, tornando-se alvo do STF.',
      'Tomou posse na Assembleia Legislativa da Bahia e se firmou como principal figura de oposição ao PT no estado.',
      'Denunciou pela primeira vez o chamado “kit Lula” no Carnaval de Salvador, lanche distribuído pela Polícia Militar.',
      'Com apenas quatro meses de mandato, teve papel decisivo na criação da Polícia Penal na Bahia, destravando uma pauta que estava parada havia 20 anos na Casa.',
      'Foi o único deputado estadual do Brasil a participar das diligências da CPI do MST no Sul da Bahia, iniciando ali o ciclo de fiscalizações que passou a ser a marca do mandato.',
      'Em decorrência das diligências, foi processado pelo MST e por mais 16 deputados federais de esquerda, sob acusações relacionadas a uma suposta invasão de propriedade e a cinco crimes que Diego afirma não terem ocorrido.',
      'Foi convidado pela comitiva de Jair Bolsonaro para a posse do presidente Javier Milei, na Argentina.'
    ],
    links: [
      { text: 'Lista de parlamentares que visitaram presos do 8 de janeiro', url: '#' },
      { text: 'Debate sobre a regulamentação da Polícia Penal — ALBA', url: '#' },
      { text: 'Diligências da CPI do MST na Bahia — Câmara dos Deputados', url: '#' },
      { text: 'Posse de Javier Milei — A Tarde', url: '#' }
    ]
  },
  {
    year: '2024',
    paragraphs: [
      'Tornou-se o “deputado revelação” da Assembleia Legislativa e se consolidou como recordista de projetos de lei da Casa.',
      'Protocolou títulos de cidadão baiano para Jair e Eduardo Bolsonaro.',
      'Aprovou a lei do pacote antidrogas nas escolas.',
      'Consolidou-se como o deputado que mais destinou recursos para a segurança pública, realizando audiências públicas sobre direitos humanos e condições de trabalho da Polícia Militar, da Polícia Penal e da Polícia Civil.',
      'Articulou o maior crescimento da direita baiana, lançando 184 candidatos a vereador e percorrendo mais de 75 cidades em 45 dias de campanha.'
    ],
    links: [
      { text: 'Pacote antidrogas nas escolas estaduais', url: '#' },
      { text: 'Proposições legislativas de Diego Castro — ALBA', url: '#' }
    ]
  },
  {
    year: '2025',
    paragraphs: [
      'Convidado pelo Partido Republicano dos Estados Unidos para a posse de Donald Trump, integrou a comitiva brasileira em Washington.',
      'Assumiu a presidência da Comissão de Direitos Humanos e Segurança Pública da ALBA, com papel decisivo na defesa dos direitos humanos e das condições de trabalho dos profissionais da segurança pública baiana, denunciando problemas de remuneração e alimentação durante o Carnaval.',
      'Aprovou a Comenda Dois de Julho em homenagem a Clériston Pereira da Cunha, o Clezão.',
      'Foi o único deputado presente nas enchentes do Sul da Bahia, visitando os desabrigados e levando donativos a Aurelino Leal e Ubaitaba.',
      'Apresentou o projeto que cria o Estatuto da Liberdade Cristã e atuou para barrar projeto de lei que, em sua avaliação, poderia fechar e multar igrejas na Bahia.',
      'Após denunciar suspeitas de fraude em suas fiscalizações, teve a residência invadida e sofreu ameaças e processos.',
      'Denunciou publicamente o projeto de lei da deputada Olívia Santana, do PCdoB, que apelidou de “Bolsa Família do Crime”.',
      'Foi processado pela parlamentar e venceu a disputa judicial, tornando-se um dos principais opositores do PCdoB na Bahia.',
      'Barrou o financiamento público estadual a uma apresentação da banda Bozokill, que fazia apologia à morte de Jair Bolsonaro e de seus apoiadores.',
      'Processou o governador Jerônimo Rodrigues após a declaração sobre mandar apoiadores de Bolsonaro “para a vala”.',
      'Convocou as primeiras manifestações do Brasil contra a prisão de Bolsonaro e participou do ato na Avenida Paulista ao lado dele, pouco antes de sua prisão.',
      'Encerrou o ano como o deputado com mais proposições e maior engajamento nas redes sociais da Casa.'
    ],
    links: [
      { text: 'Residência de Diego Castro foi invadida em Salvador', url: '#' },
      { text: 'Diego Castro acionou o STF após fala de Jerônimo Rodrigues', url: '#' },
      { text: 'Presidência da Comissão de Direitos Humanos e Segurança Pública', url: '#' },
      { text: 'PL 25.704/2025 — Estatuto da Liberdade Cristã', url: '#' },
      { text: 'Denúncia de Diego ao projeto de Olívia Santana', url: '#' },
      { text: 'Publicação original sobre o “Bolsa Família do Crime”', url: '#' },
      { text: 'Decisão judicial sobre a queixa-crime', url: '#' },
      { text: 'Cancelamento do show da Bozokill após ação popular', url: '#' }
    ]
  },
  {
    year: '2026',
    paragraphs: [
      'Consolidou-se como o deputado mais produtivo da Assembleia Legislativa da Bahia e o que mais destinou recursos à educação militar no estado.',
      'Aprovou a lei que declarou João Dourado a Capital Estadual da Cebola, trazendo investimentos e visibilidade para a região.',
      'Foi reconhecido pelo Instituto LabCaos como o deputado mais engajado nas redes sociais da Assembleia.',
      'Assumiu a vice-liderança da oposição na ALBA.',
      'Como legado à frente da Comissão de Direitos Humanos e Segurança Pública, aprovou o requerimento que deu ensejo a investigações sobre crimes praticados contra produtores rurais no Extremo Sul da Bahia.',
      'Tornou-se o deputado com o maior número de fiscalizações da Bahia.',
      'Denunciou o que classificou como uma “máfia” e uma articulação entre o Partido Comunista Chinês e o governo petista do Estado da Bahia, apontando a possível existência de uma base secreta ou estrutura chinesa de monitoramento em funcionamento em Salvador.',
      'O assunto ganhou repercussão nacional e internacional.',
      'Foi impedido de entrar em hospitais para realizar fiscalizações após denunciar a situação da rede pública de saúde da Bahia, em decorrência de processo movido pelo governo estadual.',
      'Entregou, em cerimônia póstuma, a Comenda Dois de Julho à família de Clezão.'
    ],
    links: [
      { text: 'Vice-liderança da oposição — A Tarde', url: '#' },
      { text: 'Pedido de apuração sobre possível estrutura chinesa — BNews', url: '#' },
      { text: 'Homenagem póstuma a Clezão — ALBA', url: '#' }
    ]
  }
];

const comissoes = [
  { cargo: 'Presidente', comissao: 'Comissão de Direitos Humanos e Segurança Pública', ano: '2025' },
  { cargo: 'Vice-Presidente', comissao: 'Comissão Especial de Desporto, Paradesporto e Lazer', ano: '2023-2024' },
  { cargo: 'Titular', comissao: 'Comissão de Defesa do Consumidor', ano: 'Mandato' },
  { cargo: 'Titular', comissao: 'Comissão de Relações de Trabalho', ano: 'Mandato' },
  { cargo: 'Vice-Líder', comissao: 'Bloco da Minoria', ano: '2026' },
];

const HistoriaPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach(s => { settingsMap[s.key] = s.value; });
        setSettings(settingsMap);
      }
    };
    fetchSettings();

    const sub = supabase.channel('historia-settings-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, fetchSettings).subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const getSetting = (key: string, defaultVal: string) => settings[key] || defaultVal;
  
  const parsedTimeline = settings['historia_timeline'] ? JSON.parse(settings['historia_timeline']) : defaultTimeline;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PatrioticBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/LOGO DIEGO VERDE EXTENSA.png"
                alt="Diego Castro"
                className="h-20 w-auto"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-[#002776] font-bold text-sm hover:gap-3 transition-all"
          >
            <ArrowLeft size={18} /> Voltar ao Início
          </Link>
        </div>
      </nav>

      {/* HERO DA PÁGINA */}
      <section className="relative pt-40 pb-16 lg:pt-52 lg:pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffdf00]/20 rounded-full mb-6">
              <Calendar size={16} className="text-[#002776]" />
              <span className="text-xs font-bold text-[#002776] uppercase tracking-widest">{getSetting('historia_badge', 'Desde 1992')}</span>
            </div>
            <h1 className="text-4xl lg:text-7xl font-heading font-black text-[#002776] leading-[0.9] mb-6" dangerouslySetInnerHTML={{ __html: getSetting('historia_title', 'MINHA <span class="text-[#005a1a]">HISTÓRIA</span>') }}>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {getSetting('historia_subtitle', 'Da infância no Cabula ao Parlamento baiano — conheça a trajetória de quem nunca parou de lutar pela Bahia.')}
            </p>
          </motion.div>
        </div>
      </section>



      {/* TRAJETÓRIA CRONOLÓGICA */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <ImpactText text={getSetting('historia_timeline_title', 'TRAJETÓRIA')} color="blue" className="text-3xl lg:text-5xl mb-4" />
            <p className="text-slate-500 font-medium">{getSetting('historia_timeline_subtitle', 'Linha do tempo interativa e fatos organizados')}</p>
          </div>
          <div className="relative">
            <div className="absolute left-[7.5rem] top-0 bottom-0 w-0.5 bg-slate-200 hidden lg:block" />
            <div className="space-y-8">
              {parsedTimeline.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-6 lg:gap-12 items-start"
                >
                  <div className="shrink-0 w-16 text-right hidden lg:block">
                    <span className="text-[#005a1a] font-black text-lg">{item.year}</span>
                  </div>
                  <div className="relative">
                    <div className="w-4 h-4 bg-[#005a1a] rounded-full mt-1.5 hidden lg:block" />
                  </div>
                  <div className="bg-slate-50 p-6 lg:p-8 rounded-2xl border border-slate-100 flex-1">
                    <span className="text-[#005a1a] font-black text-xl lg:hidden block mb-4">{item.year}</span>
                    
                    <div className="space-y-4">
                      {item.paragraphs.map((p, idx) => (
                        <p key={idx} className="text-slate-700 font-medium leading-relaxed">
                          {renderText(p)}
                        </p>
                      ))}
                    </div>

                    {item.links && item.links.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col gap-3">
                        {item.links.map((link: any, idx: number) => (
                          <a 
                            key={idx} 
                            href={link.url} 
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#002776] hover:text-[#005a1a] transition-colors"
                          >
                            <ExternalLink size={14} /> Saiba mais: {renderText(link.text)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Banner Publicidade - Página História */}
      {getSetting('banner_1_image', '/banners/1.jpeg') && (
        <div className="max-w-5xl mx-auto px-6 my-6 flex flex-col items-center">
          <span className="text-[9px] font-semibold text-slate-300 uppercase tracking-[0.2em] mb-1.5">Publicidade</span>
          <a
            href={getSetting('banner_1_link', '#')}
            target={getSetting('banner_1_link', '#').startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 w-full bg-slate-50"
          >
            <img
              src={getSetting('banner_1_image', '/banners/1.jpeg')}
              alt="Publicidade"
              className="w-full h-auto max-h-[150px] md:max-h-[250px] object-contain"
              referrerPolicy="no-referrer"
            />
          </a>
        </div>
      )}

      {/* LEALDADE A BOLSONARO */}
      <section className="py-16 px-6 bg-slate-50">
         <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#002776] to-[#005a1a] rounded-3xl p-10 lg:p-16 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-heading font-black mb-6 uppercase text-[#ffdf00]">{getSetting('historia_loyalty_title', 'Lealdade a Jair Bolsonaro')}</h3>
              <p className="text-lg text-white/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: getSetting('historia_loyalty_text', 'A relação política de Diego Castro com <span class="text-[#ffdf00] font-bold">Jair Bolsonaro</span> atravessa diferentes fases de sua trajetória. Desde a juventude, Diego defende publicamente as mesmas pautas conservadoras, participou das mobilizações que fortaleceram <span class="text-[#ffdf00] font-bold">Bolsonaro</span> na Bahia e permaneceu ao seu lado nos momentos de maior pressão política.') }} />
            </div>
            <Heart className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
         </div>
      </section>



      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <img
            src="/LOGO DIEGO VERDE EXTENSA.png"
            alt="Diego Castro"
            className="h-20 w-auto mx-auto mb-6"
            referrerPolicy="no-referrer"
          />
          <p className="text-white/40 text-sm">
            © 2026 Diego Castro. Todos os direitos reservados | Desenvolvido por{' '}
            <a href="https://www.sa2marketing.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Agência SA2 Marketing
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HistoriaPage;
