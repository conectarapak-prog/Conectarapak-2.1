
import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project, NewsItem, View } from '../types';
import { searchRegionalInsights, generateImagePro } from '../services/geminiService';

interface DiscoveryProps {
  onProjectClick: (p: Project) => void;
  searchTerm: string;
  onPublish: (insight: Partial<NewsItem>) => void;
  setView: (v: View) => void;
}

export const ProjectDiscovery: React.FC<DiscoveryProps> = ({ onProjectClick, searchTerm, onPublish, setView }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [deepSearchQuery, setDeepSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'blueprint' | 'social'>('blueprint');
  
  const [deepResult, setDeepResult] = useState<{
    facts: string;
    strategy: string;
    infographic: string;
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

  const cleanText = (text: string) => text.replace(/\*\*/g, '').trim();

  const handleDeepSearch = async () => {
    if (!deepSearchQuery.trim()) return;
    setIsSearching(true);
    setDeepResult(null);
    const result = await searchRegionalInsights(deepSearchQuery);
    if (result) {
      const text = result.text;
      const facts = text.split('[HECHOS]')[1]?.split('[ESTRATEGIA]')[0]?.trim() || "";
      const strategy = text.split('[ESTRATEGIA]')[1]?.split('[INFOGRAFIA]')[0]?.trim() || "";
      const infographic = text.split('[INFOGRAFIA]')[1]?.split('[ACCIONES]')[0]?.trim() || "";
      setDeepResult({ facts, strategy, infographic, actions: "", sources: result.sources });
    }
    setIsSearching(false);
  };

  return (
    <div className="w-full flex flex-col gap-10 animate-fade-in items-center">
      
      {/* Search Minimalist */}
      <section className="w-full max-w-3xl space-y-6 text-center">
        <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Discovery <span className="text-primary italic">Lab</span></h2>
        <div className="relative group">
           <input 
            type="text" 
            value={deepSearchQuery}
            onChange={(e) => setDeepSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleDeepSearch()}
            placeholder="Analizar desafío territorial..."
            className="w-full bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[1.5rem] py-5 pl-12 pr-6 text-sm font-bold shadow-sm outline-none focus:border-primary transition-all"
           />
           <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-300">search</span>
           <button 
            onClick={handleDeepSearch}
            disabled={isSearching}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-6 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg disabled:opacity-50"
           >
            {isSearching ? '...' : 'Auditar'}
           </button>
        </div>
      </section>

      {/* Resultados Fluidos */}
      {deepResult && (
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
           {[
             { title: 'Hechos', data: deepResult.facts, color: 'text-info' },
             { title: 'Valor', data: deepResult.strategy, color: 'text-primary' },
             { title: 'Educación', data: deepResult.infographic, color: 'text-intel' }
           ].map((col, i) => (
             <div key={i} className="bg-white dark:bg-stone-900 p-8 rounded-[2rem] border border-stone-50 dark:border-stone-800 shadow-sm">
                <h5 className={`text-[9px] font-black uppercase tracking-[0.3em] mb-4 ${col.color}`}>{col.title}</h5>
                <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400 font-medium">
                  {cleanText(col.data)}
                </p>
             </div>
           ))}
        </section>
      )}

      {/* Grid Proyectos Compacto */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="group bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[2rem] overflow-hidden hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="h-48 relative overflow-hidden">
               <img src={project.image} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-4 left-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{project.title}</h3>
               </div>
            </div>
            <div className="p-6">
               <p className="text-[10px] text-stone-500 font-medium line-clamp-2 italic mb-4">"{project.description}"</p>
               <div className="flex justify-between items-center border-t border-stone-50 dark:border-stone-800 pt-4">
                  <span className="text-xl font-black text-primary">{project.fundedPercentage}%</span>
                  <span className="text-[8px] font-black text-stone-300 uppercase">Fondeado</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
