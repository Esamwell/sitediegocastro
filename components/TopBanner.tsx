import React from 'react';

interface TopBannerProps {
  image: string;
  link: string;
}

/**
 * Faixa de campanha no topo do site, acima de tudo.
 *
 * Ocupa a largura inteira e não recorta a arte: é peça de campanha, com número,
 * nomes e chamada — qualquer corte comeria informação. A altura sai da própria
 * proporção do arquivo.
 */
const TopBanner: React.FC<TopBannerProps> = ({ image, link }) => {
  if (!image) return null;

  const isExternal = link.startsWith('http');

  return (
    <a
      href={link}
      target={isExternal ? '_blank' : '_self'}
      rel="noopener noreferrer"
      aria-label="Peça material de campanha pelo WhatsApp"
      className="block w-full bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#002776]/40"
    >
      <img
        src={image}
        alt="Diego Castro 22380 e Flávio Bolsonaro 22 — clique para pedir material de campanha pelo WhatsApp"
        className="block w-full h-auto"
        // Primeira imagem da página: carregar cedo evita o salto de layout.
        fetchPriority="high"
        referrerPolicy="no-referrer"
      />
    </a>
  );
};

export default TopBanner;
