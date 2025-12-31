
import React, { useState, useMemo } from 'react';
import { NewsItem, User } from '../types';
import { getPostInsight } from '../services/geminiService';

interface FeedProps {
  news: NewsItem[];
  onPublish: (insight: Partial<NewsItem>) => void;
  user?: User | null;
}

export const CommunityFeed: React.FC<FeedProps> = ({ news, onPublish, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [insights, setInsights] = useState<Record<string | number, string>>({});
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  const filters = ['Todos', 'AUDITORÍA IA', 'TECNOLOGÍA', 'EMPRENDIMIENTO', 'ACADEMIA'];

  const filteredFeed = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'Todos' || item.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [news, searchTerm, activeFilter]);

  const handleFetchInsight = async (post: NewsItem) => {
    if (insights[post.id]) {
      // Toggle visibility if already exists
      const newInsights = { ...insights };
      delete newInsights[post.id];
      setInsights(newInsights);
      return;
    }
    setLoadingId(post.id);
    const result = await getPostInsight(post.title, post.excerpt, user?.role || 'entrepreneur');
    if (result) setInsights(prev => ({ ...prev, [post.id]: result }));
    setLoadingId(null);
  };

  // Función para formatear el texto técnico de la IA
  const renderInsightText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return null;
      
      // Manejo de títulos técnicos ###
      if (line.startsWith('###')) {
        return <h4 key={i} className="text-primary font-black mt-4 mb-2 uppercase tracking-widest text-[10px] border-b border-primary/20 pb-1">{line.replace(/###/g, '')}</h4>;
      }
      
      // Manejo de negritas **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-2 leading-relaxed">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <span key={j} className="text-white font-black">{part.slice(2, -2)}</span>;
            }
            return part.replace(/^[*-]\s*/, '• ');
          })}
        </p>
      );
    });
  };

  return (
    <div className="w-full space-y-16 py-8 max-w-7xl mx-auto px-4">
      
      {/* HEADER COMPACTO */}
      <section className="flex flex-col lg:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <span className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#76C94F]"></span>
            <p className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-[0.6em]">Network.Broadcast_v4</p>
          </div>
          <h2 className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter uppercase leading-[0.9]">
            Actividad de <br/><span className="text-stone-800 italic font-light">Ecosistema</span>
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
           {filters.map(f => (
             <button
               key={f}
               onClick={() => setActiveFilter(f)}
               className={`px-6 py-3 rounded-full text-[8px] font-mono font-black uppercase tracking-widest transition-all border ${
                 activeFilter === f 
                 ? 'bg-white text-stone-950 border-transparent shadow-xl' 
                 : 'bg-stone-900/50 text-stone-500 border-white/5 hover:border-primary/50'
               }`}
             >
               {f}
             </button>
           ))}
        </div>
      </section>

      {/* GRID DE ALTA DENSIDAD */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeed.map((post, idx) => (
          <article 
            key={post.id} 
            className="bg-stone-950 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-primary/30 transition-all duration-500 h-[650px] relative overflow-hidden animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Fondo de rejilla técnica Nosigner */}
            <div className="absolute inset-0 grid-technical opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity"></div>
            
            <div className="space-y-8 relative z-10 flex flex-col h-full overflow-hidden">
               <div className="flex justify-between items-start">
                  <span className="bg-white/5 px-4 py-1.5 rounded-full text-[8px] font-mono font-black text-primary uppercase tracking-widest border border-white/5">{post.category}</span>
                  <span className="text-[8px] font-mono font-bold text-stone-600 uppercase tracking-widest">{post.date}</span>
               </div>
               
               <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors h-[3.5rem] line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed line-clamp-3 lowercase tracking-tight border-l border-white/10 pl-4">
                    {post.excerpt}
                  </p>
               </div>

               {/* Bloque de INSIGHTS IA Optimizado */}
               <div className={`transition-all duration-700 ease-in-out flex-1 flex flex-col overflow-hidden ${insights[post.id] ? 'opacity-100 mt-4' : 'opacity-0 h-0'}`}>
                 <div className="flex-1 bg-stone-900/80 border border-primary/20 rounded-[2rem] p-6 text-[10px] font-mono text-stone-400 overflow-y-auto custom-scrollbar shadow-inner relative">
                    <div className="sticky top-0 bg-stone-900/90 backdrop-blur-sm pb-2 mb-4 border-b border-primary/10 flex justify-between items-center">
                       <span className="text-primary font-black uppercase tracking-[0.4em] flex items-center gap-2">
                         <span className="material-symbols-outlined text-[14px] animate-pulse">terminal</span> 
                         AI_DIAGNOSTIC_V1
                       </span>
                       <span className="text-[8px] opacity-30">SYS_OK</span>
                    </div>
                    <div className="animate-fade-in">
                       {insights[post.id] ? renderInsightText(insights[post.id]) : null}
                    </div>
                 </div>
               </div>
            </div>

            <div className="pt-8 flex flex-col gap-4 relative z-10">
               <button 
                 onClick={() => handleFetchInsight(post)}
                 disabled={loadingId === post.id}
                 className={`w-full h-14 rounded-2xl border transition-all flex items-center justify-center gap-3 text-[9px] font-mono font-black uppercase tracking-[0.3em] overflow-hidden group/btn ${
                   insights[post.id] 
                   ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(118,201,79,0.3)]' 
                   : 'bg-stone-900 text-stone-500 border-white/10 hover:border-primary hover:text-white'
                 }`}
               >
                 {loadingId === post.id ? (
                   <div className="flex items-center gap-2">
                      <div className="size-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sincronizando...</span>
                   </div>
                 ) : (
                   <>
                     <span>{insights[post.id] ? 'Cerrar Análisis' : 'Extraer Insights IA'}</span>
                     <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:rotate-12">
                       {insights[post.id] ? 'close' : 'psychology'}
                     </span>
                   </>
                 )}
               </button>
               
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full border border-white/10 overflow-hidden grayscale group-hover:grayscale-0 transition-all shadow-lg">
                       <img src={post.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.id}`} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] font-mono font-bold uppercase text-stone-600 tracking-widest">Nodo_Broadcast: {post.id}</span>
                  </div>
                  <div className="flex gap-1">
                     <div className="size-1 rounded-full bg-primary/20"></div>
                     <div className="size-1 rounded-full bg-primary/20"></div>
                     <div className="size-1 rounded-full bg-primary"></div>
                  </div>
               </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
