import React from 'react';
import { motion } from 'framer-motion';

interface ImpactTextProps {
  text: string;
  className?: string;
  color?: 'green' | 'blue' | 'yellow' | 'white';
}

const ImpactText: React.FC<ImpactTextProps> = ({ text, className = "", color = "white" }) => {
  const colorMap = {
    green: 'text-[#005a1a]',
    blue: 'text-[#002776]',
    yellow: 'text-[#ffdf00]',
    white: 'text-white'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`font-heading font-black uppercase tracking-tighter ${colorMap[color]}`}
      >
        {text}
      </motion.h2>
    </div>
  );
};

export default ImpactText;
