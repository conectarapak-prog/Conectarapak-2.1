
import React, { useState, useMemo, useEffect } from 'react';
import { MAP_ACTORS as INITIAL_MAP_ACTORS } from '../constants';

interface HomeProps {
  setView: (v: any) => void;
}

export const Home: React.FC<HomeProps> = ({ setView }) => {
  const [activeActor, setActiveActor] = useState<typeof INITIAL_MAP_ACTORS[0] | null>(null);
  const [mapFilter, setMapFilter] = useState<string>('Todos');

  const filteredActors = useMemo(() => {
    if (mapFilter === 'Todos') return INITIAL_MAP_ACTORS;
    return INITIAL_MAP_ACTORS.filter(actor => actor.type === mapFilter);
  }, [mapFilter]);

  const handleOfficialRedirect = (url: string) => {
    // Protocolo de salida fluida
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-stone-950 z-[10000] opacity-0 transition-opacity duration-700 pointer-events-none';
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.style.opacity = '1', 10);
    
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 700);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full items-center pb-40 overflow-visible bg-transparent">
      
      {/* HERO SECTION - KINETIC TYPOGRAPHY */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-primary/5 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl px-10 text-center space-y-16 kinetic-layer" style={{"--depth": 4} as any}>
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4 bg-stone-900/40 backdrop-blur-3xl border border-white/5 px-6 py-2.5 rounded-full shadow-2xl">
               <span className="size-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_15px_#76C94F]"></span>
               <span className="text-[9px] font-mono font-black uppercase tracking-[0.6em] text-white/50 italic">Core.Sync_Protocol</span>
            </div>
            
            <h1 className="text-8xl md:text-[14rem] font-black text-white leading-[0.8] tracking-[-0.06em] uppercase font-display select-none fluid-title">
              <span>SISTEMA <br/><span className="text-stone-900 italic font-light">REGEN</span></span>
            </h1>
          </div>
          
          <div className="flex flex-col items-center gap-14 max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl text-stone-500 font-mono font-medium leading-tight lowercase tracking-tight border-l-2 border-primary/20 pl-10 text-left italic">
              Orquestación territorial mediante <span className="text-white">inteligencia artificial</span> para la transformación de pasivos industriales en activos regenerativos.
            </p>

            <div className="flex flex-wrap justify-center gap-8 pt-6">
              <button 
                onClick={() => setView('discovery')} 
                className="h-24 px-24 bg-white text-stone-950 rounded-full font-mono font-black text-[11px] uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:-translate-y-2 active:scale-95"
              >
                Ingresar al Ecosistema
              </button>
              <button onClick={() => setView('feed')} className="flex items-center gap-4 text-stone-600 font-mono font-black text-[10px] uppercase tracking-[0.4em] hover:text-primary transition-colors group">
                Explorar Bitácora <span className="material-symbols-outlined text-sm group-hover:translate-x-3 transition-transform">east</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA FLUIDO - HUD DE PRECISIÓN */}
      <section className="w-full max-w-[1700px] mx-auto py-40 px-8 space-y-32 relative">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-20 border-b border-white/5 pb-20">
           <div className="space-y-6 kinetic-layer" style={{"--depth": 2} as any}>
              <p className="text-[11px] font-mono font-black text-primary uppercase tracking-[1em] mb-4">01.Cartografía_Interconectada</p>
              <h2 className="text-8xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8] fluid-title">
                Visor de <span className="text-stone-950 italic">Nodos</span>
              </h2>
           </div>
           
           <div className="glass-liquid p-2 rounded-[2.5rem] flex gap-2">
              {['Todos', 'Público', 'Privado', 'Gremio'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMapFilter(type)}
                  className={`px-12 py-5 rounded-[1.8rem] text-[10px] font-mono font-black uppercase tracking-widest transition-all ${
                    mapFilter === type 
                    ? 'bg-white text-stone-950 shadow-2xl' 
                    : 'text-stone-500 hover:text-stone-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-[900px]">
          
          {/* MAP CANVAS CON INTERACCIÓN ELÁSTICA */}
          <div className="lg:col-span-8 bg-stone-950/40 rounded-[5rem] border border-white/5 relative overflow-hidden group shadow-[inset_0_0_150px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 grid-technical opacity-[0.04] pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-[1.5s]"></div>
            
            {/* Silueta Regional Parallax */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] scale-110 blur-[2px] animate-float">
              <svg className="h-[95%] text-white" viewBox="0 0 100 100" fill="currentColor">
                <path d="M45,10 L55,15 L65,25 L70,45 L68,65 L60,85 L45,95 L35,80 L32,60 L35,40 L38,20 Z" />
              </svg>
            </div>

            {/* NODOS SENSOR DE PRECISIÓN */}
            {filteredActors.map(actor => (
              <div 
                key={actor.id} 
                className="absolute transition-all duration-1000 ease-out kinetic-layer" 
                style={{ 
                  left: actor.x, 
                  top: actor.y, 
                  "--depth": (1 + actor.id * 0.5) 
                } as any} 
              >
                <div className="relative group cursor-pointer">
                  {/* Micro-HUD al Hover */}
                  <div className={`absolute inset-0 rounded-full border border-primary/40 scale-[3] animate-ping duration-[5s] ${activeActor?.id === actor.id ? 'opacity-100' : 'opacity-0'}`}></div>
                  
                  {/* Icono de Nodo Estilizado */}
                  <div 
                    onClick={() => setActiveActor(actor)}
                    className={`size-20 rounded-[2rem] flex items-center justify-center border transition-all duration-700 relative z-10 ${
                    activeActor?.id === actor.id 
                    ? 'bg-white text-stone-950 border-white shadow-[0_0_80px_rgba(255,255,255,0.4)] scale-110 rotate-[15deg]' 
                    : 'bg-stone-900/60 text-stone-500 border-white/5 hover:border-primary/40 hover:bg-stone-900 group-hover:scale-105 group-hover:-translate-y-2'
                  }`}>
                    <span className="material-symbols-outlined text-3xl font-light">{actor.icon}</span>
                  </div>

                  {/* Etiqueta Técnica Emergente y Clickable */}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-8 flex flex-col items-center transition-all duration-1000 ${activeActor?.id === actor.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-90 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                    <div 
                      onClick={() => handleOfficialRedirect(actor.url)}
                      className="bg-white px-8 py-3 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center gap-6 whitespace-nowrap hover:bg-primary hover:text-white transition-all active:scale-95 group/tag"
                    >
                       <span className="text-[11px] font-mono font-black uppercase tracking-tighter">{actor.name}</span>
                       <span className="text-[9px] font-mono font-bold text-stone-300 group-hover/tag:text-white/60">#ENLACE_OFICIAL</span>
                       <span className="material-symbols-outlined text-sm group-hover/tag:translate-x-1 transition-transform">open_in_new</span>
                    </div>
                    <div className="text-[8px] font-mono font-black text-stone-600 uppercase mt-4 tracking-[0.5em] bg-stone-950/80 px-4 py-1.5 rounded-full border border-white/5">
                      SINC: ONLINE_OK
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PANEL DE DATOS LATERAL (CRISTAL) */}
          <div className="lg:col-span-4 kinetic-layer" style={{"--depth": 6} as any}>
            <div className="glass-liquid rounded-[5rem] h-full flex flex-col overflow-hidden shadow-2xl relative">
               <div className="absolute inset-0 grid-technical opacity-[0.02] pointer-events-none"></div>

               {activeActor ? (
                 <div className="flex flex-col h-full animate-fade-in p-16 text-left relative z-10">
                    <div className="space-y-10">
                       <p className="text-[11px] font-mono font-black text-primary uppercase tracking-[0.8em] flex items-center gap-3">
                          <span className="size-1.5 bg-primary rounded-full"></span>
                          Access.Node_Secure
                       </p>
                       <h4 className="text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] font-display fluid-title">
                         {activeActor.name}
                       </h4>
                       <div className="flex gap-4">
                          <span className="px-8 py-2.5 rounded-full bg-white/5 border border-white/5 text-stone-400 text-[10px] font-mono font-black uppercase tracking-widest">
                            Cat_ID: {activeActor.type}
                          </span>
                       </div>
                    </div>

                    <div className="flex-1 space-y-16 mt-24">
                       <div className="space-y-10">
                          <p className="text-[11px] font-mono font-black text-stone-700 uppercase tracking-[0.5em] border-b border-white/5 pb-5">Operational_Metrics</p>
                          <div className="space-y-12">
                             {[
                               { label: 'Simbiosis de Red', val: 92, color: 'bg-primary' },
                               { label: 'Resiliencia Circular', val: 78, color: 'bg-intel' }
                             ].map(stat => (
                               <div key={stat.label} className="space-y-5">
                                  <div className="flex justify-between text-[12px] font-mono font-black uppercase tracking-widest text-stone-500">
                                     <span>{stat.label}</span>
                                     <span className="text-white">{stat.val}%</span>
                                  </div>
                                  <div className="h-[2px] w-full bg-stone-900 rounded-full overflow-hidden">
                                     <div className={`h-full ${stat.color} transition-all duration-[3s] ease-out shadow-[0_0_25px_rgba(255,255,255,0.15)]`} style={{ width: `${stat.val}%` }}></div>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="pt-12 mt-auto space-y-4">
                      <button 
                        onClick={() => handleOfficialRedirect(activeActor.url)}
                        className="w-full h-20 border border-white/10 text-stone-400 rounded-3xl font-mono font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-stone-950 transition-all flex items-center justify-center gap-4"
                      >
                         <span className="material-symbols-outlined text-xl">link</span>
                         Visitar Portal Oficial
                      </button>
                      <button 
                        onClick={() => setView('discovery')}
                        className="w-full h-24 bg-primary text-white rounded-[2.5rem] font-mono font-black text-[13px] uppercase tracking-[0.5em] hover:bg-white hover:text-stone-950 transition-all duration-700 shadow-3xl flex items-center justify-center gap-6 group/btn"
                      >
                        <span className="material-symbols-outlined text-2xl group-hover/btn:rotate-[360deg] duration-1000 transition-transform">bolt</span>
                        Auditar Nodo
                      </button>
                    </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-14">
                    <div className="relative size-56 opacity-10">
                       <div className="absolute inset-0 border border-stone-800 rounded-full animate-spin duration-[25s]"></div>
                       <div className="absolute inset-10 border border-stone-800 rounded-full animate-reverse-spin duration-[18s]"></div>
                       <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-8xl text-stone-600 animate-pulse">radar</span>
                    </div>

                    <div className="space-y-8">
                       <p className="text-5xl font-black text-white/20 uppercase tracking-tighter font-display italic">En Espera</p>
                       <div className="space-y-4">
                          <p className="text-[11px] font-mono font-black text-stone-700 uppercase tracking-[0.6em] leading-relaxed">
                            Sincronice un activo <br/> para iniciar protocolo.
                          </p>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA CON PROFUNDIDAD EXTREMA */}
      <section className="w-full max-w-7xl px-8 py-60">
        <div className="bg-white text-stone-950 rounded-[7rem] p-32 flex flex-col items-center gap-20 relative overflow-hidden group shadow-[0_100px_150px_-50px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 grid-technical opacity-5 pointer-events-none"></div>
          <div className="absolute -bottom-40 -right-40 size-[600px] bg-primary/20 rounded-full blur-[150px] group-hover:bg-primary/40 transition-all duration-[2s]"></div>
          
          <div className="relative z-10 text-center space-y-12">
            <h2 className="text-8xl md:text-[13rem] font-black uppercase tracking-tight leading-[0.8] font-display fluid-title">
              NUEVA <br/><span className="text-primary italic">ERA</span>
            </h2>
            <p className="text-3xl md:text-4xl text-stone-500 font-mono font-medium max-w-4xl mx-auto lowercase leading-tight tracking-tighter">
              Diseñamos las capas de datos necesarias para una economía de <span className="text-stone-950 font-black">residuo cero absoluta</span>.
            </p>
          </div>
          
          <button onClick={() => setView('login')} className="relative z-10 bg-stone-950 text-white px-32 py-12 rounded-full font-mono font-black text-[13px] uppercase tracking-[0.6em] hover:bg-primary transition-all duration-700 shadow-3xl hover:-translate-y-4">
            Iniciar Sincronización
          </button>
        </div>
      </section>

      <style>{`
        @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-reverse-spin { animation: reverse-spin linear infinite; }
      `}</style>
    </div>
  );
};
