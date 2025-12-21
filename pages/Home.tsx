
import React, { useState, useMemo } from 'react';
import { MAP_ACTORS as INITIAL_MAP_ACTORS } from '../constants';
import { summarizeNews, generateRegionalTrends } from '../services/geminiService';
import { NewsItem } from '../types';

interface HomeProps {
  setView: (v: any) => void;
  news: NewsItem[];
}

export const Home: React.FC<HomeProps> = ({ setView, news }) => {
  const [activeActor, setActiveActor] = useState<typeof INITIAL_MAP_ACTORS[0] | null>(null);
  const [mapFilter, setMapFilter] = useState<string>('Todos');
  const [newsSearch, setNewsSearch] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [regionalTrends, setRegionalTrends] = useState<string | null>(null);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  const TarapacaPath = "M45,10 L55,15 L65,25 L70,45 L68,65 L60,85 L45,95 L35,80 L32,60 L35,40 L38,20 Z";

  const filteredActors = useMemo(() => {
    if (mapFilter === 'Todos') return INITIAL_MAP_ACTORS;
    return INITIAL_MAP_ACTORS.filter(actor => actor.type === mapFilter);
  }, [mapFilter]);

  const filteredNews = useMemo(() => {
    return news.filter(n => 
      n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(newsSearch.toLowerCase())
    );
  }, [newsSearch, news]);

  const handleNewsClick = async (n: NewsItem) => {
    setSelectedNews(n);
    setAiSummary(null);
    setIsSummarizing(true);
    const summary = await summarizeNews(n.title, n.excerpt);
    setAiSummary(summary);
    setIsSummarizing(false);
  };

  const handleGenerateTrends = async () => {
    setIsLoadingTrends(true);
    const trends = await generateRegionalTrends();
    setRegionalTrends(trends);
    setIsLoadingTrends(false);
  };

  return (
    <div className="flex flex-col animate-fade-in -mt-10 overflow-x-hidden">
      
      {/* ATMÓSFERA 1: MARCA Y VISIÓN (Neutral Pro) */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden rounded-b-[4rem] shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1518005020251-582964841930?auto=format&fit=crop&q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.3]"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-earth-dark/90"></div>
        <div className="relative z-10 max-w-[1440px] w-full px-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] font-display tracking-tighter uppercase">
              CONECTARA<br/><span className="text-primary italic">PAK</span> SMART
            </h1>
            <p className="text-lg text-stone-400 font-medium max-w-xl italic">
              Aceleración de economía circular en Tarapacá mediante inteligencia artificial.
            </p>
            <button onClick={() => setView('discovery')} className="bg-white text-stone-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              Explorar Ecosistema
            </button>
          </div>
        </div>
      </section>

      {/* ATMÓSFERA 2: MAPA DE RED (Atmósfera Verde) */}
      <section className="py-20 px-10 max-w-[1440px] mx-auto w-full bg-primary/[0.02] rounded-[5rem] my-10 border border-primary/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
               <span className="size-2 rounded-full bg-primary animate-pulse"></span>
               <span className="text-[10px] font-black uppercase tracking-widest">Atmósfera de Red</span>
            </div>
            <h3 className="text-5xl font-black dark:text-white tracking-tighter uppercase leading-none">
              Territorio <br/><span className="text-stone-300 dark:text-stone-700">Circular</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Público', 'Privado', 'Académico'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMapFilter(type)}
                  className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    mapFilter === type ? 'bg-primary text-white' : 'bg-white dark:bg-stone-900 text-stone-400 border border-stone-100 dark:border-stone-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 h-[500px] bg-white dark:bg-stone-900 rounded-[3rem] relative overflow-hidden shadow-inner border border-stone-100 dark:border-stone-800">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <svg className="h-[90%] text-primary" viewBox="0 0 100 100" fill="currentColor"><path d={TarapacaPath} /></svg>
            </div>
            {filteredActors.map(actor => (
              <div key={actor.id} className="absolute cursor-pointer group" style={{ left: actor.x, top: actor.y }} onClick={() => setActiveActor(actor)}>
                <div className={`size-10 bg-white dark:bg-earth-card rounded-xl flex items-center justify-center shadow-lg border-2 transition-all ${activeActor?.id === actor.id ? 'border-primary' : 'border-transparent'}`}>
                  <span className={`material-symbols-outlined text-xl ${activeActor?.id === actor.id ? 'text-primary' : 'text-stone-300'}`}>{actor.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATMÓSFERA 3: INFORMACIÓN (Atmósfera Azul) */}
      <section className="bg-info/[0.02] py-20 px-10 border-y border-info/10">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-info/10 text-info border border-info/20 mb-4">
                 <span className="size-2 rounded-full bg-info"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest">Atmósfera de Información</span>
              </div>
              <h4 className="text-5xl font-black dark:text-white tracking-tighter uppercase leading-none">News <span className="text-info/50 italic">Feed</span></h4>
            </div>
            
            <div className="flex items-center gap-3 bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-100 dark:border-stone-800">
               <span className="material-symbols-outlined text-info ml-2">search</span>
               <input 
                 type="text" 
                 placeholder="Filtrar actualidad..."
                 value={newsSearch}
                 onChange={(e) => setNewsSearch(e.target.value)}
                 className="bg-transparent border-none py-2 px-3 text-xs font-bold dark:text-white outline-none w-64"
               />
               <button onClick={handleGenerateTrends} className="size-10 flex items-center justify-center bg-intel text-white rounded-xl hover:bg-intel-dark transition-all">
                  <span className="material-symbols-outlined">auto_awesome</span>
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {filteredNews.slice(0, 4).map((n, i) => (
              <div 
                key={n.id} 
                onClick={() => handleNewsClick(n)}
                className={`group cursor-pointer rounded-[2.5rem] overflow-hidden bg-white dark:bg-earth-card border border-stone-100 dark:border-stone-800 transition-all ${i === 0 ? 'lg:col-span-8' : 'lg:col-span-4'}`}
              >
                <div className={`relative ${i === 0 ? 'h-80' : 'h-48'}`}>
                  <img src={n.image} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={n.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-info bg-info-light/20 px-2 py-1 rounded-md">{n.category}</span>
                    <h5 className="text-2xl font-black text-white uppercase mt-2 line-clamp-2">{n.title}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK VIEW INTELIGENCIA (Atmósfera Ámbar) */}
      {selectedNews && (
        <div className="fixed inset-0 z-[500] bg-earth-surface/80 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedNews(null)}>
           <div 
             className="max-w-2xl w-full bg-white dark:bg-earth-card rounded-[3rem] shadow-2xl border border-intel/20 relative overflow-hidden animate-[scale-in_0.3s_ease-out]"
             onClick={e => e.stopPropagation()}
           >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-intel"></div>
              <div className="p-10 space-y-8">
                 <div className="flex justify-between items-start">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-intel/10 text-intel border border-intel/20">
                       <span className="material-symbols-outlined text-sm">auto_awesome</span>
                       <span className="text-[10px] font-black uppercase tracking-widest">Atmósfera de Inteligencia</span>
                    </div>
                    <button onClick={() => setSelectedNews(null)} className="text-stone-300 hover:text-intel transition-colors">
                       <span className="material-symbols-outlined">close</span>
                    </button>
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black dark:text-white uppercase leading-tight tracking-tighter">{selectedNews.title}</h3>
                    <div className="bg-intel/5 p-6 rounded-2xl border border-intel/10">
                       {isSummarizing ? (
                          <div className="flex items-center gap-3 animate-pulse">
                             <div className="size-4 border-2 border-intel border-t-transparent rounded-full animate-spin"></div>
                             <p className="text-intel text-[10px] font-black uppercase">Gemini Analizando...</p>
                          </div>
                       ) : (
                          <p className="text-sm font-bold text-stone-700 dark:text-stone-300 leading-relaxed italic">
                             {aiSummary || 'Procesando contexto regional...'}
                          </p>
                       )}
                    </div>
                 </div>
                 <button className="w-full h-14 bg-intel text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-intel/20">Acceso Técnico Completo</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
