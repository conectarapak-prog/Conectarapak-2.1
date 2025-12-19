
import React, { useState, useMemo, useRef } from 'react';
import { MOCK_NEWS, MAP_ACTORS as INITIAL_MAP_ACTORS, SPONSORS } from '../constants';
import { summarizeNews, generateRegionalTrends } from '../services/geminiService';

export const Home: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
  const [mapActors, setMapActors] = useState(INITIAL_MAP_ACTORS);
  const [activeActor, setActiveActor] = useState<typeof INITIAL_MAP_ACTORS[0] | null>(null);
  const [mapFilter, setMapFilter] = useState<string>('Todos');
  
  // Estados para Noticias
  const [newsSearch, setNewsSearch] = useState('');
  const [selectedNews, setSelectedNews] = useState<typeof MOCK_NEWS[0] | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [savedNews, setSavedNews] = useState<number[]>([]);
  const [regionalTrends, setRegionalTrends] = useState<string | null>(null);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  // Estados para el Registro de Aliados
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [newActor, setNewActor] = useState({
    name: '', type: 'Privado', impact: '', x: '50%', y: '50%', icon: 'business'
  });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const TarapacaPath = "M45,10 L55,15 L65,25 L70,45 L68,65 L60,85 L45,95 L35,80 L32,60 L35,40 L38,20 Z";

  const filterOptions = [
    { type: 'Todos', color: 'bg-stone-500', icon: 'apps', border: 'border-stone-500' },
    { type: 'Público', color: 'bg-blue-500', icon: 'account_balance', border: 'border-blue-500' },
    { type: 'Privado', color: 'bg-green-500', icon: 'corporate_fare', border: 'border-green-500' },
    { type: 'Académico', color: 'bg-purple-500', icon: 'school', border: 'border-purple-500' },
    { type: 'Gremio', color: 'bg-amber-500', icon: 'inventory_2', border: 'border-amber-500' },
    { type: 'ONG', color: 'bg-rose-500', icon: 'favorite', border: 'border-rose-500' }
  ];

  const filteredActors = useMemo(() => {
    if (mapFilter === 'Todos') return mapActors;
    return mapActors.filter(actor => actor.type === mapFilter);
  }, [mapFilter, mapActors]);

  const filteredNews = useMemo(() => {
    return MOCK_NEWS.filter(news => 
      news.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(newsSearch.toLowerCase())
    );
  }, [newsSearch]);

  const handleNewsClick = async (news: typeof MOCK_NEWS[0]) => {
    setSelectedNews(news);
    setAiSummary(null);
    setIsSummarizing(true);
    const summary = await summarizeNews(news.title, news.excerpt);
    setAiSummary(summary);
    setIsSummarizing(false);
  };

  const toggleSaveNews = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSavedNews(prev => prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]);
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

      {/* MAP SECTION (MANTENIDO) */}
      <section className="py-24 px-10 max-w-[1440px] mx-auto w-full">
        {/* ... (Contenido del mapa anterior se mantiene) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="size-1 rounded-full bg-primary shadow-[0_0_8px_#599E39]"></div>
                 <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Mapeo de Impacto Regional</h2>
              </div>
              <h3 className="text-6xl font-extrabold dark:text-white tracking-tighter text-stone-800 leading-[0.9]">
                Actores del <span className="text-stone-300">Ecosistema</span>
              </h3>
              <p className="text-stone-500 text-lg leading-relaxed font-medium max-w-md">
                Monitor de nodos estratégicos vinculados a la economía circular en la Región de Tarapacá. Inteligencia territorial en tiempo real.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-earth-card/50 backdrop-blur-xl border border-stone-200/50 dark:border-stone-800 p-8 rounded-[3rem] shadow-xl">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Filtrar Infraestructura</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {filterOptions.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setMapFilter(item.type)}
                    className={`group relative flex flex-col items-start gap-1 p-4 rounded-2xl border transition-all duration-500 overflow-hidden ${
                      mapFilter === item.type 
                      ? 'bg-stone-800 text-white border-transparent shadow-2xl scale-[1.02]' 
                      : 'bg-white dark:bg-earth-card border-stone-100 dark:border-stone-800 text-stone-600 hover:border-primary/50'
                    }`}
                  >
                    <div className={`size-1.5 rounded-full mb-1 ${item.color}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{item.type}</span>
                    <span className="text-[8px] font-bold mt-1 uppercase text-stone-300">
                      {getActorCount(item.type)} Nodos
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 h-[650px] bg-white dark:bg-stone-900 rounded-[4rem] relative overflow-hidden shadow-inner-xl border border-stone-100 dark:border-stone-800">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="h-[85%] text-primary/10" viewBox="0 0 100 100" fill="currentColor">
                <path d={TarapacaPath} />
              </svg>
            </div>
            {filteredActors.map(actor => (
              <div 
                key={actor.id} 
                className="absolute transition-all duration-700 hover:z-50"
                style={{ left: actor.x, top: actor.y }}
                onMouseEnter={() => setActiveActor(actor)}
                onMouseLeave={() => setActiveActor(null)}
              >
                <div className="relative size-10 bg-white dark:bg-earth-card rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined text-lg">{actor.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPROVED NEWS SECTION (FULL FUNCTIONALITY) */}
      <section className="bg-stone-50 dark:bg-earth-dark py-32 px-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
            <div className="space-y-4 flex-1">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Actualidad Tarapacá</h2>
              <h3 className="text-6xl font-extrabold dark:text-white tracking-tighter leading-[0.9] font-display">
                Noticias del <span className="text-stone-400">Ecosistema</span>
              </h3>
              
              <div className="mt-8 flex gap-4 max-w-xl">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400">search</span>
                  <input 
                    type="text" 
                    placeholder="Buscar noticias..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="w-full bg-white dark:bg-earth-card border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                <button 
                  onClick={handleGenerateTrends}
                  disabled={isLoadingTrends}
                  className="bg-stone-800 text-white px-6 rounded-2xl flex items-center gap-3 hover:bg-stone-900 transition-all disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined ${isLoadingTrends ? 'animate-spin' : ''}`}>
                    {isLoadingTrends ? 'sync' : 'auto_awesome'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Tendencias IA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Regional Trends Alert */}
          {regionalTrends && (
            <div className="mb-12 p-8 bg-primary/10 border-l-4 border-primary rounded-r-[2rem] animate-fade-in relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-6xl">psychology</span>
              </div>
              <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">trending_up</span> Monitor de Tendencias Regionales
              </h4>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed">
                {regionalTrends}
              </p>
              <button onClick={() => setRegionalTrends(null)} className="mt-4 text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-stone-600 transition-colors">Ocultar Reporte</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {filteredNews.length > 0 ? (
              <>
                {/* Featured News */}
                <div className="lg:col-span-7 group cursor-pointer" onClick={() => handleNewsClick(filteredNews[0])}>
                  <div className="relative aspect-[16/9] rounded-[3.5rem] overflow-hidden shadow-2xl bg-stone-200 dark:bg-stone-800">
                    <img 
                      src={filteredNews[0].image} 
                      alt={filteredNews[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-8 left-8 flex gap-3">
                      <span className="px-5 py-2 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                        {filteredNews[0].category}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => toggleSaveNews(e, filteredNews[0].id)}
                      className={`absolute top-8 right-8 size-12 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${
                        savedNews.includes(filteredNews[0].id) ? 'bg-primary text-white border-primary' : 'bg-white/10 text-white hover:bg-white/30'
                      }`}
                    >
                      <span className={`material-symbols-outlined ${savedNews.includes(filteredNews[0].id) ? 'fill-1' : ''}`}>bookmark</span>
                    </button>
                    <div className="absolute bottom-10 left-10 right-10">
                      <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{filteredNews[0].date}</p>
                      <h4 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tighter">
                        {filteredNews[0].title}
                      </h4>
                      <p className="text-stone-300 text-lg leading-relaxed line-clamp-2 max-w-2xl font-medium">
                        {filteredNews[0].excerpt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secondary News List */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                  {filteredNews.slice(1).map((news) => (
                    <div key={news.id} onClick={() => handleNewsClick(news)} className="group flex gap-6 items-center p-4 rounded-[2.5rem] hover:bg-white dark:hover:bg-earth-card transition-all duration-500 border border-transparent hover:border-stone-100 dark:hover:border-stone-800 cursor-pointer">
                      <div className="size-32 rounded-3xl overflow-hidden shrink-0 shadow-lg bg-stone-200 dark:bg-stone-800">
                        <img 
                          src={news.image} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt={news.title}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest">{news.category}</span>
                          <button 
                            onClick={(e) => toggleSaveNews(e, news.id)}
                            className={`size-8 rounded-full flex items-center justify-center transition-colors ${
                              savedNews.includes(news.id) ? 'text-primary' : 'text-stone-300 hover:text-stone-500'
                            }`}
                          >
                            <span className={`material-symbols-outlined text-lg ${savedNews.includes(news.id) ? 'fill-1' : ''}`}>bookmark</span>
                          </button>
                        </div>
                        <h5 className="text-lg font-bold dark:text-white leading-tight group-hover:text-primary transition-colors">
                          {news.title}
                        </h5>
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{news.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="lg:col-span-12 py-20 text-center bg-white dark:bg-earth-card rounded-[3rem] border border-stone-100 dark:border-stone-800">
                <span className="material-symbols-outlined text-6xl text-stone-200 mb-4">newspaper</span>
                <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">No encontramos noticias para "{newsSearch}"</p>
                <button onClick={() => setNewsSearch('')} className="mt-4 text-primary font-black uppercase tracking-widest text-xs hover:underline">Ver todas las noticias</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News Detail Modal with IA Summary */}
      {selectedNews && (
        <div className="fixed inset-0 z-[300] flex items-center justify-end bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl h-full bg-white dark:bg-earth-card shadow-2xl overflow-y-auto animate-[slide-left_0.5s_ease-out] flex flex-col custom-scrollbar">
            <div className="sticky top-0 z-50 p-6 bg-white/80 dark:bg-earth-card/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
               <button onClick={() => setSelectedNews(null)} className="size-10 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-transform hover:scale-110 active:scale-90">
                 <span className="material-symbols-outlined">arrow_back</span>
               </button>
               <div className="flex gap-4">
                 <button className="size-10 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors">
                   <span className="material-symbols-outlined text-xl">share</span>
                 </button>
                 <button onClick={(e) => toggleSaveNews(e, selectedNews.id)} className={`size-10 rounded-full border flex items-center justify-center transition-all ${
                   savedNews.includes(selectedNews.id) ? 'bg-primary text-white border-primary' : 'border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-50'
                 }`}>
                   <span className={`material-symbols-outlined text-xl ${savedNews.includes(selectedNews.id) ? 'fill-1' : ''}`}>bookmark</span>
                 </button>
               </div>
            </div>

            <div className="p-10 space-y-10">
              <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-xl">
                 <img src={selectedNews.image} className="w-full h-full object-cover" alt={selectedNews.title} />
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                   <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{selectedNews.category}</span>
                   <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest">{selectedNews.date}</span>
                 </div>
                 <h2 className="text-5xl font-black dark:text-white tracking-tighter leading-none">{selectedNews.title}</h2>
              </div>

              {/* AI Summary Section */}
              <div className="bg-stone-50 dark:bg-stone-900 rounded-[2rem] p-8 border border-stone-100 dark:border-stone-800 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-8xl text-primary">psychology</span>
                 </div>
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                   <span className="material-symbols-outlined text-sm">auto_awesome</span> Análisis Estratégico Gemini
                 </h4>
                 
                 {isSummarizing ? (
                   <div className="space-y-4 animate-pulse">
                     <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full"></div>
                     <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-5/6"></div>
                     <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-4/6"></div>
                   </div>
                 ) : (
                   <div className="prose dark:prose-invert max-w-none text-sm font-medium leading-relaxed text-stone-600 dark:text-stone-300 whitespace-pre-wrap">
                      {aiSummary}
                   </div>
                 )}
              </div>

              <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-stone-700 dark:text-stone-200 font-medium">
                 {selectedNews.excerpt}
                 <p className="mt-6">
                   Esta noticia es parte de nuestro monitor continuo de infraestructura circular en la ZOFRI e Iquique. Para más detalles, por favor contacta a la unidad de comunicaciones de CONECTARAPAK.
                 </p>
              </div>
              
              <div className="pt-10 border-t border-stone-100 dark:border-stone-800 text-center">
                 <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Fin de la Noticia • Verificado por el Protocolo Smart Tarapacá</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partners Section (MANTENIDO) */}
      <section className="bg-white dark:bg-earth-surface py-24 overflow-hidden">
        <div className="relative flex gap-10 overflow-hidden select-none group/marquee">
          <div className="flex shrink-0 items-center justify-around gap-10 min-w-full animate-[marquee_40s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
            {infiniteSponsors.map((sponsor, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-8 bg-stone-50 dark:bg-earth-card border border-stone-100 rounded-[2.5rem] w-64 h-48 hover:shadow-2xl transition-all group/card">
                <div className="h-20 w-full flex items-center justify-center grayscale group-hover/card:grayscale-0 opacity-40 group-hover/card:opacity-100 transition-all">
                  <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain px-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reg Modal (MANTENIDO) */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-earth-surface/90 backdrop-blur-xl animate-fade-in">
          <div className="max-w-xl w-full bg-white rounded-[3rem] p-10 shadow-2xl relative">
            <button onClick={() => setIsRegModalOpen(false)} className="absolute top-8 right-8 text-stone-400"><span className="material-symbols-outlined">close</span></button>
            <div className="space-y-6">
                <h3 className="text-3xl font-black">Únete a la Red</h3>
                <input type="text" placeholder="Nombre de Organización" className="w-full bg-stone-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20" onChange={e => setNewActor({...newActor, name: e.target.value})} />
                <button onClick={() => setIsRegModalOpen(false)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-hover transition-all">Registrar Nodo</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes slide-left { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .fill-1 { font-variation-settings: 'FILL' 1; }
      `}</style>
    </div>
  );
};
