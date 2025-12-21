
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

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 animate-fade-in pb-24">
      {/* Hero Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">
          <span className="material-symbols-outlined text-sm">verified</span>
          Validado por CONECTARAPAK IA
        </div>
        <h2 className="text-6xl md:text-7xl font-black tracking-tighter dark:text-white leading-[0.9]">
          {project.title}
        </h2>
        <p className="text-xl text-stone-500 dark:text-stone-400 font-medium max-w-3xl mx-auto leading-relaxed italic">
          "{project.description}"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-8 space-y-12">
          <div className="aspect-video rounded-[4rem] overflow-hidden bg-stone-900 shadow-2xl relative border-4 border-white dark:border-stone-800 group">
            <img src={project.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" alt="Project" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          {/* AI Deep Audit Result */}
          {showAudit && auditReport && (
             <div className="bg-primary/5 dark:bg-primary/10 p-12 rounded-[4rem] border-2 border-primary/20 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                  <span className="material-symbols-outlined text-[12rem] text-primary">psychology</span>
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="text-2xl font-black dark:text-white tracking-tighter flex items-center gap-3">
                       <span className="material-symbols-outlined text-primary">security</span> Auditoría Técnica Profunda
                    </h4>
                    <div className="flex gap-4">
                       {!isPublished && (
                         <button 
                            onClick={handlePublishInsight}
                            className="bg-primary text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-primary-hover transition-all flex items-center gap-2"
                         >
                            <span className="material-symbols-outlined text-sm">sync</span> Sincronizar Feed
                         </button>
                       )}
                       <button onClick={() => setShowAudit(false)} className="text-stone-400 hover:text-stone-800 transition-colors">
                         <span className="material-symbols-outlined">close</span>
                       </button>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-200 text-lg leading-relaxed whitespace-pre-wrap font-medium border-l-4 border-primary/30 pl-8 py-2 italic">
                    {auditReport}
                  </div>
                  <div className="flex gap-4">
                    <span className="px-4 py-2 bg-white dark:bg-stone-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary border border-primary/10">Integridad: Alta</span>
                    <span className="px-4 py-2 bg-white dark:bg-stone-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary border border-primary/10">Riesgo: Bajo</span>
                  </div>
                </div>
             </div>
          )}

          <div className="bg-white dark:bg-earth-card rounded-[3.5rem] p-12 border border-stone-100 dark:border-stone-800 shadow-sm space-y-8">
            <h3 className="text-3xl font-black dark:text-white tracking-tight uppercase">Estrategia Circular</h3>
            <p className="text-stone-600 dark:text-stone-300 text-xl leading-relaxed font-medium">
              Este proyecto implementa un modelo de **Logística Inversa Inteligente** único en Tarapacá, reduciendo el desperdicio industrial en un 40% proyectado para el primer semestre.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-stone-50 dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800">
                 <span className="material-symbols-outlined text-primary text-4xl mb-4">recycled</span>
                 <h5 className="font-black text-stone-800 dark:text-white uppercase text-sm mb-2">Recuperación Directa</h5>
                 <p className="text-xs text-stone-500 font-medium">Ciclo cerrado de materiales con trazabilidad Blockchain.</p>
              </div>
              <div className="p-8 bg-stone-50 dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800">
                 <span className="material-symbols-outlined text-primary text-4xl mb-4">group_work</span>
                 <h5 className="font-black text-stone-800 dark:text-white uppercase text-sm mb-2">Simbiosis Industrial</h5>
                 <p className="text-xs text-stone-500 font-medium">Vinculación con 4 gremios locales de la zona franca.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-earth-card rounded-[4rem] p-12 border border-stone-200 dark:border-stone-800 shadow-2xl sticky top-28 space-y-10">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Recaudado</p>
              <h4 className="text-6xl font-black text-primary tracking-tighter">${project.raised.toLocaleString('es-CL')}</h4>
              <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Meta: ${project.goal.toLocaleString('es-CL')}</p>
            </div>

            <div className="h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden shadow-inner">
               <div className="h-full bg-primary" style={{ width: `${project.fundedPercentage}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-y border-stone-100 dark:border-stone-800 py-8">
               <div>
                 <p className="text-3xl font-black dark:text-white tracking-tighter">{project.daysLeft}</p>
                 <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Días Restantes</p>
               </div>
               <div>
                 <p className="text-3xl font-black dark:text-white tracking-tighter">842</p>
                 <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Patrocinadores</p>
               </div>
            </div>

            <div className="space-y-4">
               <button className="w-full h-20 bg-primary text-white rounded-3xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                 Patrocinar Impacto
                 <span className="material-symbols-outlined">rocket_launch</span>
               </button>
               
               <button 
                 onClick={handleDeepAudit}
                 disabled={isAuditing}
                 className="w-full h-16 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all hover:bg-black dark:hover:bg-stone-100 disabled:opacity-50"
               >
                 {isAuditing ? (
                   <span className="animate-spin material-symbols-outlined">refresh</span>
                 ) : (
                   <span className="material-symbols-outlined">psychology_alt</span>
                 )}
                 {isAuditing ? 'Auditando...' : 'Deep Audit Gemini Pro'}
               </button>
            </div>

            <div className="text-center">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">security</span> Transacción Circular Protegida
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
