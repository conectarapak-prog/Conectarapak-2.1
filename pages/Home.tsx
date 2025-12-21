
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
      setAiSummary(n.excerpt); // Si es un insight, el extracto ya es el análisis
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
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden rounded-b-[4rem] shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1518005020251-582964841930?auto=format&fit=crop&q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-surface/90 via-earth-surface/40 to-transparent"></div>
        <div className="relative z-10 max-w-[1440px] w-full px-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-md border border-white/10 text-primary-light text-xs font-black uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Inteligencia Territorial
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] font-display tracking-tighter">
              CONECTARA<br/><span className="text-primary italic">PAK</span> SMART
            </h1>
            <p className="text-xl text-stone-200 font-medium max-w-xl leading-relaxed">
              Plataforma de aceleración para el desarrollo sostenible y la economía circular. Conectamos talento, tecnología e impacto.
            </p>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setView('discovery')} className="bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:bg-primary-hover transition-all flex items-center gap-2 shadow-2xl shadow-primary/30">
                Explorar Proyectos <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section id="ecosystem-map" className="py-32 px-10 max-w-[1440px] mx-auto w-full scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* Left Column: Text & Filters */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="size-1 rounded-full bg-primary shadow-[0_0_10px_#599E39] animate-pulse"></div>
                 <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Mapeo de Impacto Regional</h2>
              </div>
              <h3 className="text-7xl font-black dark:text-white tracking-tighter text-stone-800 leading-[0.85]">
                Actores del <br/>
                <span className="text-stone-300 dark:text-stone-700">Ecosistema</span>
              </h3>
              <p className="text-stone-500 text-lg leading-relaxed font-medium max-w-md">
                Monitor de nodos estratégicos vinculados a la economía circular en la Región de Tarapacá. Inteligencia territorial en tiempo real.
              </p>
            </div>

            {/* Filter Cards */}
            <div className="bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-stone-400 rotate-12">
                 <span className="material-symbols-outlined text-9xl">layers</span>
              </div>
              
              <div className="relative z-10 space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-6">Filtrar Infraestructura</h4>
                <div className="grid grid-cols-2 gap-4">
                  {filterOptions.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => setMapFilter(item.type)}
                      className={`group relative flex flex-col items-start gap-1 p-6 rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                        mapFilter === item.type 
                        ? 'bg-stone-800 dark:bg-stone-900 text-white border-transparent shadow-2xl scale-[1.02]' 
                        : 'bg-stone-50 dark:bg-earth-surface border-stone-100 dark:border-stone-800 text-stone-600 hover:border-primary/50'
                      }`}
                    >
                      <div className={`size-2 rounded-full mb-3 ${item.color}`}></div>
                      <span className="text-xs font-black uppercase tracking-widest">{item.type}</span>
                      <span className={`text-[9px] font-bold mt-1 uppercase transition-colors ${mapFilter === item.type ? 'text-stone-400' : 'text-stone-400'}`}>
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

          {/* Right Column: Interactive Map */}
          <div className="lg:col-span-7 h-[750px] bg-stone-50 dark:bg-stone-900 rounded-[5rem] relative overflow-hidden shadow-inner border border-stone-100 dark:border-stone-800 group">
            <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="h-[90%] text-primary/10 transition-colors duration-1000" viewBox="0 0 100 100" fill="currentColor">
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
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-stone-800 dark:bg-stone-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl transition-all duration-300 pointer-events-none whitespace-nowrap flex flex-col items-center border border-white/10 ${
                    hoveredActorId === actor.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
                  }`}>
                    <span className="font-bold">{actor.name}</span>
                    <span className="text-[8px] opacity-60 mt-0.5 tracking-[0.2em]">{actor.type.toUpperCase()}</span>
                    <div className="absolute top-[95%] left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-t-[6px] border-t-stone-800 dark:border-t-stone-950"></div>
                  </div>
                  {(activeActor?.id === actor.id || hoveredActorId === actor.id) && (
                    <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-30"></div>
                  )}
                  <div className={`relative size-12 bg-white dark:bg-earth-card rounded-2xl flex items-center justify-center shadow-xl border-2 transition-all duration-300 ${
                    activeActor?.id === actor.id 
                    ? 'border-primary scale-110 shadow-primary/20' 
                    : hoveredActorId === actor.id ? 'border-primary/40 scale-105' : 'border-transparent'
                  }`}>
                    <span className={`material-symbols-outlined text-2xl transition-colors ${activeActor?.id === actor.id || hoveredActorId === actor.id ? 'text-primary font-bold' : 'text-stone-500'}`}>
                      {actor.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {activeActor && (
              <div className="absolute bottom-10 right-10 left-10 lg:left-auto lg:w-[400px] bg-white/95 dark:bg-earth-card/95 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-stone-200/50 dark:border-stone-800/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-[slide-up_0.4s_ease-out] z-[100]">
                 <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-5">
                       <div className={`size-16 rounded-[1.5rem] flex items-center justify-center ${
                         activeActor.type === 'Público' ? 'bg-primary/10 text-primary' : 
                         activeActor.type === 'Gremio' ? 'bg-amber-100 text-amber-600' : 
                         activeActor.type === 'Académico' ? 'bg-purple-100 text-purple-600' : 'bg-stone-100 text-stone-500'
                       }`}>
                          <span className="material-symbols-outlined text-3xl">{activeActor.icon}</span>
                       </div>
                       <div>
                          <h5 className="text-2xl font-black dark:text-white leading-none tracking-tight">{activeActor.name}</h5>
                          <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest mt-2">{activeActor.type}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setActiveActor(null)} 
                      className="size-10 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-300 hover:text-stone-800 transition-all active:scale-90"
                    >
                       <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                 </div>
                 <div className="space-y-6">
                    <div className="p-8 bg-stone-50/50 dark:bg-stone-900/50 rounded-[2rem] border border-stone-100/50 dark:border-stone-800/50">
                       <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Impacto IA Estimado</p>
                       <p className="text-base font-medium text-stone-600 dark:text-stone-300 leading-relaxed">
                          Este nodo gestiona activamente la vinculación de 12 proyectos circulares en la zona.
                       </p>
                    </div>
                    <button 
                      onClick={() => setView('dashboard')}
                      className="w-full py-6 bg-stone-800 dark:bg-stone-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                       <span className="material-symbols-outlined text-lg">hub</span>
                       Ver Nodo Estratégico
                    </button>
                 </div>
              </div>
            )}
            {!activeActor && (
               <div className="absolute top-10 left-10 p-6 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/20">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 flex items-center gap-2">
                     <span className="material-symbols-outlined text-sm">touch_app</span> Selecciona un nodo para analizar
                  </p>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* NEWS SECTION */}
      <section className="bg-stone-100 dark:bg-earth-dark py-32 px-10 rounded-[5rem] -mt-20 relative z-20 shadow-2xl">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="space-y-4 flex-1">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Actualidad Tarapacá</h2>
              <h3 className="text-7xl font-black dark:text-white tracking-tighter leading-[0.8] font-display">
                Noticias del <br/><span className="text-stone-300 dark:text-stone-800">Ecosistema</span>
              </h3>
              
              <div className="mt-12 flex gap-4 max-w-xl">
                <div className="flex-1 relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400">search</span>
                  <input 
                    type="text" 
                    placeholder="Buscar noticias e insights..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="w-full bg-white dark:bg-earth-card border-none rounded-3xl py-6 pl-16 pr-6 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none shadow-xl"
                  />
                </div>
                <button 
                  onClick={handleGenerateTrends}
                  disabled={isLoadingTrends}
                  className="bg-primary text-white px-8 rounded-3xl flex items-center gap-3 hover:bg-primary-hover transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
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
            <div className="mb-12 p-10 bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 rounded-[3rem] shadow-2xl animate-fade-in relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 p-20 opacity-[0.03] text-primary rotate-12">
                <span className="material-symbols-outlined text-[12rem]">psychology</span>
              </div>
              <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">trending_up</span> Inteligencia Territorial IA
              </h4>
              <p className="text-lg font-medium text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed max-w-4xl italic">
                {regionalTrends}
              </p>
              <button onClick={() => setRegionalTrends(null)} className="mt-8 text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                Cerrar Reporte <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {filteredNews.length > 0 ? (
              <>
                <div className="lg:col-span-8 group cursor-pointer" onClick={() => handleNewsClick(filteredNews[0])}>
                  <div className={`relative aspect-[16/8] rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] bg-stone-200 dark:bg-stone-800 border-4 ${filteredNews[0].isAI ? 'border-primary/50' : 'border-transparent'}`}>
                    <img 
                      src={filteredNews[0].image} 
                      alt={filteredNews[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    <div className="absolute top-10 left-10 flex gap-3">
                      <span className={`px-6 py-2.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl ${filteredNews[0].isAI ? 'bg-stone-900' : 'bg-primary'}`}>
                        {filteredNews[0].category}
                      </span>
                      {filteredNews[0].isAI && (
                        <span className="px-6 py-2.5 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-2xl animate-pulse">
                          Insight IA
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-12 left-12 right-12">
                      <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">{filteredNews[0].date}</p>
                      <h4 className="text-5xl font-black text-white leading-none mb-6 tracking-tighter">
                        {filteredNews[0].title}
                      </h4>
                      <p className="text-stone-300 text-xl leading-relaxed line-clamp-2 max-w-3xl font-medium italic opacity-80">
                        {filteredNews[0].excerpt}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                  {filteredNews.slice(1).map((n) => (
                    <div key={n.id} onClick={() => handleNewsClick(n)} className={`group flex gap-6 items-center p-6 rounded-[3rem] hover:bg-white dark:hover:bg-earth-card transition-all duration-500 border-2 cursor-pointer hover:shadow-xl ${n.isAI ? 'border-primary/20 bg-primary/5' : 'border-transparent hover:border-stone-100 dark:hover:border-stone-800'}`}>
                      <div className="size-28 rounded-[2rem] overflow-hidden shrink-0 shadow-lg bg-stone-200 dark:bg-stone-800 relative">
                        <img 
                          src={n.image} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt={n.title}
                        />
                        {n.isAI && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                             <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${n.isAI ? 'text-primary' : 'text-stone-400'}`}>{n.category}</span>
                        <h5 className="text-lg font-black dark:text-white leading-tight group-hover:text-primary transition-colors tracking-tight">
                          {n.title}
                        </h5>
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{n.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="lg:col-span-12 py-32 text-center bg-white dark:bg-earth-card rounded-[4rem] border border-stone-100 dark:border-stone-800">
                <span className="material-symbols-outlined text-8xl text-stone-100 mb-6">newspaper</span>
                <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">No hay noticias para "{newsSearch}"</p>
                <button onClick={() => setNewsSearch('')} className="mt-6 text-primary font-black uppercase tracking-widest text-xs hover:underline">Reiniciar Búsqueda</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedNews && (
        <div className="fixed inset-0 z-[300] flex items-center justify-end bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl h-full bg-white dark:bg-earth-card shadow-2xl overflow-y-auto animate-[slide-left_0.5s_ease-out] flex flex-col custom-scrollbar">
            <div className="sticky top-0 z-50 p-8 bg-white/80 dark:bg-earth-card/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
               <button onClick={() => setSelectedNews(null)} className="size-12 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-transform hover:rotate-90">
                 <span className="material-symbols-outlined">close</span>
               </button>
               <div className="flex gap-4">
                 <button className="size-12 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors">
                   <span className="material-symbols-outlined text-xl">share</span>
                 </button>
                 <button onClick={(e) => toggleSaveNews(e, selectedNews.id)} className={`size-12 rounded-full border flex items-center justify-center transition-all ${
                   savedNews.includes(typeof selectedNews.id === 'string' ? parseInt(selectedNews.id) : selectedNews.id) ? 'bg-primary text-white border-primary' : 'border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-50'
                 }`}>
                   <span className={`material-symbols-outlined text-xl ${savedNews.includes(typeof selectedNews.id === 'string' ? parseInt(selectedNews.id) : selectedNews.id) ? 'fill-1' : ''}`}>bookmark</span>
                 </button>
               </div>
            </div>

            <div className="p-12 space-y-12">
              <div className="aspect-video rounded-[4rem] overflow-hidden shadow-2xl relative">
                 <img src={selectedNews.image} className="w-full h-full object-cover" alt={selectedNews.title} />
                 {selectedNews.isAI && (
                    <div className="absolute top-10 right-10 bg-primary text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">
                       Gemini Pro Verified
                    </div>
                 )}
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-6">
                   <span className="px-6 py-2 rounded-2xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{selectedNews.category}</span>
                   <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest">{selectedNews.date}</span>
                 </div>
                 <h2 className="text-6xl font-black dark:text-white tracking-tighter leading-none">{selectedNews.title}</h2>
              </div>

              <div className="bg-stone-50 dark:bg-stone-900 rounded-[3rem] p-10 border border-stone-100 dark:border-stone-800 relative overflow-hidden group">
                 <div className="absolute -top-4 -right-4 p-12 opacity-[0.05] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-9xl text-primary">psychology</span>
                 </div>
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                   <span className="material-symbols-outlined text-sm">auto_awesome</span> {selectedNews.isAI ? 'Resumen Técnico del Insight' : 'Resumen Estratégico IA'}
                 </h4>
                 
                 {isSummarizing ? (
                   <div className="space-y-6 animate-pulse">
                     <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-full w-full"></div>
                     <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-full w-5/6"></div>
                     <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-full w-4/6"></div>
                   </div>
                 ) : (
                   <div className="prose dark:prose-invert max-w-none text-base font-medium leading-loose text-stone-600 dark:text-stone-300 whitespace-pre-wrap">
                      {aiSummary}
                   </div>
                 )}
              </div>

              {!selectedNews.isAI && (
                <div className="prose dark:prose-invert max-w-none text-xl leading-relaxed text-stone-700 dark:text-stone-200 font-medium opacity-80">
                  {selectedNews.excerpt}
                  <p className="mt-10 pt-10 border-t border-stone-100 dark:border-stone-800 text-sm italic">
                    Monitor de circularidad regional - CONECTARAPAK 2024.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Partners Section */}
      <section className="bg-white dark:bg-earth-surface py-32 overflow-hidden">
        <div className="relative flex gap-10 overflow-hidden select-none group/marquee">
          <div className="flex shrink-0 items-center justify-around gap-10 min-w-full animate-[marquee_40s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
            {infiniteSponsors.map((sponsor, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-10 bg-stone-50 dark:bg-earth-card border border-stone-100 dark:border-stone-800 rounded-[3rem] w-80 h-56 hover:shadow-2xl transition-all group/card">
                <div className="h-24 w-full flex items-center justify-center grayscale group-hover/card:grayscale-0 opacity-40 group-hover/card:opacity-100 transition-all duration-500">
                  <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain px-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes slide-left { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .fill-1 { font-variation-settings: 'FILL' 1; }
      `}</style>
    </div>
  );
};
