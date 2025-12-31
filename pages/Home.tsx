
import React, { useState, useMemo } from 'react';
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
      
      {/* HERO SECTION */}
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

      {/* VISOR DE NODOS OPTIMIZADO */}
      <section className="w-full max-w-[1700px] mx-auto py-20 px-8 space-y-20 relative">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10 border-b border-white/5 pb-16">
           <div className="space-y-4">
              <p className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.8em] mb-2">01.Cartografía_Interconectada</p>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] fluid-title">
                Visor de <span className="text-stone-900 italic">Nodos</span>
              </h2>
           </div>
           
           <div className="glass-liquid p-1.5 rounded-full flex gap-1">
              {['Todos', 'Público', 'Privado', 'Gremio'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMapFilter(type)}
                  className={`px-8 py-3.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest transition-all ${
                    mapFilter === type 
                    ? 'bg-white text-stone-950 shadow-xl' 
                    : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[850px]">
          
          {/* MAP CANVAS CON FOCO DINÁMICO */}
          <div className="lg:col-span-8 bg-stone-950/40 rounded-[4rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 grid-technical opacity-[0.03] pointer-events-none"></div>
            
            {/* Silueta Regional */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] scale-100 blur-[1px]">
              <svg className="h-[90%] text-white" viewBox="0 0 100 100" fill="currentColor">
                <path d="M45,10 L55,15 L65,25 L70,45 L68,65 L60,85 L45,95 L35,80 L32,60 L35,40 L38,20 Z" />
              </svg>
            </div>

            {/* NODOS SENSOR */}
            {filteredActors.map(actor => {
              const isActive = activeActor?.id === actor.id;
              const isOtherActive = activeActor && activeActor.id !== actor.id;

              return (
                <div 
                  key={actor.id} 
                  className={`absolute transition-all duration-1000 ease-out kinetic-layer ${isOtherActive ? 'opacity-20 blur-[1px]' : 'opacity-100'}`} 
                  style={{ 
                    left: actor.x, 
                    top: actor.y, 
                    "--depth": isActive ? 2 : (1 + actor.id * 0.2),
                    zIndex: isActive ? 50 : 10
                  } as any} 
                >
                  <div className="relative group flex flex-col items-center">
                    
                    {/* Indicador de Nodo (Minimalista) */}
                    <div 
                      onClick={() => setActiveActor(actor)}
                      className={`size-14 rounded-2xl flex items-center justify-center border transition-all duration-500 relative cursor-pointer ${
                      isActive 
                      ? 'bg-primary text-white border-primary shadow-[0_0_40px_rgba(118,201,79,0.3)] rotate-[45deg]' 
                      : 'bg-stone-950/80 text-stone-600 border-white/10 hover:border-primary/50 hover:text-primary hover:-translate-y-1'
                    }`}>
                      <span className={`material-symbols-outlined text-2xl transition-transform ${isActive ? '-rotate-[45deg]' : ''}`}>
                        {actor.icon}
                      </span>
                    </div>

                    {/* Etiqueta Flotante (Solo visible en Hover o Active) */}
                    <div className={`absolute top-1/2 -translate-y-1/2 left-full ml-6 transition-all duration-500 pointer-events-none ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                       <div className={`whitespace-nowrap flex flex-col gap-1 p-4 rounded-2xl border backdrop-blur-3xl shadow-3xl ${isActive ? 'bg-white border-white text-stone-950 pointer-events-auto' : 'bg-stone-950/80 border-white/10 text-white'}`}>
                          <div className="flex items-center gap-4">
                             <span className="text-[10px] font-mono font-black uppercase tracking-tighter">{actor.name}</span>
                             {isActive && (
                               <button 
                                onClick={(e) => { e.stopPropagation(); handleOfficialRedirect(actor.url); }}
                                className="size-6 bg-stone-950 text-white rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
                               >
                                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                               </button>
                             )}
                          </div>
                          <div className={`text-[7px] font-mono font-black uppercase tracking-[0.2em] opacity-40`}>
                             NODE_STATUS: ONLINE_OK
                          </div>
                       </div>
                    </div>

                    {/* Anillo de pulso dinámico (Solo activo) */}
                    {isActive && (
                      <div className="absolute inset-0 size-14 border border-primary rounded-2xl animate-ping opacity-40 pointer-events-none"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PANEL LATERAL DE CRISTAL */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-stone-950/40 backdrop-blur-3xl border border-white/5 rounded-[4rem] h-full flex flex-col overflow-hidden relative shadow-2xl">
               <div className="absolute inset-0 grid-technical opacity-[0.02] pointer-events-none"></div>

               {activeActor ? (
                 <div className="flex flex-col h-full animate-fade-in p-12 text-left relative z-10">
                    <div className="space-y-8">
                       <p className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.8em] flex items-center gap-3">
                          <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
                          Access.Node_Secure
                       </p>
                       <h4 className="text-5xl font-black text-white uppercase tracking-tighter leading-tight font-display">
                         {activeActor.name}
                       </h4>
                       <div className="flex gap-2">
                          <span className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-stone-500 text-[9px] font-mono font-black uppercase tracking-widest">
                            Cat_ID: {activeActor.type}
                          </span>
                          <span className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[9px] font-mono font-black uppercase tracking-widest">
                            Regional_Active
                          </span>
                       </div>
                    </div>

                    <div className="flex-1 mt-16 space-y-12">
                       <div className="space-y-8">
                          <p className="text-[9px] font-mono font-black text-stone-700 uppercase tracking-[0.5em] border-b border-white/5 pb-4">Operational_Metrics</p>
                          <div className="space-y-10">
                             {[
                               { label: 'Simbiosis de Red', val: 92, color: 'bg-primary' },
                               { label: 'Resiliencia Circular', val: 78, color: 'bg-intel' }
                             ].map(stat => (
                               <div key={stat.label} className="space-y-4">
                                  <div className="flex justify-between text-[11px] font-mono font-black uppercase tracking-widest text-stone-500">
                                     <span>{stat.label}</span>
                                     <span className="text-white">{stat.val}%</span>
                                  </div>
                                  <div className="h-[2px] w-full bg-stone-900 rounded-full overflow-hidden">
                                     <div className={`h-full ${stat.color} transition-all duration-[2s] ease-out shadow-[0_0_15px_rgba(255,255,255,0.1)]`} style={{ width: `${stat.val}%` }}></div>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="pt-10 mt-auto flex flex-col gap-4">
                      <button 
                        onClick={() => handleOfficialRedirect(activeActor.url)}
                        className="h-16 border border-white/10 text-stone-500 rounded-2xl font-mono font-black text-[9px] uppercase tracking-[0.4em] hover:bg-white hover:text-stone-950 transition-all flex items-center justify-center gap-3"
                      >
                         <span className="material-symbols-outlined text-lg">link</span>
                         Visitar Portal
                      </button>
                      <button 
                        onClick={() => setView('discovery')}
                        className="h-20 bg-primary text-white rounded-3xl font-mono font-black text-[12px] uppercase tracking-[0.4em] hover:bg-white hover:text-stone-950 transition-all duration-500 shadow-3xl flex items-center justify-center gap-4 group/btn"
                      >
                        <span className="material-symbols-outlined text-2xl group-hover/btn:rotate-[360deg] transition-transform duration-700">bolt</span>
                        Auditar Activo
                      </button>
                    </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-10">
                    <div className="relative size-40 opacity-20">
                       <div className="absolute inset-0 border border-stone-800 rounded-full animate-spin duration-[20s]"></div>
                       <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-7xl text-stone-600">radar</span>
                    </div>

                    <div className="space-y-6">
                       <p className="text-4xl font-black text-white/20 uppercase tracking-tighter font-display italic">En Espera</p>
                       <p className="text-[10px] font-mono font-black text-stone-700 uppercase tracking-[0.5em] leading-relaxed max-w-[200px] mx-auto">
                         Sincronice un activo para iniciar protocolo.
                       </p>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="w-full max-w-7xl px-8 py-40">
        <div className="bg-white text-stone-950 rounded-[6rem] p-24 flex flex-col items-center gap-16 relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 grid-technical opacity-5 pointer-events-none"></div>
          
          <div className="relative z-10 text-center space-y-10">
            <h2 className="text-7xl md:text-[11rem] font-black uppercase tracking-tight leading-[0.8] font-display fluid-title">
              NUEVA <br/><span className="text-primary italic">ERA</span>
            </h2>
            <p className="text-2xl md:text-3xl text-stone-500 font-mono font-medium max-w-3xl mx-auto lowercase leading-tight tracking-tighter">
              Diseñamos las capas de datos necesarias para una economía de <span className="text-stone-950 font-black">residuo cero absoluta</span>.
            </p>
          </div>
          
          <button onClick={() => setView('login')} className="relative z-10 bg-stone-950 text-white px-24 py-10 rounded-full font-mono font-black text-[12px] uppercase tracking-[0.6em] hover:bg-primary transition-all duration-700 shadow-3xl">
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
