import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.1 }; 
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const clickable = target.closest('button') || 
                        target.closest('a') || 
                        target.closest('[data-hover="true"]');
      setIsHovering(!!clickable);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center hidden md:flex will-change-transform"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="relative rounded-full border-2 border-[#002776] bg-white/10 backdrop-blur-sm flex items-center justify-center"
        style={{ width: 40, height: 40 }}
        animate={{
          scale: isHovering ? 2 : 1,
          borderColor: isHovering ? '#005a1a' : '#002776',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.div 
          className="w-1 h-1 bg-[#002776] rounded-full"
          animate={{
            scale: isHovering ? 0 : 1,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
