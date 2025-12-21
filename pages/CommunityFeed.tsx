
import React, { useState, useMemo } from 'react';
import { NewsItem } from '../types';
import { researchEducationalAgent } from '../services/geminiService';

interface FeedProps {
  news: NewsItem[];
  onPublish: (insight: Partial<NewsItem>) => void;
}

export const CommunityFeed: React.FC<FeedProps> = ({ news, onPublish }) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [researchResult, setResearchResult] = useState<{text: string, sources: any[]} | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<NewsItem | null>(null);

  const filteredFeed = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.interpretation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'Todos' || item.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [news, searchTerm, activeFilter]);

  const handleAgentResearch = async () => {
    if (!searchTerm.trim()) return;
    setIsResearching(true);
    setResearchResult(null);
    const result = await researchEducationalAgent(searchTerm);
    setResearchResult(result);
    setIsResearching(false);
  };

  const handleShareInsight = () => {
    if (!researchResult) return;
    onPublish({
      title: `Insight IA: ${searchTerm}`,
      interpretation: researchResult.text,
      category: "AUDITORÍA IA",
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800'
    });
    setResearchResult(null);
    setSearchTerm('');
  };

  const handleSaveInfographic = (itemText: string, itemTitle: string) => {
    const formattedContent = `
=========================================
CONECTARAPAK - BLUEPRINT EDUCATIVO
=========================================
TEMA: ${itemTitle.toUpperCase()}
FECHA: ${new Date().toLocaleDateString()}
-----------------------------------------

${itemText.replace(/\*\*/g, '')}

-----------------------------------------
SISTEMA: ConectaRapak Intelligence
=========================================
`;
    const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BLUEPRINT-${itemTitle.replace(/\s+/g, '-').toUpperCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/^[-\d.\s•*]+/, '').trim();
  };

  const parseResult = (text: string) => {
    // Parser más robusto basado en tags fijos
    const parts = text.split(/\[.*?\]/);
    const headers = text.match(/\[(.*?)\]/g)?.map(h => h.slice(1, -1)) || [];
    
    const mapped: Record<string, string> = {};
    headers.forEach((h, i) => {
      mapped[h.toUpperCase()] = parts[i + 1]?.trim() || "";
    });

    return {
      context: mapped['CONTEXTO'] || "Analizando el entorno regional...",
      how: mapped['LOGICA'] || "Definiendo pasos operativos...",
      visual: mapped['VISUAL'] || "Creando guion gráfico...",
      impact: mapped['IMPACTO'] || "Impacto en desarrollo."
    };
  };

  const renderLines = (text: string) => {
    return text.split('\n').filter(l => l.trim()).map((line, i) => (
      <div key={i} className="flex gap-3 items-start mb-3 group/line animate-fade-in" style={{animationDelay: `${i*100}ms`}}>
        <div className="size-1.5 bg-primary/40 rounded-full mt-2 shrink-0 group-hover/line:bg-primary transition-all"></div>
        <p className="text-[13px] leading-relaxed text-stone-600 dark:text-stone-300 font-medium">
          {cleanText(line)}
        </p>
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-16 animate-fade-in w-full items-center text-center">
      
      {/* Header del Feed Centrado */}
      <header className="flex flex-col items-center gap-8 max-w-4xl border-b border-stone-100 dark:border-stone-800 pb-16 w-full">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="material-symbols-outlined text-sm">psychology</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Agente de Inteligencia Territorial</span>
           </div>
           <h2 className="text-6xl font-black dark:text-white tracking-tighter uppercase leading-none">
             Feed <span className="text-stone-300 italic">Comunitario</span>
           </h2>
           <p className="text-stone-500 font-medium italic text-lg leading-relaxed max-w-2xl">
             Investiga cualquier duda regional. Nuestro agente buscará hechos reales y creará una base educativa para compartir.
           </p>
        </div>

        {/* Buscador Agente IA Centrado */}
        <div className="w-full max-w-3xl flex flex-col gap-4">
          <div className="flex bg-white dark:bg-stone-900 p-2.5 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-2xl w-full group focus-within:ring-4 focus-within:ring-primary/5 transition-all">
            <div className="flex items-center px-6 flex-1">
               <span className={`material-symbols-outlined text-stone-300 ${isResearching ? 'animate-spin' : ''}`}>
                 {isResearching ? 'refresh' : 'search'}
               </span>
               <input 
                type="text" 
                placeholder="Ej: ¿Cómo funciona la desalinización en Tarapacá?" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAgentResearch()}
                className="bg-transparent border-none py-5 px-6 text-base font-bold dark:text-white outline-none w-full placeholder:text-stone-300"
               />
            </div>
            <button 
              onClick={handleAgentResearch}
              disabled={isResearching}
              className="bg-primary text-white px-10 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-primary-hover transition-all disabled:opacity-50"
            >
              Investigar
            </button>
          </div>
        </div>
      </header>

      {/* RESULTADO BLUEPRINT EDUCATIVO */}
      {researchResult && (
        <section className="w-full max-w-6xl animate-[slide-down_0.5s_ease-out]">
           <div className="bg-white dark:bg-stone-900 rounded-[4rem] border border-stone-100 dark:border-stone-800 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.1)] text-left relative overflow-hidden flex flex-col">
              
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
                 <span className="material-symbols-outlined text-[15rem] text-primary">architecture</span>
              </div>
              
              <div className="relative z-10 p-10 md:p-16 space-y-16">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-stone-100 dark:border-stone-800 pb-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-md">Blueprint v2.0</span>
                         <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">Arquitectura Educativa Regional</span>
                      </div>
                      <h4 className="text-5xl font-black dark:text-white uppercase tracking-tighter leading-tight">{searchTerm}</h4>
                   </div>
                   <button onClick={() => setResearchResult(null)} className="size-14 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-300 hover:text-red-500 transition-all border border-stone-100 dark:border-stone-700 shadow-sm">
                      <span className="material-symbols-outlined text-3xl">close</span>
                   </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                   <div className="lg:col-span-4 space-y-8">
                      <div className="flex items-center gap-4 text-info">
                         <div className="size-10 bg-info/10 rounded-xl flex items-center justify-center border border-info/20">
                            <span className="material-symbols-outlined">description</span>
                         </div>
                         <h5 className="text-[10px] font-black uppercase tracking-[0.4em]">01. Contexto Regional</h5>
                      </div>
                      <div className="bg-stone-50 dark:bg-stone-800/50 p-8 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-inner">
                        <div className="text-[13px] font-medium leading-relaxed text-stone-600 dark:text-stone-300 italic">
                          {renderLines(parseResult(researchResult.text).context)}
                        </div>
                      </div>
                   </div>

                   <div className="lg:col-span-4 space-y-8">
                      <div className="flex items-center gap-4 text-primary">
                         <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                            <span className="material-symbols-outlined">account_tree</span>
                         </div>
                         <h5 className="text-[10px] font-black uppercase tracking-[0.4em]">02. Operativa Smart</h5>
                      </div>
                      <div className="space-y-4">
                         {parseResult(researchResult.text).how.split('\n').filter(l => l.trim()).map((step, i) => (
                           <div key={i} className="flex gap-4 items-center bg-white dark:bg-stone-800 p-6 rounded-3xl border border-stone-100 dark:border-stone-700 shadow-sm hover:border-primary/50 transition-all group/step">
                              <span className="size-8 bg-primary/5 text-primary rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 border border-primary/10 group-hover/step:bg-primary group-hover/step:text-white transition-colors">{i+1}</span>
                              <p className="text-[12px] font-bold text-stone-800 dark:text-stone-100 leading-snug">{cleanText(step)}</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="lg:col-span-4 space-y-8">
                      <div className="flex items-center gap-4 text-intel">
                         <div className="size-10 bg-intel/10 rounded-xl flex items-center justify-center border border-intel/20">
                            <span className="material-symbols-outlined">palette</span>
                         </div>
                         <h5 className="text-[10px] font-black uppercase tracking-[0.4em]">03. Guion Visual</h5>
                      </div>
                      <div className="space-y-3">
                         {parseResult(researchResult.text).visual.split('\n').filter(l => l.trim()).map((v, i) => (
                           <div key={i} className="bg-stone-50 dark:bg-stone-800/30 p-5 rounded-2xl border-l-4 border-intel/30 flex items-center gap-4 group/visual hover:bg-white dark:hover:bg-stone-800 transition-all">
                              <span className="material-symbols-outlined text-intel/40 text-xl group-hover/visual:rotate-12 transition-transform">auto_fix_high</span>
                              <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 group-hover/visual:text-stone-800 dark:group-hover/visual:text-white transition-colors uppercase tracking-tight">
                                {cleanText(v)}
                              </p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 p-12 md:p-16 rounded-[4rem] text-center space-y-6 shadow-2xl relative overflow-hidden group/impact">
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/50"></div>
                   <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/impact:opacity-100 transition-opacity"></div>
                   <h5 className="text-[10px] font-black uppercase tracking-[0.8em] opacity-40">Impacto Educativo Regional</h5>
                   <p className="text-xl md:text-3xl font-black italic tracking-tighter leading-tight max-w-4xl mx-auto relative z-10">
                     "{cleanText(parseResult(researchResult.text).impact)}"
                   </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-stone-100 dark:border-stone-800">
                   <button 
                    onClick={handleShareInsight}
                    className="flex-1 h-20 bg-primary text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
                   >
                      <span className="material-symbols-outlined text-2xl">send</span> Publicar en Feed
                   </button>
                   <button 
                    onClick={() => handleSaveInfographic(researchResult.text, searchTerm)}
                    className="flex-1 h-20 bg-white dark:bg-stone-800 text-stone-800 dark:text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] border-2 border-stone-100 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 transition-all flex items-center justify-center gap-4"
                   >
                      <span className="material-symbols-outlined text-2xl">download</span> Exportar Blueprint
                   </button>
                </div>
              </div>
           </div>
        </section>
      )}

      {/* MURO DE INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
        {filteredFeed.length > 0 ? filteredFeed.map((item) => (
          <article 
            key={item.id}
            className="group bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[3.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-2xl transition-all duration-700"
          >
            <div className="p-8 pb-4 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <img src={item.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`} className="size-10 rounded-2xl bg-stone-50" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest dark:text-white leading-none">{item.authorName || "Ciudadano"}</p>
                    <p className="text-[9px] font-bold text-stone-400 mt-1">{item.date}</p>
                  </div>
               </div>
               <span className="px-3 py-1 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest rounded-lg border border-primary/10">Educativo</span>
            </div>

            <div className="h-64 relative overflow-hidden mx-6 rounded-[2.5rem]">
               <img src={item.image} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-[2s]" alt={item.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent"></div>
               <div className="absolute bottom-6 left-8 right-8 text-left">
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-tight">{item.title}</h3>
               </div>
            </div>

            <div className="p-10 flex-1 flex flex-col gap-6 text-left">
               <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-[2rem] border border-stone-100 dark:border-stone-700">
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-4">Síntesis IA:</p>
                  <p className="text-[12px] font-semibold leading-relaxed text-stone-700 dark:text-stone-300 italic line-clamp-4">
                     "{cleanText(item.interpretation || item.excerpt || "")}"
                  </p>
               </div>

               <div className="mt-auto pt-6 border-t border-stone-50 dark:border-stone-800 flex justify-between items-center">
                  <button 
                    onClick={() => handleSaveInfographic(item.interpretation || item.excerpt || "", item.title)}
                    className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest"
                  >
                     <span className="material-symbols-outlined text-xl">school</span> Ref. Infografía
                  </button>
                  <button 
                    onClick={() => setSelectedInsight(item)}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    Ver Más
                  </button>
               </div>
            </div>
          </article>
        )) : (
          <div className="col-span-full py-40 text-center opacity-10">
             <span className="material-symbols-outlined text-[100px]">hub</span>
             <p className="text-2xl font-black uppercase mt-6 tracking-tighter">Explora para generar conocimiento</p>
          </div>
        )}
      </div>

      {/* MODAL DETALLE */}
      {selectedInsight && (
        <div className="fixed inset-0 z-[1000] bg-earth-surface/90 backdrop-blur-2xl flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
           <div className="max-w-5xl w-full bg-white dark:bg-stone-900 rounded-[4rem] shadow-2xl overflow-hidden relative animate-[scale-up_0.5s_ease-out] flex flex-col lg:flex-row border border-white/5">
              
              <button 
                onClick={() => setSelectedInsight(null)}
                className="absolute top-8 right-8 z-[1010] size-14 rounded-full bg-stone-100/50 dark:bg-stone-800/50 backdrop-blur-md text-stone-500 dark:text-stone-300 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-xl"
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>

              <div className="lg:w-2/5 h-[350px] lg:h-auto relative bg-stone-100 dark:bg-stone-800">
                 <img src={selectedInsight.image} className="w-full h-full object-cover" alt={selectedInsight.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent flex flex-col justify-end p-12">
                    <span className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl w-fit mb-4">Auditoría Regional</span>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{selectedInsight.title}</h3>
                 </div>
              </div>

              <div className="flex-1 p-10 lg:p-16 flex flex-col justify-between space-y-10 overflow-y-auto max-h-[80vh] lg:max-h-none">
                 <div className="space-y-12">
                    <div className="flex items-center gap-4 pb-8 border-b border-stone-50 dark:border-stone-800">
                       <img src={selectedInsight.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedInsight.id}`} className="size-14 rounded-2xl bg-stone-50 border border-stone-100" />
                       <div className="text-left">
                          <p className="text-xs font-black uppercase tracking-widest dark:text-white leading-none">{selectedInsight.authorName || "Colaborador Regional"}</p>
                          <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-widest">{selectedInsight.date}</p>
                       </div>
                    </div>

                    <div className="space-y-8 text-left">
                       <div className="space-y-4">
                          <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Análisis Técnico Completo</h5>
                          <div className="bg-stone-50 dark:bg-stone-800/30 p-10 rounded-[3rem] border border-stone-100 dark:border-stone-700 italic">
                             <p className="text-lg font-semibold text-stone-700 dark:text-stone-200 leading-relaxed">
                               "{cleanText(selectedInsight.interpretation || selectedInsight.excerpt || "")}"
                             </p>
                          </div>
                       </div>

                       {selectedInsight.facts && (
                         <div className="space-y-6 pl-6 border-l-4 border-info/20">
                            <h5 className="text-[10px] font-black text-info uppercase tracking-[0.5em]">Hechos Territoriales</h5>
                            <div className="text-sm font-medium leading-loose text-stone-500 dark:text-stone-400">
                               {selectedInsight.facts.split('\n').map((line, i) => (
                                 <p key={i} className="mb-2">• {cleanText(line)}</p>
                               ))}
                            </div>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-stone-50 dark:border-stone-800">
                    <button 
                      onClick={() => handleSaveInfographic(selectedInsight.interpretation || selectedInsight.excerpt || "", selectedInsight.title)}
                      className="flex-1 h-16 bg-primary text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                    >
                       <span className="material-symbols-outlined">download</span> Exportar Referencia
                    </button>
                    <button className="flex-1 h-16 bg-stone-50 dark:bg-stone-800 text-stone-400 rounded-[2rem] font-black text-[11px] uppercase tracking-widest border border-stone-100 dark:border-stone-700 hover:text-stone-800 transition-all flex items-center justify-center gap-3">
                       <span className="material-symbols-outlined">share</span> Compartir
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
      
      <style>{`
        @keyframes slide-down { 
          from { opacity: 0; transform: translateY(-20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes scale-up { 
          from { opacity: 0; transform: scale(0.95) translateY(20px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
      `}</style>
    </div>
  );
};
