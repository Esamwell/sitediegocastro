import React from 'react';

/**
 * Aviso legal de propaganda eleitoral, exigido nas peças de campanha.
 * Centralizado num único componente para que o texto e o CNPJ não
 * divirjam entre os rodapés das diferentes páginas.
 */
const PROPAGANDA_ELEITORAL = [
  'Propaganda Eleitoral',
  'Eleições 2026',
  'Diego Castro Barbosa',
  'Deputado Estadual',
  'PL 22',
  'CNPJ: 68.319.306/0001-49',
];

const PropagandaEleitoral: React.FC = () => (
  <div className="border-t border-white/10 pt-8 mb-8">
    {/* flex-wrap para os itens quebrarem entre si, nunca no meio (ex.: "PL 22") */}
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-bold text-white/70 uppercase tracking-[0.15em]">
      {PROPAGANDA_ELEITORAL.map((item, i) => (
        <React.Fragment key={item}>
          {i > 0 && <span className="text-[#ffdf00]" aria-hidden="true">•</span>}
          <span className="whitespace-nowrap">{item}</span>
        </React.Fragment>
      ))}
    </p>
  </div>
);

export default PropagandaEleitoral;
