
import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';
import { searchRegionalInsights } from '../services/geminiService';

interface DiscoveryProps {
  onProjectClick: (p: Project) => void;
  searchTerm: string;
}

export const ProjectDiscovery: React.FC<DiscoveryProps> = ({ onProjectClick, searchTerm }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [deepSearchQuery, setDeepSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [deepResult, setDeepResult] = useState<{
    facts: string;
    strategy: string;
    actions: string;
    sources: any[];
  } | null>(null);

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || project.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleDeepSearch = async () => {
    if (!deepSearchQuery.trim()) return;
    setIsSearching(true);
    
    const targetProject = filteredProjects[0];
    const projectContext = targetProject 
      ? `${targetProject.title}: ${targetProject.description}`
      : undefined;

    const result = await searchRegionalInsights(deepSearchQuery, projectContext);
    
    if (result) {
      const text = result.text;
      const facts = text.split('[HECHOS]')[1]?.split('[ESTRATEGIA]')[0]?.trim() || "";
      const strategy = text.split('[ESTRATEGIA]')[1]?.split('[ACCIONES]')[0]?.trim() || "";
      const actions = text.split('[ACCIONES]')[1]?.trim() || "";

      setDeepResult({
        facts: facts || "No se encontraron hechos específicos.",
        strategy: strategy || "Análisis en proceso...",
        actions: actions || "Consulta el panel de mentoría.",
        sources: result.sources
      });
    }
    
    setIsSearching(false);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('*') || line.startsWith('-')) {
        return (
          <div key={i} className="flex gap-3 mb-2">
            <span className="text-intel font-black mt-1">•</span>
            <span className="text-xs font-medium dark:text-stone-300 leading-relaxed">
              {line.replace(/^[\*\-\s]+/, '')}
            </span>
          </div>
        );
      }
      return <p key={i} className="text-xs mb-3 font-medium leading-relaxed dark:text-stone-300">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-20 max-w-[1440px] mx-auto px-4 md:px-8">
      
      {/* Header Estructurado */}
      <section className="flex flex-col lg:flex-row justify-between items-center gap-8 py-4">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
             <span className="material-symbols-outlined text-sm">hub</span>
             <span className="text-[10px] font-black uppercase tracking-widest">Ecosistema ConectaraPak</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter dark:text-white uppercase leading-none">
            Centro de <span className="text-primary italic">Vinculación</span>
          </h2>
        </div>
        <div className="flex bg-stone-100 dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          {['Todos', 'Ecología Circular', 'Tecnología'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-white dark:bg-stone-800 text-primary shadow-lg' : 'text-stone-400'
              }`}
            >
              {cat === 'Ecología Circular' ? 'Ecología' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* MOTOR DE BÚSQUEDA ESTRATÉGICO */}
      <section className="bg-white dark:bg-earth-card rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-2xl overflow-hidden">
        <div className="bg-intel/10 px-8 py-4 border-b border-intel/10 flex justify-between items-center">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-intel flex items-center gap-2">
             <span className="material-symbols-outlined text-sm">psychology</span> Escáner Territorial Gemini 3
           </h4>
           {isSearching && <span className="text-[8px] font-black text-intel animate-pulse uppercase tracking-widest">Sincronizando con Red Regional...</span>}
        </div>

        <div className="p-8 md:p-12 space-y-10">
           <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 w-full relative">
                 <input 
                   type="text" 
                   value={deepSearchQuery}
                   onChange={(e) => setDeepSearchQuery(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleDeepSearch()}
                   placeholder="Ej: ¿Qué nuevas leyes de reciclaje hay en Iquique para 2024?"
                   className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-3xl py-5 px-8 text-sm font-bold dark:text-white outline-none focus:border-intel/40 transition-all shadow-inner"
                 />
                 <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-300">search</span>
              </div>
              <button 
                onClick={handleDeepSearch}
                disabled={isSearching}
                className="h-16 px-10 bg-intel text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-intel/20 flex items-center gap-3 active:scale-95 disabled:opacity-50 transition-all w-full lg:w-auto"
              >
                {isSearching ? <span className="animate-spin material-symbols-outlined">refresh</span> : <span className="material-symbols-outlined">analytics</span>}
                Vincular Contexto
              </button>
           </div>

           {deepResult && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                
                {/* Bloque: Realidad Territorial */}
                <div className="bg-info/[0.03] rounded-[2rem] p-8 border border-info/10">
                   <h5 className="text-[9px] font-black text-info uppercase tracking-widest mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">public</span> Hechos en Tarapacá
                   </h5>
                   <div className="space-y-1">
                      {renderFormattedText(deepResult.facts)}
                   </div>
                </div>

                {/* Bloque: Estrategia Aplicada */}
                <div className="bg-intel/5 rounded-[2rem] p-8 border-2 border-intel/20 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                      <span className="material-symbols-outlined text-5xl">auto_awesome</span>
                   </div>
                   <h5 className="text-[9px] font-black text-intel uppercase tracking-widest mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">hub</span> Valor para tu Proyecto
                   </h5>
                   <div className="text-xs font-bold text-stone-800 dark:text-amber-100 leading-relaxed italic">
                      {renderFormattedText(deepResult.strategy)}
                   </div>
                </div>

                {/* Bloque: Acciones Inmediatas */}
                <div className="bg-primary/[0.03] rounded-[2rem] p-8 border border-primary/10">
                   <h5 className="text-[9px] font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">rocket_launch</span> Próximos Pasos
                   </h5>
                   <div className="space-y-4">
                      {deepResult.actions.split('\n').map((action, i) => (
                        action.trim() && (
                          <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm">
                             <div className="size-5 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-black">{i+1}</span>
                             </div>
                             <p className="text-[10px] font-bold text-stone-600 dark:text-stone-300">{action.replace(/^\d\.\s*/, '')}</p>
                          </div>
                        )
                      ))}
                   </div>
                </div>

             </div>
           )}
        </div>
      </section>

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="group bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[3rem] overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
          >
            <div className="relative h-60 overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-lg">{project.category}</span>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mt-2">{project.title}</h3>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <p className="text-stone-400 text-xs italic line-clamp-2 leading-relaxed mb-8">"{project.description}"</p>
              <div className="mt-auto flex justify-between items-center border-t border-stone-50 dark:border-stone-800 pt-6">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest">Recaudado</span>
                    <span className="text-lg font-black text-primary tracking-tighter">{project.fundedPercentage}%</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest">Fase</span>
                    <span className="text-[10px] font-bold dark:text-white uppercase tracking-wider">Aceleración</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
