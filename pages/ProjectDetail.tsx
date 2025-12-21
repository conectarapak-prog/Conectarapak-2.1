
import React, { useState } from 'react';
import { Project, NewsItem } from '../types';
import { deepAuditProject } from '../services/geminiService';

interface ProjectDetailProps {
  project: Project;
  onPublish: (insight: Partial<NewsItem>) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onPublish }) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [showAudit, setShowAudit] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleDeepAudit = async () => {
    setIsAuditing(true);
    const report = await deepAuditProject(project);
    setAuditReport(report);
    setShowAudit(true);
    setIsAuditing(false);
    setIsPublished(false);
  };

  const handlePublishInsight = () => {
    if (!auditReport) return;
    onPublish({
      title: `Auditoría Gemini: ${project.title}`,
      excerpt: auditReport,
      image: project.image,
      category: "AUDITORÍA IA"
    });
    setIsPublished(true);
  };

  const formatReport = (text: string) => {
    // Dividir por secciones basadas en encabezados de Markdown (#)
    const sections = text.split(/(?=###?\s)/g);
    
    return sections.map((section, i) => {
      const lines = section.split('\n').filter(l => l.trim());
      if (lines.length === 0) return null;
      
      const title = lines[0].replace(/^#+\s*/, '');
      const content = lines.slice(1);

      return (
        <div key={i} className="mb-16 last:mb-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="flex items-center gap-6 mb-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-300 dark:text-stone-600">
              {i + 1} / {sections.length}
            </h4>
            <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800"></div>
            <h3 className="text-sm font-black uppercase tracking-widest text-stone-900 dark:text-white">
              {title}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-11 md:col-start-2 space-y-6">
              {content.map((line, idx) => {
                const isDiscrepancy = line.toLowerCase().includes('discrepancia') || line.toLowerCase().includes('riesgo');
                const isList = line.trim().startsWith('*') || line.trim().startsWith('-');
                
                return (
                  <div key={idx} className={`relative ${isDiscrepancy ? 'border-l-2 border-red-400 pl-6 py-2' : ''}`}>
                    <p className={`text-sm md:text-base leading-[2] font-medium ${isDiscrepancy ? 'text-red-900 dark:text-red-200' : 'text-stone-600 dark:text-stone-400'}`}>
                      {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <span key={j} className="text-stone-900 dark:text-white font-black">{part.slice(2, -2)}</span>;
                        }
                        return part.replace(/^[\*\-]\s*/, '');
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-20 animate-fade-in pb-32">
      {/* Header Zen */}
      <div className="flex flex-col items-center text-center space-y-10 pt-16">
        <div className="w-12 h-px bg-primary/40"></div>
        <div className="space-y-4">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.6em]">Protocolo de Verificación</p>
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter dark:text-white uppercase leading-none">
            {project.title.split(':')[0]}
            <span className="block font-black text-primary tracking-tight">Impact Audit</span>
          </h2>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left Column: Media & Core Info */}
        <div className="lg:col-span-7 space-y-20">
          <div className="relative rounded-[2rem] overflow-hidden bg-stone-50 border border-stone-100 dark:border-stone-800 group shadow-sm">
            <img src={project.image} className="w-full aspect-video object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[3s]" alt="Project" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-stone-900/40 to-transparent"></div>
          </div>

          {/* DEEP AUDIT PANEL - MINIMALISMO ASIÁTICO */}
          {showAudit && auditReport && (
            <div className="bg-white dark:bg-earth-card/40 rounded-[3rem] border border-stone-100 dark:border-stone-800 p-12 md:p-20 animate-fade-in shadow-[0_80px_160px_-40px_rgba(0,0,0,0.04)] relative">
              
              {/* Hanko Sutil (Watermark) */}
              <div className="absolute top-10 right-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none">
                <span className="material-symbols-outlined text-[15rem]">verified</span>
              </div>

              {/* Document Metadata Header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-24 border-b border-stone-50 dark:border-stone-800 pb-16">
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-stone-900 dark:text-white tracking-tighter uppercase">
                    Resumen <span className="font-light italic text-stone-300">Ejecutivo</span>
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">ID:</span>
                      <span className="text-[10px] font-bold text-stone-500">{project.id}</span>
                    </div>
                    <div className="w-px h-3 bg-stone-100"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">IA:</span>
                      <span className="text-[10px] font-bold text-primary">GEMINI 3 PRO</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                   {!isPublished && (
                     <button 
                        onClick={handlePublishInsight}
                        className="h-12 px-8 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
                     >
                       Sincronizar Feed
                     </button>
                   )}
                   <button onClick={() => setShowAudit(false)} className="size-12 rounded-full border border-stone-100 dark:border-stone-800 text-stone-400 hover:text-red-500 transition-colors flex items-center justify-center">
                     <span className="material-symbols-outlined text-lg">close</span>
                   </button>
                </div>
              </div>

              {/* Contenido Destilado */}
              <div className="space-y-4">
                {formatReport(auditReport)}
              </div>

              {/* Certificación al Pie */}
              <div className="mt-24 pt-10 border-t border-stone-50 dark:border-stone-800 flex justify-between items-center text-stone-300 dark:text-stone-700">
                <p className="text-[8px] font-black uppercase tracking-[0.5em]">Digital Integrity Guaranteed</p>
                <div className="flex gap-4">
                  <span className="size-1.5 bg-stone-100 dark:bg-stone-800 rounded-full"></span>
                  <span className="size-1.5 bg-primary rounded-full"></span>
                  <span className="size-1.5 bg-stone-100 dark:bg-stone-800 rounded-full"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Actions & Stats */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-12">
            
            {/* Stats Card */}
            <div className="space-y-10 bg-white dark:bg-earth-card p-12 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.5em]">Capital Verificado</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-stone-900 dark:text-white tracking-tighter">${project.raised.toLocaleString('es-CL')}</span>
                  <span className="text-primary font-bold text-[10px] uppercase">CLP</span>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="h-0.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full">
                    <div className="h-full bg-primary" style={{ width: `${project.fundedPercentage}%` }}></div>
                 </div>
                 <div className="flex justify-between text-[8px] font-black text-stone-400 uppercase tracking-widest">
                    <span>{project.fundedPercentage}% Alcanzado</span>
                    <span>Meta: ${project.goal.toLocaleString()}</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-stone-50 dark:bg-stone-800 border border-stone-50 dark:border-stone-800 rounded-2xl overflow-hidden">
                <div className="bg-white dark:bg-stone-900 p-6 text-center">
                   <p className="text-2xl font-black dark:text-white">{project.daysLeft}</p>
                   <p className="text-[8px] font-black text-stone-400 uppercase mt-1 tracking-widest">Días</p>
                </div>
                <div className="bg-white dark:bg-stone-900 p-6 text-center">
                   <p className="text-2xl font-black dark:text-white">842</p>
                   <p className="text-[8px] font-black text-stone-400 uppercase mt-1 tracking-widest">Inversores</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <button className="w-full h-20 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all active:scale-95 shadow-2xl">
                Patrocinar Proyecto
              </button>
              <button 
                onClick={handleDeepAudit}
                disabled={isAuditing}
                className="w-full h-16 border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
              >
                {isAuditing ? <span className="animate-spin material-symbols-outlined">sync</span> : <span className="material-symbols-outlined text-lg">biotech</span>}
                {isAuditing ? 'Auditing Core...' : 'Deep Audit Gemini Pro'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
