import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Shield, Users, Heart, Flag, BookOpen,
  Briefcase, MapPin, Calendar, Scale, Star, CheckCircle2
} from 'lucide-react';
import PatrioticBackground from './PatrioticBackground';
import ImpactText from './ImpactText';

const timeline = [
  { year: '1992', event: 'Nascimento em Salvador, Bahia, no bairro do Cabula' },
  { year: '2004', event: 'Fundou seu primeiro projeto social aos 12 anos, unindo futebol e evangelismo' },
  { year: '2008', event: 'Projeto já beneficiava 88 jovens em situação de vulnerabilidade' },
  { year: '2011', event: 'Tornou-se o primeiro presidente de um grêmio estudantil de direita no estado da Bahia' },
  { year: '2013', event: 'Ingressou na Faculdade Unijorge para cursar Direito' },
  { year: '2014', event: 'Liderou manifestações pró-impeachment na Bahia' },
  { year: '2017', event: 'Fundou o movimento Bahia Direita, maior grupo conservador do estado' },
  { year: '2018', event: 'Formou-se em Direito pela Unijorge' },
  { year: '2019', event: 'Atuou como subdiretor do Trabalho no SIMM de Salvador' },
  { year: '2020', event: 'Ganhou notoriedade nacional com ações jurídicas contra medidas abusivas na pandemia' },
  { year: '2022', event: 'Eleito deputado estadual com votação expressiva pelo PL' },
  { year: '2023', event: 'Tomou posse na Assembleia Legislativa da Bahia (Legislatura 2023-2027)' },
  { year: '2024', event: 'Aprovação da Lei Antidrogas da Bahia para escolas públicas estaduais' },
  { year: '2025', event: 'Presidiu a Comissão de Direitos Humanos e Segurança Pública da ALBA' },
  { year: '2026', event: 'Assumiu a vice-liderança do Bloco da Minoria na Assembleia' },
];

const reconhecimentos = [
  { icon: <Star size={20} />, text: 'Elogios do presidente chileno Sebastián Piñera em intercâmbio internacional' },
  { icon: <Star size={20} />, text: 'Reconhecimento do vice-presidente de Honduras, Ricardo Álvarez' },
  { icon: <Star size={20} />, text: 'Reconhecimento de Elisa Sliver, da equipe do presidente Donald Trump' },
  { icon: <Star size={20} />, text: 'Apoio do deputado federal Eduardo Bolsonaro em 2022' },
];

const comissoes = [
  { cargo: 'Presidente', comissao: 'Comissão de Direitos Humanos e Segurança Pública', ano: '2025' },
  { cargo: 'Vice-Presidente', comissao: 'Comissão Especial de Desporto, Paradesporto e Lazer', ano: '2023-2024' },
  { cargo: 'Titular', comissao: 'Comissão de Defesa do Consumidor', ano: 'Mandato' },
  { cargo: 'Titular', comissao: 'Comissão de Relações de Trabalho', ano: 'Mandato' },
  { cargo: 'Vice-Líder', comissao: 'Bloco da Minoria', ano: '2026' },
];

