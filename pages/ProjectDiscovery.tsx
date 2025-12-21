
import React, { useState, useMemo, useRef } from 'react';
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

  const handleDownloadPDF = () => {
    if (!deepResult) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CONECTARAPAK - Reporte Territorial</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #1f2937; }
              h1 { color: #599E39; border-bottom: 2px solid #599E39; padding-bottom: 10px; }
              h2 { color: #1E40AF; margin-top: 30px; }
              p { line-height: 1.6; }
              .section { margin-bottom: 20px; padding: 20px; background: #f9fafb; border-radius: 10px; }
            </style>
          </head>
          <body>
            <h1>REPORTE DE INTELIGENCIA ESTRATÉGICA - TARAPACÁ</h1>
            <div class="section"><h2>HECHOS CLAVE</h2><p>${deepResult.facts.replace(/\n/g, '<br>')}</p></div>
            <div class="section"><h2>VALOR PARA EL PROYECTO</h2><p>${deepResult.strategy.replace(/\n/g, '<br>')}</p></div>
            <div class="section"><h2>PUENTE DE ENTENDIMIENTO (EDUCACIÓN DIGITAL)</h2><p>${deepResult.infographic.replace(/\n/g, '<br>')}</p></div>
            <div class="section"><h2>ACCIONES RECOMENDADAS</h2><p>${deepResult.actions.replace(/\n/g, '<br>')}</p></div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const renderFormattedText = (text: string, colorClass: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('*') || line.startsWith('-') || /^\d\./.test(line)) {
        return (
          <div key={i} className="flex gap-3 mb-3 items-start">
            <span className={`${colorClass} font-black mt-1`}>•</span>
            <span className="text-xs font-semibold dark:text-stone-300 leading-relaxed">
              {line.replace(/^[\*\-\d\.\s]+/, '')}
            </span>
          </div>
        );
      }
      return <p key={i} className="text-xs mb-4 font-medium leading-relaxed dark:text-stone-300 pr-4">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-20 max-w-[1440px] mx-auto px-4 md:px-8">
      
      {/* Header Premium */}
      <section className="flex flex-col lg:flex-row justify-between items-center gap-8 py-6 border-b border-stone-100 dark:border-stone-800">
        <div className="space-y-3 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-intel/10 text-intel border border-intel/20">
             <span className="material-symbols-outlined text-sm animate-pulse">hub</span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sincronización Regional</span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter dark:text-white uppercase leading-none">
            Discovery <span className="text-primary italic">Lab</span>
          </h2>
        </div>

        <div className="flex bg-stone-100 dark:bg-stone-900 p-2 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-inner">
          {['Todos', 'Ecología Circular', 'Tecnología'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-white dark:bg-stone-800 text-primary shadow-xl scale-105' : 'text-stone-400'
              }`}
            >
              {cat === 'Ecología Circular' ? 'Ecología' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* ESTACIÓN DE INTELIGENCIA TERRITORIAL */}
      <section className="bg-white dark:bg-earth-card rounded-[4rem] border border-stone-100 dark:border-stone-800 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-info via-intel to-primary opacity-50"></div>
        
        <div className="p-8 md:p-14 space-y-12">
           <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1 w-full space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400 ml-4">Consulta de Impacto Regional</h4>
                 <div className="relative">
                    <input 
                      type="text" 
                      value={deepSearchQuery}
                      onChange={(e) => setDeepSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleDeepSearch()}
                      placeholder="Ej: ¿Hay incentivos para el compostaje industrial en Iquique?"
                      className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-[2.5rem] py-6 px-10 text-lg font-bold dark:text-white outline-none focus:border-intel/30 transition-all shadow-inner"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-300 text-3xl">language</span>
                 </div>
              </div>
              <button 
                onClick={handleDeepSearch}
                disabled={isSearching}
                className="h-[84px] px-14 bg-intel text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-intel/20 flex items-center gap-4 active:scale-95 disabled:opacity-50 transition-all w-full lg:w-auto mt-8"
              >
                {isSearching ? <span className="animate-spin material-symbols-outlined text-3xl">refresh</span> : <span className="material-symbols-outlined text-3xl">psychology</span>}
                {isSearching ? 'Analizando...' : 'Sincronizar Visión'}
              </button>
           </div>

           {deepResult && (
             <div ref={reportRef} className="space-y-10 animate-fade-in">
                {/* TOOLBAR DE EXPORTACIÓN */}
                <div className="flex justify-end gap-4 border-b border-stone-100 dark:border-stone-800 pb-8">
                   <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-3 px-6 py-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-300 hover:bg-info hover:text-white transition-all shadow-sm"
                   >
                      <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                      Reporte PDF
                   </button>
                   <button className="flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                      <span className="material-symbols-outlined text-lg">share</span>
                      Generar Post Educativo
                   </button>
                </div>

                {/* BENTO GRID DE RESULTADOS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   
                   {/* Bloque 1: Reporte Territorial (Info) */}
                   <div className="lg:col-span-4 bg-info/[0.03] rounded-[3rem] p-10 border border-info/10 relative overflow-hidden group/card">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:scale-110 transition-transform"><span className="material-symbols-outlined text-8xl text-info">database</span></div>
                      <h5 className="text-[10px] font-black text-info uppercase tracking-widest mb-8 flex items-center gap-3">
                         <span className="material-symbols-outlined">analytics</span> Reporte de Hechos
                      </h5>
                      <div className="relative z-10">
                        {renderFormattedText(deepResult.facts, 'text-info')}
                      </div>
                   </div>

                   {/* Bloque 2: Valor Estratégico (Intel) */}
                   <div className="lg:col-span-4 bg-intel/[0.03] rounded-[3rem] p-10 border-2 border-intel/20 shadow-xl relative overflow-hidden group/card">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/card:rotate-6 transition-transform"><span className="material-symbols-outlined text-8xl text-intel">stars</span></div>
                      <h5 className="text-[10px] font-black text-intel uppercase tracking-widest mb-8 flex items-center gap-3">
                         <span className="material-symbols-outlined">auto_awesome</span> Valor del Proyecto
                      </h5>
                      <div className="relative z-10 font-bold italic dark:text-amber-100/90 leading-relaxed">
                        {renderFormattedText(deepResult.strategy, 'text-intel')}
                      </div>
                   </div>

                   {/* Bloque 3: Infografía Puente (Primary) */}
                   <div className="lg:col-span-4 bg-primary/[0.03] rounded-[3rem] p-10 border border-primary/20 shadow-2xl shadow-primary/5 relative overflow-hidden group/card">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/card:scale-110 transition-transform"><span className="material-symbols-outlined text-8xl text-primary">diversity_3</span></div>
                      <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-8 flex items-center gap-3">
                         <span className="material-symbols-outlined">universal_currency</span> Puente de Entendimiento
                      </h5>
                      <div className="bg-white/40 dark:bg-black/20 p-6 rounded-2xl border border-primary/10 backdrop-blur-sm relative z-10">
                         <p className="text-[11px] font-black uppercase text-primary mb-4 tracking-widest">Educación Ciudadana:</p>
                         {renderFormattedText(deepResult.infographic, 'text-primary')}
                      </div>
                   </div>

                   {/* Bloque 4: Acciones (Full Width) */}
                   <div className="lg:col-span-12 bg-stone-900 text-white rounded-[3rem] p-10 border border-stone-800 shadow-2xl">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                         <div className="space-y-2">
                            <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] flex items-center gap-3">
                               <span className="material-symbols-outlined">rocket_launch</span> Plan de Acción Inmediata
                            </h5>
                            <p className="text-stone-400 text-xs font-medium">Siguientes pasos validados por el motor de inteligencia regional.</p>
                         </div>
                         <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            {deepResult.actions.split('\n').map((action, i) => (
                              action.trim() && (
                                <div key={i} className="flex-1 min-w-[200px] p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
                                   <div className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs font-black mb-3">{i+1}</div>
                                   <p className="text-[11px] font-bold leading-relaxed">{action.replace(/^\d\.\s*/, '')}</p>
                                </div>
                              )
                            ))}
                         </div>
                      </div>
                   </div>

                </div>
             </div>
           )}
        </div>
      </section>

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="group bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[3.5rem] overflow-hidden hover:border-primary hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer flex flex-col relative"
          >
            <div className="relative h-64 overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent"></div>
              
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="px-4 py-1.5 bg-primary/90 text-white text-[9px] font-black uppercase tracking-widest rounded-xl backdrop-blur-sm">
                  {project.category}
                </span>
              </div>

              <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{project.title}</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-80">VALIDACIÓN IA ACTIVA</p>
                 </div>
              </div>
            </div>

            <div className="p-10 flex-1 flex flex-col justify-between">
              <p className="text-stone-400 text-sm font-medium leading-relaxed italic line-clamp-2">"{project.description}"</p>
              
              <div className="mt-10 pt-8 border-t border-stone-50 dark:border-stone-800 flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">Impacto Circular</span>
                    <span className="text-2xl font-black text-primary tracking-tighter">{project.fundedPercentage}%</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">Región</span>
                    <span className="text-xs font-black dark:text-white uppercase tracking-wider">Tarapacá</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
