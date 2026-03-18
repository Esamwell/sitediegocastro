import React from 'react';

const PatrioticBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#005a1a]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#002776]/5 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#ffdf00]/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#002776 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
    </div>
  );
};

export default PatrioticBackground;
