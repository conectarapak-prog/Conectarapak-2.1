
import React, { useState, useMemo } from 'react';
import { MAP_ACTORS as INITIAL_MAP_ACTORS } from '../constants';

interface HomeProps {
  setView: (v: any) => void;
}

export const Home: React.FC<HomeProps> = ({ setView }) => {
  const [activeActor, setActiveActor] = useState<typeof INITIAL_MAP_ACTORS[0] | null>(null);
  const [mapFilter, setMapFilter] = useState<string>('Todos');

  const TarapacaPath = "M45,10 L55,15 L65,25 L70,45 L68,65 L60,85 L45,95 L35,80 L32,60 L35,40 L38,20 Z";

  const filteredActors = useMemo(() => {
    if (mapFilter === 'Todos') return INITIAL_MAP_ACTORS;
    return INITIAL_MAP_ACTORS.filter(actor => actor.type === mapFilter);
  }, [mapFilter]);

  return (
    <div className="flex flex-col gap-24 animate-fade-in w-full items-center text-center">
      
      {/* ATMÓSFERA 1: MARCA Y VISIÓN */}
      <section className="relative w-full flex flex-col items-center justify-center py-20 lg:py-40 bg-white dark:bg-earth-card rounded-[4rem] border border-stone-100 dark:border-stone-800 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="relative z-10 max-w-4xl px-10 space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
             <span className="material-symbols-outlined text-sm">verified_user</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Plataforma de Impacto Regional</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-stone-900 dark:text-white leading-[0.9] tracking-tighter uppercase font-display">
            REDISEÑANDO EL <br/><span className="text-primary italic">FUTURO</span> CIRCULAR
          </h1>
          <p className="text-lg md:text-xl text-stone-500 font-medium max-w-2xl mx-auto italic leading-relaxed">
            La red de inteligencia colectiva que conecta cada residuo con su próximo valor en la Región de Tarapacá.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
            <button onClick={() => setView('discovery')} className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-hover shadow-2xl shadow-primary/30 transition-all active:scale-95">
              Explorar Ecosistema
            </button>
            <button onClick={() => setView('feed')} className="bg-white dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-100 dark:hover:bg-stone-700 transition-all shadow-sm">
              Ver Feed Comunitario
            </button>
          </div>
        </div>
      </section>

      {/* ATMÓSFERA 2: CARTOGRAFÍA DE IMPACTO OPTIMIZADA */}
      <section className="w-full max-w-6xl mx-auto flex flex-col items-center gap-12 px-6">
        <div className="w-full text-center space-y-6">
           <div className="flex items-center justify-center gap-3 mb-2">
              <span className="h-px w-12 bg-primary/30"></span>
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.7em]">Cartografía de Impacto</h4>
              <span className="h-px w-12 bg-primary/30"></span>
           </div>
           <h3 className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter uppercase leading-none">
             Territorio <span className="text-stone-300 italic">Inteligente</span>
           </h3>
           <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed font-medium max-w-3xl mx-auto">
             Visualiza los nodos críticos de la economía circular. Desde puertos sostenibles hasta hubs tecnológicos, conectamos cada actor para un Tarapacá sin residuos.
           </p>
           
           <div className="flex flex-wrap justify-center gap-3 pt-4">
              {['Todos', 'Público', 'Privado', 'Académico', 'Gremio'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMapFilter(type)}
                  className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border ${
                    mapFilter === type 
                    ? 'bg-primary text-white border-transparent shadow-xl shadow-primary/20 scale-105' 
                    : 'bg-white dark:bg-stone-900 text-stone-400 border-stone-100 dark:border-stone-800 hover:border-primary/50'
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${mapFilter === type ? 'bg-white animate-pulse' : 'bg-stone-200'}`}></span>
                  {type}
                </button>
              ))}
            </div>
        </div>

        {/* MAP CONTAINER */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* VISTA MAPA */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-[3.5rem] relative overflow-hidden shadow-2xl border border-stone-100 dark:border-stone-800 h-[650px] group">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            {/* Regional SVG Outline */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] dark:opacity-[0.1] pointer-events-none group-hover:opacity-10 transition-opacity">
              <svg className="h-[90%] text-primary" viewBox="0 0 100 100" fill="currentColor">
                <path d={TarapacaPath} />
              </svg>
            </div>

            {/* Pins */}
            {filteredActors.map(actor => (
              <div 
                key={actor.id} 
                className="absolute cursor-pointer transition-all duration-500" 
                style={{ left: actor.x, top: actor.y, transform: 'translate(-50%, -50%)' }} 
                onClick={() => setActiveActor(actor)}
              >
                <div className="relative flex items-center justify-center">
                  {/* Pulse Effect */}
                  <div className={`absolute inset-0 rounded-full bg-primary/20 animate-ping duration-[3000ms] ${activeActor?.id === actor.id ? 'opacity-100 scale-150' : 'opacity-0'}`}></div>
                  
                  {/* Pin Circle */}
                  <div className={`size-14 bg-white dark:bg-earth-card rounded-[1.5rem] flex items-center justify-center shadow-2xl border transition-all duration-500 group/pin relative z-10 ${
                    activeActor?.id === actor.id 
                    ? 'border-primary ring-8 ring-primary/5 scale-125' 
                    : 'border-stone-100 dark:border-stone-800 hover:scale-110 hover:border-primary/50'
                  }`}>
                    <span className={`material-symbols-outlined text-2xl transition-colors duration-300 ${activeActor?.id === actor.id ? 'text-primary font-bold' : 'text-stone-300 group-hover/pin:text-primary'}`}>
                      {actor.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Map Controls / Labels */}
            <div className="absolute bottom-10 left-10 flex flex-col gap-2">
               <div className="flex items-center gap-2 bg-white/80 dark:bg-stone-900/80 backdrop-blur px-4 py-2 rounded-xl border border-stone-100 dark:border-stone-800">
                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  <p className="text-[8px] font-black uppercase tracking-widest text-stone-500">Iquique Core Active</p>
               </div>
               <div className="flex items-center gap-2 bg-white/80 dark:bg-stone-900/80 backdrop-blur px-4 py-2 rounded-xl border border-stone-100 dark:border-stone-800">
                  <span className="size-2 rounded-full bg-intel animate-pulse"></span>
                  <p className="text-[8px] font-black uppercase tracking-widest text-stone-500">ZOFRI Hub Sincronizado</p>
               </div>
            </div>
          </div>

          {/* PANEL DE DETALLE DE NODO */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[3.5rem] h-full flex flex-col p-10 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none rotate-12">
                  <span className="material-symbols-outlined text-[10rem] text-primary">radar</span>
               </div>

               {activeActor ? (
                 <div className="flex flex-col h-full animate-fade-in space-y-8 relative z-10 text-left">
                    <div className="space-y-4">
                       <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10 inline-block">
                         {activeActor.type}
                       </span>
                       <h4 className="text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tighter leading-tight">
                         {activeActor.name}
                       </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-[2rem] border border-stone-100 dark:border-stone-800">
                          <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2">Impacto Circular</p>
                          <p className="text-2xl font-black text-primary">92%</p>
                       </div>
                       <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-[2rem] border border-stone-100 dark:border-stone-800">
                          <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2">Conexiones</p>
                          <p className="text-2xl font-black text-primary">15+</p>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4">
                       <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Estatus del Nodo</p>
                       <div className="space-y-2">
                          {[
                            { label: 'Sostenibilidad', val: 85, color: 'bg-primary' },
                            { label: 'Transparencia', val: 94, color: 'bg-intel' },
                            { label: 'Innovación', val: 78, color: 'bg-blue-500' }
                          ].map(stat => (
                            <div key={stat.label} className="space-y-1.5">
                               <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-stone-500">
                                  <span>{stat.label}</span>
                                  <span>{stat.val}%</span>
                               </div>
                               <div className="h-1 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                  <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="flex-1"></div>

                    <button 
                      onClick={() => setView('discovery')}
                      className="w-full h-16 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                    >
                      <span className="material-symbols-outlined text-sm">hub</span>
                      Analizar Sinergias
                    </button>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 grayscale pointer-events-none">
                    <span className="material-symbols-outlined text-[100px] text-stone-200">near_me</span>
                    <div className="space-y-2">
                       <p className="text-2xl font-black uppercase tracking-tighter">Nodo Standby</p>
                       <p className="text-sm font-bold max-w-[200px] mx-auto leading-relaxed italic">
                         Selecciona un actor en el mapa para inicializar el perfil de impacto regional.
                       </p>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* ATMÓSFERA 3: CTA FINAL */}
      <section className="w-full max-w-5xl bg-primary p-12 md:p-20 rounded-[4rem] text-white flex flex-col items-center gap-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-40 bg-white/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-center leading-[0.9] relative z-10">
          ¿LISTO PARA TRANSFORMAR <br/><span className="text-primary-light">TU PROYECTO?</span>
        </h2>
        <p className="text-lg md:text-xl text-primary-light/80 font-medium text-center max-w-2xl relative z-10">
          Únete a la red más grande de economía circular del norte de Chile. Financiamiento, mentoría y tecnología a tu alcance.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
           <button onClick={() => setView('login')} className="bg-white text-primary px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95">
             Empezar Ahora
           </button>
           <button onClick={() => setView('contact')} className="bg-transparent border-2 border-white/30 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
             Saber Más
           </button>
        </div>
      </section>
    </div>
  );
};