const HistoriaPage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PatrioticBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/logo diego castro verde.png"
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
              <span className="text-xs font-bold text-[#002776] uppercase tracking-widest">Desde 1992</span>
            </div>
            <h1 className="text-4xl lg:text-7xl font-heading font-black text-[#002776] leading-[0.9] mb-6">
              MINHA <span className="text-[#005a1a]">HISTÓRIA</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Da infância no Cabula ao Parlamento baiano — conheça a trajetória de quem nunca parou de lutar pela Bahia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOTO DE CAPA */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <img
              src="/fotos-diego/diego-2.jpeg"
              alt="Diego Castro"
              className="w-full h-[30rem] lg:h-[40rem] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002776]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <div className="text-white">
                <div className="text-sm font-bold uppercase tracking-[0.3em] mb-2 opacity-80">Deputado Estadual</div>
                <div className="text-3xl lg:text-5xl font-heading font-black">DIEGO CASTRO BARBOSA</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ORIGENS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <ImpactText text="ORIGENS" color="blue" className="text-3xl lg:text-5xl mb-8" />
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  Diego Castro Barbosa nasceu em Salvador, Bahia, em 14 de setembro de 1992. Filho de Idalice Monteiro de Castro e Telmo José Barbosa, construiu desde cedo uma trajetória marcada pela liderança, pelo serviço ao próximo e pela defesa dos valores conservadores.
                </p>
                <p>
                  Advogado e técnico em edificações, é atualmente uma das principais vozes da oposição na Assembleia Legislativa da Bahia, onde cumpre o primeiro mandato como deputado estadual pelo Partido Liberal (PL).
                </p>
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h4 className="text-[#002776] font-black text-xl mb-6 uppercase tracking-tight">Dados Pessoais</h4>
              <div className="space-y-4">
                {[
                  { label: 'Nome Completo', value: 'Diego Castro Barbosa' },
                  { label: 'Nascimento', value: '14/09/1992 — Salvador, BA' },
                  { label: 'Pais', value: 'Idalice Monteiro de Castro e Telmo José Barbosa' },
                  { label: 'Formação', value: 'Direito — Unijorge (2013-2018)' },
                  { label: 'Partido', value: 'Partido Liberal (PL)' },
                  { label: 'Cargo', value: 'Deputado Estadual (2023-2027)' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{item.label}</span>
                    <span className="text-[#002776] font-bold text-sm text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJETO SOCIAL E ATIVISMO INICIAL */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <ImpactText text="O INÍCIO DA TRAJETÓRIA" color="blue" className="text-3xl lg:text-5xl mb-12" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
              <div className="w-14 h-14 bg-[#005a1a]/10 rounded-2xl flex items-center justify-center text-[#005a1a] shrink-0">
                <Heart size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#002776] mb-3">Primeiro Projeto Social</h3>
                <p className="text-slate-600 leading-relaxed">
                  Aos 12 anos, no bairro do Cabula, em Salvador, fundou seu primeiro projeto social, que unia futebol e evangelismo para atender crianças e adolescentes em situação de vulnerabilidade. Aos 16 anos, a iniciativa já beneficiava cerca de 88 jovens.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
              <div className="w-14 h-14 bg-[#002776]/10 rounded-2xl flex items-center justify-center text-[#002776] shrink-0">
                <Users size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#002776] mb-3">Liderança Estudantil</h3>
                <p className="text-slate-600 leading-relaxed">
                  Na adolescência, tornou-se o primeiro presidente de um grêmio estudantil de direita no estado da Bahia, em 2011. Participou de intercâmbios e eventos internacionais no Chile, recebendo elogios do então presidente Sebastián Piñera.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECONHECIMENTOS INTERNACIONAIS */}
      <section className="py-16 px-6 bg-[#002776]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-heading font-black text-white mb-4">RECONHECIMENTOS</h2>
            <p className="text-white/60 font-medium">Trajetória reconhecida nacional e internacionalmente</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {reconhecimentos.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4"
              >
                <div className="text-[#ffdf00] shrink-0">{item.icon}</div>
                <span className="text-white/90 font-medium text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ATIVISMO POLÍTICO E BAHIA DIREITA */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <ImpactText text="ATIVISMO E COMPROMISSO" color="blue" className="text-3xl lg:text-5xl mb-12" />
          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-xl font-bold text-[#002776] mb-4 flex items-center gap-3">
                <Flag size={24} className="text-[#005a1a]" />
                Manifestações Pró-Impeachment (2014-2016)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Entre 2014 e 2016, foi um dos líderes baianos das manifestações pró-impeachment que mobilizaram milhões de brasileiros. Sua atuação nas ruas consolidou sua imagem como líder do conservadorismo no estado.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-xl font-bold text-[#002776] mb-4 flex items-center gap-3">
                <Shield size={24} className="text-[#005a1a]" />
                Bahia Direita (2017)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Em 2017, junto com amigos e aliados, fundou o movimento Bahia Direita, que se tornou o maior grupo conservador do estado, presente em mais de 200 municípios e atuante em mobilizações de rua, ações jurídicas e iniciativas sociais em defesa das liberdades individuais e dos valores cristãos.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-xl font-bold text-[#002776] mb-4 flex items-center gap-3">
                <Scale size={24} className="text-[#005a1a]" />
                Atuação Jurídica na Pandemia (2020)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Durante a pandemia de Covid-19, ganhou notoriedade nacional por sua atuação jurídica contra medidas que considerou abusivas, como o passaporte sanitário imposto pelo governo estadual. Movimentou mais de 50 ações judiciais e representações administrativas em defesa das liberdades civis, processando o então governador Rui Costa e outros gestores. Essa postura lhe rendeu reconhecimento entre defensores da liberdade e também resultou em perseguições políticas, incluindo tentativas de suspender sua inscrição na Ordem dos Advogados do Brasil (OAB).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMAÇÃO E CARRIERA */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <ImpactText text="FORMAÇÃO E CARREIRA" color="blue" className="text-3xl lg:text-5xl mb-12" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
              <div className="w-14 h-14 bg-[#005a1a]/10 rounded-2xl flex items-center justify-center text-[#005a1a] shrink-0">
                <BookOpen size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#002776] mb-3">Formação Acadêmica</h3>
                <p className="text-slate-600 leading-relaxed">
                  Formado em Direito pela Unijorge (2013-2018). Autor do artigo "Os deveres jurídicos das agências reguladoras e a garantia da livre concorrência", publicado na Revista de Direito Administrativo e Constitucional (REDAP) em 2019.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
              <div className="w-14 h-14 bg-[#002776]/10 rounded-2xl flex items-center justify-center text-[#002776] shrink-0">
                <Briefcase size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#002776] mb-3">Experiência Profissional</h3>
                <p className="text-slate-600 leading-relaxed">
                  Exerceu a advocacia no escritório Biset, Castro e Matos Advogados Associados. Atuou como subdiretor do Trabalho de Salvador no Serviço Municipal de Intermediação de Mão de Obra (SIMM) em 2019.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAJETÓRIA CRONOLÓGICA */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <ImpactText text="CRONOLOGIA" color="blue" className="text-3xl lg:text-5xl mb-4" />
            <p className="text-slate-500 font-medium">Marcos importantes da minha vida pública</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden lg:block" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
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
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex-1">
                    <span className="text-[#005a1a] font-black text-sm lg:hidden block mb-1">{item.year}</span>
                    <p className="text-slate-700 font-medium">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MANDATO NA ASSEMBLEIA */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <ImpactText text="NA ASSEMBLEIA LEGISLATIVA" color="blue" className="text-3xl lg:text-5xl mb-12" />
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-[#002776] mb-6">Atuação nas Comissões</h3>
              <div className="space-y-4">
                {comissoes.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <CheckCircle2 size={18} className="text-[#005a1a] shrink-0" />
                    <div className="flex-1">
                      <span className="text-[#002776] font-bold text-sm">{item.cargo}</span>
                      <span className="text-slate-400 mx-2">—</span>
                      <span className="text-slate-600 text-sm">{item.comissao}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-bold shrink-0">{item.ano}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#002776] p-8 rounded-3xl text-white">
              <h3 className="text-xl font-bold mb-6">Principais Conquistas</h3>
              <div className="space-y-4">
                {[
                  'Lei Antidrogas da Bahia (2024) — ações de conscientização nas escolas públicas estaduais',
                  'Dezenas de proposições para valorização dos policiais',
                  'Emendas parlamentares destinadas à segurança pública',
                  'Fiscalização rigorosa do Executivo estadual',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#ffdf00] shrink-0 mt-0.5" />
                    <span className="text-white/90 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-600 text-lg leading-relaxed italic">
              "Sua principal bandeira é a segurança pública. Apresentou dezenas de proposições voltadas à valorização dos policiais militares, civis, penais e guardas municipais, à melhoria das condições de trabalho e ao enfrentamento da criminalidade."
            </p>
          </div>
        </div>
      </section>

      {/* PRESENÇA DIGITAL E Encerramento */}
      <section className="py-16 px-6 bg-[#005a1a]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-heading font-black text-white mb-6">
            UMA NOVA GERAÇÃO DE <span className="text-[#ffdf00]">POLÍTICOS</span>
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Com perfil combativo, técnico e ligado aos valores da família, da fé cristã e do trabalho, o deputado Diego Castro representa uma nova geração de políticos conservadores na Bahia. Sua trajetória, desde os projetos sociais no Cabula até o Parlamento baiano, reflete o compromisso com a defesa das liberdades, da moralidade pública e da transformação da política estadual.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Heart size={28} />, label: 'Fé Cristã' },
              { icon: <Shield size={28} />, label: 'Liberdade' },
              { icon: <Flag size={28} />, label: 'Transformação' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 border border-white/20 p-6 rounded-2xl flex flex-col items-center gap-3">
                <div className="text-[#ffdf00]">{item.icon}</div>
                <span className="text-white font-bold uppercase tracking-widest text-xs">{item.label}</span>
              </div>
            ))}
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#ffdf00] text-[#002776] px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-all shadow-xl"
          >
            <ArrowLeft size={20} /> Voltar ao Início
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <img
            src="/logo diego castro.png"
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
