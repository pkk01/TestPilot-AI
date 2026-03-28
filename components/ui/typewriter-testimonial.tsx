'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Testimonial = {
  image: string;
  audio: string;
  text: string;
  name: string;
  jobtitle: string;
};

type ComponentProps = {
  testimonials: Testimonial[];
};

export const TypewriterTestimonial: React.FC<ComponentProps> = ({ testimonials }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null); 
  const [hasBeenHovered, setHasBeenHovered] = useState<boolean[]>(new Array(testimonials.length).fill(false));
  const [typedText, setTypedText] = useState('');
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTextRef = useRef('');

  const stopAudio = useCallback(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause(); 
      audioPlayerRef.current.currentTime = 0; 
      audioPlayerRef.current.src = ''; 
      audioPlayerRef.current.load(); 
      audioPlayerRef.current = null; 
    }
  }, []); 

  const startTypewriter = useCallback((text: string) => {
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    setTypedText('');
    currentTextRef.current = text;
    
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        setTypedText(text.slice(0, i));
        i++;
        typewriterTimeoutRef.current = setTimeout(type, 50);
      }
    };
    type();
  }, []);

  const stopTypewriter = useCallback(() => {
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
      typewriterTimeoutRef.current = null;
    }
    setTypedText('');
    currentTextRef.current = '';
  }, []); 

  const handleMouseEnter = useCallback((index: number) => {
    stopAudio(); 
    setHoveredIndex(index);
  
    const newAudio = new Audio(`/audio/${testimonials[index].audio}`);
    audioPlayerRef.current = newAudio; 
    newAudio.play().catch(() => {
      // Audio playback prevented or file not found — fail silently
    });
    
    setHasBeenHovered(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
    startTypewriter(testimonials[index].text);
  }, [testimonials, stopAudio, startTypewriter]); 

  const handleMouseLeave = useCallback(() => {
    stopAudio(); 
    setHoveredIndex(null);
    stopTypewriter();
  }, [stopAudio, stopTypewriter]);

  useEffect(() => {
    return () => {
      stopAudio(); 
      stopTypewriter(); 
    };
  }, [stopAudio, stopTypewriter]); 

  return (
    <div className="flex justify-center items-center gap-4 flex-wrap">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          className="relative flex flex-col items-center"
          onMouseEnter={() => handleMouseEnter(index)} 
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src={testimonial.image}
            alt={`Testimonial from ${testimonial.name}`}
            className="w-16 h-16 rounded-full border-4 hover:animate-pulse border-gray-600 object-cover cursor-pointer"
            animate={{ 
              borderColor: (hoveredIndex === index || hasBeenHovered[index]) ? '#818cf8' : '#4b5563'
            }}
            transition={{ duration: 0.3 }}
          />
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: -20 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-20 bg-slate-900/95 backdrop-blur-xl text-slate-200 text-sm px-4 py-3 rounded-xl shadow-2xl shadow-indigo-500/10 max-w-xs w-60 border border-white/10"
              >
                <div className="h-24 overflow-hidden whitespace-pre-wrap text-slate-300 leading-relaxed">
                  {typedText}
                  <span className="animate-pulse text-indigo-400">|</span>
                </div>
                <p className="mt-2 text-right font-semibold text-white">{testimonial.name}</p>
                <p className="text-right text-indigo-400/80 text-xs">{testimonial.jobtitle}</p>
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4">
                  <div className="w-3 h-3 bg-slate-900/95 rounded-full shadow-lg border border-white/10"></div>
                  <div className="w-2 h-2 bg-slate-900/95 rounded-full shadow-lg mt-1 border border-white/10"></div>
                  <div className="w-1 h-1 bg-slate-900/95 rounded-full shadow-lg mt-1"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};
