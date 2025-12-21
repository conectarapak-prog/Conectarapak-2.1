
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
      title: `Auditoría: ${project.title.split(':')[0]}`,
      excerpt: auditReport.slice(0, 150) + "...",
      image: project.image,
      category: "AUDITORÍA IA"
    });
    setIsPublished(true);
  };

  const formatReport = (text: string) => {
    const sections = text.split(/(?=###?\s)/g);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, i) => {
          const lines = section.split('\n').filter(l => l.trim());
          if (lines.length === 0) return null;
          
          const title = lines[0].replace(/^#+\s*/, '');
          const content = lines.slice(1);

          return (
            <div key={i} className="bg-stone-50 dark:bg-stone-900/60 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-primary bg-primary/10 size-6 flex items-center justify-center rounded-lg">{i + 1}</span>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-stone-900 dark:text-white">
                  {title}
                </h3>
              </div>
              
              <div className="space-y-2">
                {content.map((line, idx) => {
                  const isNegative = line.toLowerCase().includes('riesgo') || line.toLowerCase().includes('falla');
                  
                  return (
                    <p key={idx} className={`text-[11px] leading-relaxed font-medium ${isNegative ? 'text-red-500' : 'text-stone-500'}`}>
                      {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <span key={j} className="text-stone-900 dark:text-white font-black">{part.slice(2, -2)}</span>;
                        }
                        return part.replace(/^[\*\-]\s*/, '');
                      })}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 animate-fade-in pb-20">
      {/* Header Compacto */}
      <div className="flex flex-col items-center text-center space-y-4 pt-10">
        <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.5em]">Análisis de Activos Pro</p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter dark:text-white uppercase leading-none">
          {project.title.split(':')[0]}
          <span className="text-primary italic font-light ml-3">Intelligence</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Media & Audit Results */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative rounded-[2rem] overflow-hidden aspect-video border border-stone-100 dark:border-stone-800 shadow-sm">
            <img src={project.image} className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="Project" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {showAudit && auditReport && (
            <div className="bg-white dark:bg-earth-card p-8 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-xl relative animate-fade-in">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-50 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Audit Report v3.0</h3>
                </div>
                <div className="flex gap-2">
                   {!isPublished && (
                     <button onClick={handlePublishInsight} className="bg-stone-900 dark:bg-white dark:text-stone-900 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all">Publicar</button>
                   )}
                   <button onClick={() => setShowAudit(false)} className="size-8 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-sm">close</span></button>
                </div>
              </div>

              {formatReport(auditReport)}
              
              <div className="mt-8 pt-6 border-t border-stone-50 dark:border-stone-800 flex justify-between">
                <p className="text-[8px] font-black text-stone-300 uppercase tracking-widest italic">Data Validated via regional nodes</p>
                <div className="flex gap-1">
                  <span className="size-1 rounded-full bg-primary"></span>
                  <span className="size-1 rounded-full bg-stone-200"></span>
                  <span className="size-1 rounded-full bg-stone-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Stats & Actions */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white dark:bg-earth-card p-8 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm space-y-8">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Recaudado</p>
              <h4 className="text-4xl font-black dark:text-white tracking-tighter">${project.raised.toLocaleString()} <span className="text-xs text-stone-300 font-bold uppercase tracking-widest">CLP</span></h4>
            </div>

            <div className="space-y-3">
               <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${project.fundedPercentage}%` }}></div>
               </div>
               <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-stone-400">
                  <span>{project.fundedPercentage}% Comprometido</span>
                  <span>Meta: ${project.goal.toLocaleString()}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-2xl text-center">
                  <p className="text-xl font-black dark:text-white">{project.daysLeft}</p>
                  <p className="text-[8px] font-black text-stone-400 uppercase mt-1">Días</p>
               </div>
               <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-2xl text-center">
                  <p className="text-xl font-black dark:text-white">IA Verified</p>
                  <p className="text-[8px] font-black text-primary uppercase mt-1">Status</p>
               </div>
            </div>

            <div className="space-y-3 pt-4">
              <button className="w-full py-4 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl active:scale-95">Patrocinar</button>
              <button 
                onClick={handleDeepAudit}
                disabled={isAuditing}
                className="w-full py-3 border border-stone-200 dark:border-stone-800 text-stone-400 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-50 transition-all disabled:opacity-50"
              >
                {isAuditing ? <span className="animate-spin material-symbols-outlined text-sm">sync</span> : <span className="material-symbols-outlined text-sm">psychology</span>}
                {isAuditing ? 'Auditando...' : 'Deep Audit Gemini'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
