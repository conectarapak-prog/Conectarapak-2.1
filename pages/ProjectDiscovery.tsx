
import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project, NewsItem, View } from '../types';
import { searchRegionalInsights } from '../services/geminiService';

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
  const [deepResult, setDeepResult] = useState<any>(null);

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
    const result = await searchRegionalInsights(deepSearchQuery);
    if (result) {
      setDeepResult({ text: result.text, sources: result.sources });
    }
    setIsSearching(false);
  };

  return (
    <div className="w-full space-y-12 py-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* SEARCH HUD */}
      <section className="bg-white dark:bg-stone-950 p-8 rounded-[3rem] border nosigner-card flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 relative w-full">
           <input 
            type="text" 
            value={deepSearchQuery}
            onChange={(e) => setDeepSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleDeepSearch()}
            placeholder="Audit Territorial Challenge..."
            className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-2xl py-4 pl-12 pr-6 text-xs font-mono font-bold dark:text-white outline-none focus:ring-1 focus:ring-primary"
           />
           <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-300 text-lg">search</span>
        </div>
        <div className="flex gap-2">
           {['Todos', 'Ecología', 'Tecnología'].map(c => (
             <button key={c} onClick={() => setActiveCategory(c)} className={`px-6 py-3 rounded-xl text-[8px] font-mono font-black uppercase tracking-widest border transition-all ${activeCategory === c ? 'bg-primary text-white border-primary' : 'bg-transparent text-stone-400 border-stone-100 dark:border-stone-800 hover:text-stone-600'}`}>{c}</button>
           ))}
        </div>
      </section>

      {/* RESULTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="bg-white dark:bg-stone-950 border nosigner-card rounded-[2.5rem] overflow-hidden group hover:bg-stone-50 dark:hover:bg-stone-900 transition-all cursor-pointer h-[350px] flex flex-col"
          >
            <div className="h-40 relative">
               <img src={project.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
               <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur px-3 py-1 rounded-lg text-[7px] font-mono text-white uppercase tracking-widest">{project.category}</div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
               <h3 className="text-sm font-black dark:text-white uppercase tracking-tighter leading-tight">{project.title}</h3>
               <div className="pt-4 border-t nosigner-card flex justify-between items-center">
                  <div className="space-y-0.5">
                     <p className="text-[7px] font-mono font-black text-stone-400 uppercase">Impacto</p>
                     <p className="text-lg font-black text-primary">{project.fundedPercentage}%</p>
                  </div>
                  <span className="material-symbols-outlined text-stone-200 group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
