
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

      {/* ATMÓSFERA 2: MAPA DE RED */}
      <section className="w-full flex flex-col items-center gap-20">
        <div className="max-w-3xl space-y-6">
           <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.7em]">Cartografía de Impacto</h4>
           <h3 className="text-5xl md:text-6xl font-black dark:text-white tracking-tighter uppercase leading-none">
             Territorio <span className="text-stone-300 italic">Inteligente</span>
           </h3>
           <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed font-medium">
             Visualiza los nodos críticos de la economía circular. Desde puertos sostenibles hasta hubs tecnológicos, conectamos cada actor para un Tarapacá sin residuos.
           </p>
           <div className="flex flex-wrap justify-center gap-3 pt-6">
              {['Todos', 'Público', 'Privado', 'Académico', 'Gremio'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMapFilter(type)}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    mapFilter === type ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white dark:bg-stone-800 text-stone-400 border border-stone-100 dark:border-stone-800 hover:border-primary/50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
        </div>

        <div className="w-full max-w-5xl h-[600px] bg-white dark:bg-stone-900 rounded-[4rem] relative overflow-hidden shadow-2xl border border-stone-100 dark:border-stone-800 group">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <svg className="h-[90%] text-primary" viewBox="0 0 100 100" fill="currentColor"><path d={TarapacaPath} /></svg>
          </div>
          {filteredActors.map(actor => (
            <div key={actor.id} className="absolute cursor-pointer group/pin" style={{ left: actor.x, top: actor.y }} onClick={() => setActiveActor(actor)}>
              <div className={`size-12 bg-white dark:bg-earth-card rounded-2xl flex items-center justify-center shadow-2xl border transition-all group-hover/pin:scale-125 ${activeActor?.id === actor.id ? 'border-primary ring-8 ring-primary/5 shadow-primary/30' : 'border-stone-100 dark:border-stone-800'}`}>
                <span className={`material-symbols-outlined text-2xl ${activeActor?.id === actor.id ? 'text-primary' : 'text-stone-300'}`}>{actor.icon}</span>
              </div>
              {activeActor?.id === actor.id && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-stone-800 p-6 rounded-[2rem] shadow-2xl border border-primary/20 z-50 animate-fade-in text-center">
                   <p className="text-[9px] font-black text-primary uppercase mb-1 tracking-widest">{actor.type}</p>
                   <p className="text-xs font-black dark:text-white leading-tight uppercase">{actor.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
