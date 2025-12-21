
import React, { useState, useMemo } from 'react';
import { MAP_ACTORS as INITIAL_MAP_ACTORS, SPONSORS } from '../constants';
import { summarizeNews, generateRegionalTrends } from '../services/geminiService';
import { NewsItem } from '../types';

interface HomeProps {
  setView: (v: any) => void;
  news: NewsItem[];
}

export const Home: React.FC<HomeProps> = ({ setView, news }) => {
  const [mapActors, setMapActors] = useState(INITIAL_MAP_ACTORS);
  const [activeActor, setActiveActor] = useState<typeof INITIAL_MAP_ACTORS[0] | null>(null);
  const [hoveredActorId, setHoveredActorId] = useState<number | null>(null);
  const [mapFilter, setMapFilter] = useState<string>('Todos');
  
  const [newsSearch, setNewsSearch] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [savedNews, setSavedNews] = useState<number[]>([]);
  const [regionalTrends, setRegionalTrends] = useState<string | null>(null);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  const TarapacaPath = "M45,10 L55,15 L65,25 L70,45 L68,65 L60,85 L45,95 L35,80 L32,60 L35,40 L38,20 Z";

  const filterOptions = [
    { type: 'Todos', color: 'bg-stone-400', icon: 'apps' },
    { type: 'Público', color: 'bg-blue-500', icon: 'account_balance' },
    { type: 'Privado', color: 'bg-green-500', icon: 'corporate_fare' },
    { type: 'Académico', color: 'bg-purple-500', icon: 'school' },
    { type: 'Gremio', color: 'bg-amber-500', icon: 'inventory_2' },
    { type: 'ONG', color: 'bg-rose-500', icon: 'favorite' }
  ];

  const filteredActors = useMemo(() => {
    if (mapFilter === 'Todos') return mapActors;
    return mapActors.filter(actor => actor.type === mapFilter);
  }, [mapFilter, mapActors]);

  const filteredNews = useMemo(() => {
    return news.filter(n => 
      n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(newsSearch.toLowerCase())
    );
  }, [newsSearch, news]);

  const handleNewsClick = async (n: NewsItem) => {
    setSelectedNews(n);
    setAiSummary(null);
    if (n.isAI) {
      setAiSummary(n.excerpt);
    } else {
      setIsSummarizing(true);
      const summary = await summarizeNews(n.title, n.excerpt);
      setAiSummary(summary);
      setIsSummarizing(false);
    }
  };

  const toggleSaveNews = (e: React.MouseEvent, id: any) => {
    e.stopPropagation();
    const nid = typeof id === 'string' ? parseInt(id) : id;
    setSavedNews(prev => prev.includes(nid) ? prev.filter(item => item !== nid) : [...prev, nid]);
  };

  const handleGenerateTrends = async () => {
    setIsLoadingTrends(true);
    const trends = await generateRegionalTrends();
    setRegionalTrends(trends);
    setIsLoadingTrends(false);
  };

  const getActorCount = (type: string) => {
    return type === 'Todos' ? mapActors.length : mapActors.filter(a => a.type === type).length;
  };

  const infiniteSponsors = [...SPONSORS, ...SPONSORS];

  return (
    <div className="flex flex-col animate-fade-in -mt-10 pb-20">
      {/* Hero Section Resiliente */}
      <section className="relative h-[80vh] md:h-[85vh] w-full flex items-center justify-center overflow-hidden rounded-b-[3rem] md:rounded-b-[4rem] shadow-2xl px-4">
        <img 
          src="https://images.unsplash.com/photo-1518005020251-582964841930?auto=format&fit=crop&q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-r from-earth-surface/90 via-earth-surface/60 md:via-earth-surface/40 to-transparent"></div>
        <div className="relative z-10 max-w-[1440px] w-full px-4 md:px-10 text-center md:text-left">
          <div className="max-w-3xl space-y-6 mx-auto md:mx-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-md border border-white/10 text-primary-light text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Inteligencia Territorial
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] font-display tracking-tighter">
              CONECTARA<br/><span className="text-primary italic">PAK</span> SMART
            </h1>
            <p className="text-base md:text-xl text-stone-200 font-medium max-w-xl leading-relaxed mx-auto md:mx-0">
              Plataforma de aceleración para el desarrollo sostenible y la economía circular. Conectamos talento, tecnología e impacto.
            </p>
            <div className="flex justify-center md:justify-start gap-4 pt-4">
              <button onClick={() => setView('discovery')} className="bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold hover:bg-primary-hover transition-all flex items-center gap-2 shadow-2xl shadow-primary/30 text-sm md:text-base">
                Explorar Proyectos <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION - Centrado Resiliente */}
      <section id="ecosystem-map" className="py-20 md:py-32 px-4 md:px-10 max-w-[1440px] mx-auto w-full scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start">
          
          <div className="lg:col-span-5 space-y-10 md:space-y-12 text-center lg:text-left">
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                 <div className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_#599E39] animate-pulse"></div>
                 <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Mapeo de Impacto Regional</h2>
              </div>
              <h3 className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter text-stone-800 leading-[0.9]">
                Actores del <br className="hidden md:block"/>
                <span className="text-stone-300 dark:text-stone-700">Ecosistema</span>
              </h3>
              <p className="text-stone-500 text-base md:text-lg leading-relaxed font-medium max-w-md mx-auto lg:mx-0 px-4 md:px-0">
                Monitor de nodos estratégicos vinculados a la economía circular en la Región de Tarapacá. Inteligencia territorial en tiempo real.
              </p>
            </div>

            <div className="bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden text-left mx-auto max-w-lg lg:max-w-none">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-stone-400 rotate-12 hidden md:block">
                 <span className="material-symbols-outlined text-9xl">layers</span>
              </div>
              
              <div className="relative z-10 space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-6">Filtrar Infraestructura</h4>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {filterOptions.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => setMapFilter(item.type)}
                      className={`group relative flex flex-col items-start gap-1 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                        mapFilter === item.type 
                        ? 'bg-stone-800 dark:bg-stone-900 text-white border-transparent shadow-2xl scale-[1.02]' 
                        : 'bg-stone-50 dark:bg-earth-surface border-stone-100 dark:border-stone-800 text-stone-600 hover:border-primary/50'
                      }`}
                    >
                      <div className={`size-2 rounded-full mb-3 ${item.color}`}></div>
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{item.type}</span>
                      <span className={`text-[8px] md:text-[9px] font-bold mt-1 uppercase text-stone-400`}>
                        {getActorCount(item.type)} Nodos
                      </span>
                      {mapFilter === item.type && (
                         <div className="absolute top-4 right-4 animate-pulse">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                         </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mapa Interactivo - Contenedor Fluido */}
          <div className="lg:col-span-7 h-[500px] md:h-[750px] bg-stone-50 dark:bg-stone-900 rounded-[3.5rem] md:rounded-[5rem] relative overflow-hidden shadow-inner border border-stone-100 dark:border-stone-800 group mx-auto w-full">
            <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="h-[85%] md:h-[90%] text-primary/10 transition-colors duration-1000" viewBox="0 0 100 100" fill="currentColor">
                <path d={TarapacaPath} className="drop-shadow-2xl" />
              </svg>
            </div>

            {filteredActors.map(actor => (
              <div 
                key={actor.id} 
                className={`absolute transition-all duration-700 ease-out ${hoveredActorId === actor.id || activeActor?.id === actor.id ? 'z-[60]' : 'z-10'}`}
                style={{ left: actor.x, top: actor.y }}
                onMouseEnter={() => setHoveredActorId(actor.id)}
                onMouseLeave={() => setHoveredActorId(null)}
                onClick={() => setActiveActor(actor)}
              >
                <div className="relative cursor-pointer group/marker">
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 md:px-4 py-2 bg-stone-800 dark:bg-stone-950 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl transition-all duration-300 pointer-events-none whitespace-nowrap flex flex-col items-center border border-white/10 ${
                    hoveredActorId === actor.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
                  }`}>
                    <span className="font-bold">{actor.name}</span>
                    <span className="text-[8px] opacity-60 mt-0.5 tracking-[0.2em]">{actor.type.toUpperCase()}</span>
                    <div className="absolute top-[95%] left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-t-[6px] border-t-stone-800 dark:border-t-stone-950"></div>
                  </div>
                  {(activeActor?.id === actor.id || hoveredActorId === actor.id) && (
                    <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-primary animate-ping opacity-30"></div>
                  )}
                  <div className={`relative size-10 md:size-12 bg-white dark:bg-earth-card rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl border-2 transition-all duration-300 ${
                    activeActor?.id === actor.id 
                    ? 'border-primary scale-110' 
                    : hoveredActorId === actor.id ? 'border-primary/40' : 'border-transparent'
                  }`}>
                    <span className={`material-symbols-outlined text-xl md:text-2xl transition-colors ${activeActor?.id === actor.id || hoveredActorId === actor.id ? 'text-primary' : 'text-stone-500'}`}>
                      {actor.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {activeActor && (
              <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 left-6 md:left-auto lg:w-[400px] bg-white/95 dark:bg-earth-card/95 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-stone-200/50 dark:border-stone-800/50 shadow-2xl animate-[slide-up_0.4s_ease-out] z-[100]">
                 <div className="flex justify-between items-start mb-6 md:mb-8">
                    <div className="flex items-center gap-4 md:gap-5">
                       <div className={`size-14 md:size-16 rounded-2xl flex items-center justify-center ${
                         activeActor.type === 'Público' ? 'bg-primary/10 text-primary' : 
                         activeActor.type === 'Gremio' ? 'bg-amber-100 text-amber-600' : 
                         activeActor.type === 'Académico' ? 'bg-purple-100 text-purple-600' : 'bg-stone-100 text-stone-500'
                       }`}>
                          <span className="material-symbols-outlined text-2xl md:text-3xl">{activeActor.icon}</span>
                       </div>
                       <div>
                          <h5 className="text-xl md:text-2xl font-black dark:text-white leading-none tracking-tight">{activeActor.name}</h5>
                          <p className="text-[10px] md:text-[11px] font-black text-stone-400 uppercase tracking-widest mt-1.5 md:mt-2">{activeActor.type}</p>
                       </div>
                    </div>
                    <button onClick={() => setActiveActor(null)} className="size-8 md:size-10 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-300 transition-all">
                       <span className="material-symbols-outlined text-xl md:text-2xl">close</span>
                    </button>
                 </div>
                 <div className="space-y-6">
                    <div className="p-6 md:p-8 bg-stone-50/50 dark:bg-stone-900/50 rounded-2xl border border-stone-100/50 dark:border-stone-800/50">
                       <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Impacto IA Estimado</p>
                       <p className="text-sm md:text-base font-medium text-stone-600 dark:text-stone-300 leading-relaxed italic">
                          Gestión activa de vinculación industrial en el territorio.
                       </p>
                    </div>
                    <button onClick={() => setView('dashboard')} className="w-full py-5 md:py-6 bg-stone-800 dark:bg-stone-900 text-white rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl">
                       Ver Nodo Estratégico
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* NEWS SECTION - Centrado Resiliente */}
      <section className="bg-stone-100 dark:bg-earth-dark py-20 md:py-32 px-4 md:px-10 rounded-[3rem] md:rounded-[5rem] -mt-20 relative z-20 shadow-2xl">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 mb-16 md:mb-20 text-center md:text-left">
            <div className="space-y-4 flex-1 w-full">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Actualidad Tarapacá</h2>
              <h3 className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter leading-[0.9] font-display">
                Noticias del <br className="hidden md:block"/><span className="text-stone-300 dark:text-stone-800">Ecosistema</span>
              </h3>
              
              <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 max-w-xl mx-auto md:mx-0">
                <div className="flex-1 relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400">search</span>
                  <input 
                    type="text" 
                    placeholder="Buscar noticias e insights..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="w-full bg-white dark:bg-earth-card border-none rounded-2xl md:rounded-3xl py-4 md:py-6 pl-14 md:pl-16 pr-6 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none shadow-xl"
                  />
                </div>
                <button 
                  onClick={handleGenerateTrends}
                  disabled={isLoadingTrends}
                  className="bg-primary text-white h-[56px] md:h-auto px-8 rounded-2xl md:rounded-3xl flex items-center justify-center gap-3 hover:bg-primary-hover shadow-xl shadow-primary/20"
                >
                  <span className={`material-symbols-outlined ${isLoadingTrends ? 'animate-spin' : ''}`}>
                    {isLoadingTrends ? 'sync' : 'auto_awesome'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest">IA</span>
                </button>
              </div>
            </div>
          </div>

          {regionalTrends && (
            <div className="mb-12 p-8 md:p-10 bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl animate-fade-in relative overflow-hidden group">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">trending_up</span> Inteligencia Territorial IA
              </h4>
              <p className="text-base md:text-lg font-medium text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed italic">
                {regionalTrends}
              </p>
              <button onClick={() => setRegionalTrends(null)} className="mt-8 text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                Cerrar Reporte <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            {filteredNews.length > 0 ? (
              <>
                <div className="lg:col-span-8 group cursor-pointer" onClick={() => handleNewsClick(filteredNews[0])}>
                  <div className={`relative aspect-[16/10] md:aspect-[16/8] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl bg-stone-200 dark:bg-stone-800 border-4 ${filteredNews[0].isAI ? 'border-primary/50' : 'border-transparent'}`}>
                    <img src={filteredNews[0].image} alt={filteredNews[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 right-8 md:right-12">
                      <p className="text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-3 md:mb-4">{filteredNews[0].date}</p>
                      <h4 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 md:mb-6 tracking-tighter">
                        {filteredNews[0].title}
                      </h4>
                      <p className="text-stone-300 text-base md:text-xl leading-relaxed line-clamp-2 max-w-3xl font-medium italic opacity-80">
                        {filteredNews[0].excerpt}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                  {filteredNews.slice(1, 4).map((n) => (
                    <div key={n.id} onClick={() => handleNewsClick(n)} className="group flex gap-5 items-center p-5 rounded-[2rem] hover:bg-white dark:hover:bg-earth-card transition-all duration-500 border border-transparent hover:border-stone-100 dark:hover:border-stone-800 cursor-pointer">
                      <div className="size-20 md:size-24 rounded-2xl overflow-hidden shrink-0 shadow-lg bg-stone-200 dark:bg-stone-800">
                        <img src={n.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={n.title} />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-stone-400">{n.category}</span>
                        <h5 className="text-base md:text-lg font-black dark:text-white leading-tight group-hover:text-primary transition-colors tracking-tight line-clamp-2">
                          {n.title}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes slide-left { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};
