import React from 'react';

interface TopBannerProps {
  image: string;
  link: string;
  /** Texto das faixas de chamada, acima e abaixo da arte. */
  text: string;
}

/**
 * Faixa de campanha no topo do site, acima de tudo.
 *
 * A arte fica entre duas tarjas de chamada, uma em cima e outra embaixo, para o
 * convite aparecer tanto para quem entra na página quanto para quem chega
 * rolando. O bloco inteiro é um único link — clicar em qualquer ponto, arte ou
 * tarja, leva ao mesmo lugar.
 *
 * A arte não é recortada: é peça de campanha, com número, nomes e chamada, e
 * qualquer corte comeria informação.
 */
const TopBanner: React.FC<TopBannerProps> = ({ image, link, text }) => {
  if (!image) return null;

  const isExternal = link.startsWith('http');

  const strip = (
    <div className="w-full bg-[#ffdf00] py-2 px-3 group-hover:bg-[#ffe733] transition-colors">
      <p
        className="
          text-center font-black uppercase text-[#002776]
          leading-tight tracking-tight
          text-[11px] sm:text-sm md:text-lg lg:text-xl
        "
      >
        {text}
      </p>
    </div>
  );

  return (
    <a
      href={link}
      target={isExternal ? '_blank' : '_self'}
      rel="noopener noreferrer"
      aria-label={text}
      className="group block w-full bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#002776]/40"
    >
      {strip}
      <img
        src={image}
        alt="Diego Castro 22380 e Flávio Bolsonaro 22"
        className="block w-full h-auto"
        // Primeira imagem da página: carregar cedo evita o salto de layout.
        fetchPriority="high"
        referrerPolicy="no-referrer"
      />
      {strip}
    </a>
  );
};

export default TopBanner;
