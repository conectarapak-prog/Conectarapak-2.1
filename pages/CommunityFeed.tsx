
import React, { useState, useMemo } from 'react';
import { NewsItem, User, UserRole } from '../types';
import { getPostInsight } from '../services/geminiService';

interface FeedProps {
  news: NewsItem[];
  onPublish: (insight: Partial<NewsItem>) => void;
  user?: User | null;
}

export const CommunityFeed: React.FC<FeedProps> = ({ news, onPublish, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isPosting, setIsPosting] = useState(false);
  const [postText, setPostText] = useState('');
  
  const [activeInsightId, setActiveInsightId] = useState<string | number | null>(null);
  const [insightLoading, setInsightLoading] = useState<string | number | null>(null);
  const [insights, setInsights] = useState<Record<string | number, string>>({});
  
  const [showSponsorModal, setShowSponsorModal] = useState<NewsItem | null>(null);
  const [showCollabModal, setShowCollabModal] = useState<NewsItem | null>(null);

  const filters = ['Todos', 'AUDITORÍA IA', 'TECNOLOGÍA', 'EMPRENDIMIENTO', 'ACADEMIA', 'POLÍTICA PÚBLICA'];

  const filteredFeed = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'Todos' || item.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [news, searchTerm, activeFilter]);

  const handleFetchInsight = async (post: NewsItem) => {
    if (insights[post.id]) {
      setActiveInsightId(activeInsightId === post.id ? null : post.id);
      return;
    }
    setInsightLoading(post.id);
    const result = await getPostInsight(post.title, post.excerpt, user?.role || 'entrepreneur');
    if (result) {
      setInsights(prev => ({ ...prev, [post.id]: result }));
      setActiveInsightId(post.id);
    }
    setInsightLoading(null);
  };

  // Configuración de visualización por rol
  const getRoleConfig = (role: UserRole | undefined) => {
    switch (role) {
      case 'entrepreneur':
        return { label: 'Impacto Regional', val: '840 pts', stat: '12 Nodos', color: 'bg-primary' };
      case 'investor_natural':
        return { label: 'Aporte Social', val: '$450k', stat: '5 Proyectos', color: 'bg-blue-600' };
      case 'investor_legal':
        return { label: 'Cartera ESG', val: '$12.5M', stat: 'Score 9.4', color: 'bg-indigo-600' };
      case 'advisor':
        return { label: 'Retroeducación', val: '42 Horas', stat: '15 Mentorías', color: 'bg-amber-600' };
      default:
        return { label: 'Impacto', val: '0 pts', stat: '0 Nodos', color: 'bg-stone-500' };
    }
  };

  const roleConfig = getRoleConfig(user?.role);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 animate-fade-in items-start">
      
      {/* SIDEBAR ADAPTATIVO POR ROL */}
      <aside className="lg:w-72 w-full lg:sticky lg:top-24 space-y-4">
        <div className="bg-white dark:bg-stone-900 rounded-[1.5rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-sm">
           <div className={`h-16 ${roleConfig.color} transition-colors duration-500`}></div>
           <div className="px-5 pb-6 -mt-8 flex flex-col items-center text-center">
              <img 
                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"} 
                className="size-16 rounded-2xl border-4 border-white dark:border-stone-900 bg-stone-50 shadow-md mb-3"
              />
              <h3 className="text-sm font-black dark:text-white uppercase tracking-tight">
                {user?.name || "Invitado Circular"}
              </h3>
              <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 opacity-80 ${roleConfig.color.replace('bg-', 'text-')}`}>
                {user?.role?.replace('_', ' ') || "Explorador"}
              </p>
              
              <div className="w-full mt-6 pt-6 border-t border-stone-50 dark:border-stone-800 space-y-3">
                 <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-stone-400 uppercase tracking-tighter">{roleConfig.label}</span>
                    <span className={`font-black ${roleConfig.color.replace('bg-', 'text-')}`}>{roleConfig.val}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-stone-400 uppercase tracking-tighter">Status</span>
                    <span className={`font-black ${roleConfig.color.replace('bg-', 'text-')}`}>{roleConfig.stat}</span>
                 </div>
              </div>
           </div>
        </div>

        {user?.role === 'advisor' && (
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[1.5rem] border border-amber-100 dark:border-amber-800/20 p-5 shadow-sm">
             <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 mb-4">Mentoría Activa</h4>
             <div className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-amber-500 text-lg">school</span>
                <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">3 Solicitudes pendientes</p>
             </div>
          </div>
        )}
      </aside>

      {/* FEED CENTRAL */}
      <main className="flex-1 w-full space-y-6">
        <div className="bg-white dark:bg-stone-900 rounded-[1.5rem] border border-stone-100 dark:border-stone-800 p-5 flex items-center gap-4 shadow-sm">
           <img src={user?.avatar} className="size-10 rounded-xl bg-stone-50" />
           <button 
             onClick={() => setIsPosting(true)}
             className="flex-1 h-10 bg-stone-50 dark:bg-stone-800 rounded-xl px-4 text-left text-xs font-medium text-stone-400 hover:bg-stone-100 transition-colors border border-transparent focus:border-primary"
           >
             {user?.role === 'advisor' ? 'Comparte una lección técnica...' : 'Comparte tu avance circular...'}
           </button>
        </div>

        {/* Filtros */}
        <div className="flex overflow-x-auto no-scrollbar gap-2">
           {filters.map(f => (
             <button
               key={f}
               onClick={() => setActiveFilter(f)}
               className={`px-4 py-1.5 rounded-full whitespace-nowrap text-[8px] font-black uppercase tracking-widest border transition-all ${
                 activeFilter === f 
                 ? `${roleConfig.color} text-white border-transparent shadow-sm` 
                 : 'bg-white dark:bg-stone-900 text-stone-400 border-stone-100 dark:border-stone-800'
               }`}
             >
               {f}
             </button>
           ))}
        </div>

        {/* Listado de Posts */}
        <div className="space-y-4">
           {filteredFeed.map((post) => (
             <article 
               key={post.id}
               className="bg-white dark:bg-stone-900 rounded-[1.8rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-all"
             >
               <div className="p-6 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <img src={post.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.id}`} className="size-9 rounded-lg border border-stone-50" />
                     <div>
                        <div className="flex items-center gap-1.5">
                           <p className="text-[10px] font-black uppercase dark:text-white tracking-tight">{post.authorName || "Actor Regional"}</p>
                           <span className="material-symbols-outlined text-primary text-[10px]">verified</span>
                        </div>
                        <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">{post.date}</p>
                     </div>
                  </div>
                  <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest">{post.category}</span>
               </div>

               <div className="px-6 py-4">
                  <h3 className="text-lg font-black dark:text-white tracking-tight uppercase leading-tight mb-3">{post.title}</h3>
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-400 leading-relaxed">{post.excerpt}</p>
                  
                  {activeInsightId === post.id && insights[post.id] && (
                    <div className="mt-4 bg-stone-50 dark:bg-stone-950 rounded-2xl p-6 border-l-4 border-primary animate-[slide-down_0.3s_ease-out]">
                       <h5 className={`text-[8px] font-black uppercase tracking-[0.3em] mb-2 ${roleConfig.color.replace('bg-', 'text-')}`}>
                          Análisis para {user?.role?.replace('_', ' ')}
                       </h5>
                       <p className="text-[11px] font-medium text-stone-700 dark:text-stone-300 italic leading-relaxed whitespace-pre-wrap">
                          {insights[post.id]}
                       </p>
                    </div>
                  )}
               </div>

               <div className="px-6 py-4 border-t border-stone-50 dark:border-stone-800 flex justify-between bg-stone-50/20">
                  <div className="flex gap-4">
                     {(user?.role?.includes('investor')) && (
                       <button onClick={() => setShowSponsorModal(post)} className="flex items-center gap-1.5 text-stone-400 hover:text-primary transition-colors text-[9px] font-black uppercase tracking-widest">
                          <span className="material-symbols-outlined text-sm">rocket_launch</span> Patrocinar
                       </button>
                     )}
                     <button onClick={() => handleFetchInsight(post)} className={`flex items-center gap-1.5 transition-colors text-[9px] font-black uppercase tracking-widest ${activeInsightId === post.id ? 'text-primary' : 'text-stone-400 hover:text-primary'}`}>
                        <span className="material-symbols-outlined text-sm">psychology</span> Insight IA
                     </button>
                     <button onClick={() => setShowCollabModal(post)} className="flex items-center gap-1.5 text-stone-400 hover:text-info transition-colors text-[9px] font-black uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">handshake</span> {user?.role === 'advisor' ? 'Mentorear' : 'Colaborar'}
                     </button>
                  </div>
               </div>
             </article>
           ))}
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
