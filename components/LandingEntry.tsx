
import React, { useState, useEffect } from 'react';

interface LandingEntryProps {
  onEnter: () => void;
}

export const LandingEntry: React.FC<LandingEntryProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onEnter, 1000);
  };

  return (
    <div className={`fixed inset-0 z-[10000] bg-earth-dark flex flex-col items-center justify-center overflow-hidden transition-all duration-[1.5s] ease-in-out ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Rejilla de Fondo Sutil */}
      <div className="absolute inset-0 grid-technical opacity-[0.03]"></div>
      
      {/* Textos Verticales Decorativos (Estilo Meiji) */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-20 select-none pointer-events-none opacity-20">
         <p className="[writing-mode:vertical-lr] font-mono text-[9px] font-black uppercase tracking-[1em] text-white">TARAPACA_REGIONAL_NODE</p>
         <p className="[writing-mode:vertical-lr] font-mono text-[9px] font-black uppercase tracking-[1em] text-primary">IQUIQUE_NODE_01</p>
      </div>

      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-20 select-none pointer-events-none opacity-20">
         <p className="[writing-mode:vertical-lr] font-mono text-[9px] font-black uppercase tracking-[1em] text-white">PRECISION_CIRCULAR_AI</p>
         <p className="[writing-mode:vertical-lr] font-mono text-[9px] font-black uppercase tracking-[1em] text-stone-700">COORD_20.2307_S_70.1357_W</p>
      </div>

      {/* Centro de Carga */}
      <div className="relative flex flex-col items-center gap-16 z-10">
        
        {/* Logo Central Animado */}
        <div className="relative group">
           <div className={`size-32 border border-white/10 rounded-full flex items-center justify-center transition-all duration-1000 ${isReady ? 'border-primary/50 shadow-[0_0_50px_rgba(118,201,79,0.2)]' : ''}`}>
              <svg viewBox="0 0 100 100" className={`size-12 fill-none transition-transform duration-1000 ${isReady ? 'scale-110' : ''}`}>
                <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="currentColor" className={isReady ? 'text-primary' : 'text-white'} strokeWidth="2" />
                <rect x="38" y="38" width="24" height="24" className={isReady ? 'fill-primary' : 'fill-white/10'} />
              </svg>
           </div>
           
           {/* Anillos de Datos */}
           <div className={`absolute inset-0 border border-primary/20 rounded-full animate-ping [animation-duration:3s] ${isReady ? 'opacity-100' : 'opacity-0'}`}></div>
           <div className={`absolute -inset-4 border border-white/5 rounded-full animate-reverse-spin [animation-duration:10s] ${isReady ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>

        <div className="flex flex-col items-center gap-4">
           <p className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-[0.8em] animate-pulse">Sincronizando_Protocolo</p>
           <div className="h-[1px] w-64 bg-stone-900 relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
           </div>
           <div className="flex items-baseline gap-2">
              <span className="text-4xl font-mono font-black text-white">{progress}</span>
              <span className="text-[10px] font-mono font-black text-primary">%</span>
           </div>
        </div>

        {/* Botón de Entrada (Solo aparece al estar listo) */}
        <div className={`transition-all duration-1000 delay-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button 
            onClick={handleStart}
            className="group relative px-16 py-6 overflow-hidden rounded-full border border-white/20 hover:border-primary transition-all active:scale-95"
          >
             <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
             <span className="relative z-10 text-[11px] font-mono font-black uppercase tracking-[0.5em] text-white group-hover:text-stone-950 transition-colors">Iniciar_Sincronización</span>
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
         <p className="text-[8px] font-mono font-black text-white uppercase tracking-[0.5em]">Conectarapak_OS v4.5</p>
         <div className="flex gap-1">
            {[1,2,3,4,5].map(i => <div key={i} className="size-1 bg-stone-700 rounded-full"></div>)}
         </div>
      </div>

    </div>
  );
};
