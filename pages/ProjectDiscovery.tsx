
import React, { useState, useMemo, useRef } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project, NewsItem } from '../types';
import { searchRegionalInsights, generateImagePro } from '../services/geminiService';

interface DiscoveryProps {
  onProjectClick: (p: Project) => void;
  searchTerm: string;
  onPublish: (insight: Partial<NewsItem>) => void;
}

export const ProjectDiscovery: React.FC<DiscoveryProps> = ({ onProjectClick, searchTerm, onPublish }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [deepSearchQuery, setDeepSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [deepResult, setDeepResult] = useState<{
    facts: string;
    strategy: string;
    infographic: string;
    actions: string;
    sources: any[];
  } | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

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
    setDeepResult(null);
    setGeneratedImage(null);
    
    const targetProject = filteredProjects[0];
    const projectContext = targetProject 
      ? `${targetProject.title}: ${targetProject.description}`
      : undefined;

    const result = await searchRegionalInsights(deepSearchQuery, projectContext);
    
    if (result) {
      const text = result.text;
      const facts = text.split('[HECHOS]')[1]?.split('[ESTRATEGIA]')[0]?.trim() || "";
      const strategy = text.split('[ESTRATEGIA]')[1]?.split('[INFOGRAFIA]')[0]?.trim() || "";
      const infographic = text.split('[INFOGRAFIA]')[1]?.split('[ACCIONES]')[0]?.trim() || "";
      const actions = text.split('[ACCIONES]')[1]?.trim() || "";

      setDeepResult({
        facts,
        strategy,
        infographic,
        actions,
        sources: result.sources
      });
    }
    
    setIsSearching(false);
  };

  const handleGeneratePost = async () => {
    if (!deepResult) return;
    
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }

    setIsGeneratingPost(true);
    setShowPostModal(true);

    const visualPrompt = `Infografía educativa premium sobre ${deepSearchQuery} en Tarapacá. Estilo vectorial 3D moderno, colores vivos verde y naranja, composición equilibrada.`;
    
    try {
      const img = await generateImagePro(visualPrompt, "1K", "1:1");
      setGeneratedImage(img);
    } catch (error: any) {
      console.error("Error:", error);
    }
    setIsGeneratingPost(false);
  };

  const handleShareToFeed = () => {
    if (!deepResult) return;
    onPublish({
      title: deepSearchQuery,
      interpretation: deepResult.infographic,
      facts: deepResult.facts,
      image: generatedImage || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
      category: "AUDITORÍA IA"
    });
    setShowPostModal(false);
  };

  const renderFormattedText = (text: string, colorClass: string, isPost: boolean = false) => {
    return text.split('\n').filter(l => l.trim()).map((line, i) => {
      const isBullet = line.startsWith('*') || line.startsWith('-') || /^\d\./.test(line);
      const cleanLine = line.replace(/^[\*\-\d\.\s]+/, '');
      
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const content = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className={`${colorClass} font-extrabold`}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={i} className={`flex gap-3 items-start ${isPost ? 'mb-4' : 'mb-3'}`}>
            <span className={`${colorClass} mt-1.5 shrink-0 size-1.5 rounded-full bg-current`}></span>
            <span className={`text-[13px] leading-snug dark:text-stone-100 text-stone-800 ${isPost ? 'font-semibold' : 'font-medium'}`}>
              {content}
            </span>
          </div>
        );
      }
      return <p key={i} className={`text-[13px] leading-relaxed mb-4 dark:text-stone-300 text-stone-600 ${isPost ? 'font-bold' : ''}`}>{content}</p>;
    });
  };

  return (
    <div className="flex flex-col gap-16 animate-fade-in w-full items-center text-center">
      
      {/* Header Discovery */}
      <section className="flex flex-col items-center gap-8 py-8 border-b border-stone-100 dark:border-stone-800 w-full">
        <div className="space-y-4">
          <h2 className="text-6xl font-black tracking-tighter dark:text-white uppercase leading-none">
            Discovery <span className="text-primary italic">Lab</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">Auditoría Territorial & Social</p>
        </div>

        <div className="flex bg-white dark:bg-stone-900 p-2 rounded-full border border-stone-200 dark:border-stone-800 shadow-xl">
          {['Todos', 'Ecología Circular', 'Tecnología'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-primary text-white shadow-lg' : 'text-stone-400 hover:text-primary'
              }`}
            >
              {cat === 'Ecología Circular' ? 'Ecología' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Input de Búsqueda */}
      <section className="w-full max-w-4xl bg-white dark:bg-earth-card rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-stone-100 dark:border-stone-800 flex flex-col gap-8 items-center">
        <div className="w-full relative">
           <span className="absolute left-8 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-300 text-3xl">search</span>
           <input 
            type="text" 
            value={deepSearchQuery}
            onChange={(e) => setDeepSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleDeepSearch()}
            placeholder="Analizar tema específico regional..."
            className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-3xl py-6 pl-20 pr-10 text-lg font-bold dark:text-white focus:border-primary transition-all shadow-inner"
           />
        </div>
        <button 
          onClick={handleDeepSearch}
          disabled={isSearching}
          className="h-[72px] px-16 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center gap-4 active:scale-95 disabled:opacity-50 transition-all"
        >
          {isSearching ? <span className="animate-spin material-symbols-outlined text-2xl">refresh</span> : <span className="material-symbols-outlined text-3xl">psychology</span>}
          {isSearching ? 'Analizando Territorio...' : 'Sincronizar Visión'}
        </button>
      </section>

      {/* Resultados Bento Grid Estandarizado */}
      {deepResult && (
        <section className="animate-fade-in w-full space-y-10">
           <div className="flex justify-center gap-4">
              <button onClick={handleGeneratePost} className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 flex items-center gap-3 transition-all">
                <span className="material-symbols-outlined">auto_awesome</span> Infografía Educativa
              </button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
              <div className="bg-white dark:bg-earth-card p-10 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-sm">
                <h5 className="text-[10px] font-black text-info uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined">data_usage</span> Hechos
                </h5>
                {renderFormattedText(deepResult.facts, 'text-info')}
              </div>
              <div className="bg-white dark:bg-earth-card p-10 rounded-[3.5rem] border-2 border-primary/20 shadow-2xl shadow-primary/5">
                <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined">rocket</span> Valor
                </h5>
                {renderFormattedText(deepResult.strategy, 'text-primary')}
              </div>
              <div className="bg-white dark:bg-earth-card p-10 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-sm">
                <h5 className="text-[10px] font-black text-intel uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined">school</span> Educación
                </h5>
                {renderFormattedText(deepResult.infographic, 'text-intel')}
              </div>
           </div>
        </section>
      )}

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="group bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[3.5rem] overflow-hidden hover:shadow-2xl transition-all duration-700 cursor-pointer flex flex-col text-left"
          >
            <div className="h-64 relative overflow-hidden">
               <img src={project.image} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-700" alt={project.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent"></div>
               <div className="absolute bottom-6 left-8">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 mb-2 inline-block">{project.category}</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{project.title}</h3>
               </div>
            </div>
            <div className="p-10 flex flex-col justify-between flex-1">
               <p className="text-stone-500 text-sm font-medium leading-relaxed italic line-clamp-2 mb-8">"{project.description}"</p>
               <div className="flex justify-between items-end border-t border-stone-50 dark:border-stone-800 pt-8">
                  <div>
                    <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Inversión</span>
                    <p className="text-3xl font-black text-primary tracking-tighter">{project.fundedPercentage}%</p>
                  </div>
                  <div className="size-12 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
