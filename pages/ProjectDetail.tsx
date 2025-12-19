
import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `¡Mira este increíble proyecto circular en CONECTARAPAK: ${project.title}!`;
    
    // Priorizar el uso de la API nativa de compartir si está disponible (Mobile y Browsers modernos)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CONECTARAPAK - ${project.title}`,
          text: project.description,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error al compartir:', error);
        }
      }
    } else {
      // Fallback: Copiar al portapapeles para navegadores que no soportan share nativo (Desktop mayoritariamente)
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        // Resetear el estado de "Copiado" después de 3 segundos
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('No se pudo copiar el enlace: ', err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
          <span className="material-symbols-outlined text-sm">eco</span>
          {project.category}
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight dark:text-white">
          {project.title}
        </h2>
        <p className="text-xl text-stone-500 dark:text-stone-400 font-medium max-w-3xl mx-auto">
          {project.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="aspect-video rounded-3xl overflow-hidden bg-stone-900 shadow-xl relative group">
            <img 
              src={project.image} 
              alt="Project media" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="size-20 bg-primary rounded-full text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl">play_arrow</span>
              </button>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-bold dark:text-white">Acerca del Proyecto</h3>
            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed">
              En CONECTARAPAK, creemos en la transparencia y el impacto. Este proyecto ha sido validado por nuestra IA de sostenibilidad 
              para asegurar que cumple con los estándares de economía circular.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <img src="https://picsum.photos/seed/detail1/600/400" className="rounded-2xl shadow-sm" alt="Detail 1" />
              <img src="https://picsum.photos/seed/detail2/600/400" className="rounded-2xl shadow-sm" alt="Detail 2" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white dark:bg-earth-card rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-lg sticky top-24">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-primary font-extrabold text-3xl">${project.raised.toLocaleString()}</span>
                  <span className="text-stone-400 font-bold text-sm">de ${project.goal.toLocaleString()}</span>
                </div>
                <div className="h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-lime-500" 
                    style={{ width: `${Math.min(project.fundedPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-sm font-bold text-stone-500">{project.fundedPercentage}% financiado</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-stone-100 dark:border-stone-800 py-6">
                <div>
                  <p className="text-2xl font-bold dark:text-white">850</p>
                  <p className="text-xs uppercase font-bold text-stone-400 tracking-wider">Patrocinadores</p>
                </div>
                <div>
                  <p className="text-2xl font-bold dark:text-white">{project.daysLeft}</p>
                  <p className="text-xs uppercase font-bold text-stone-400 tracking-wider">Días restantes</p>
                </div>
              </div>

              <button className="w-full bg-primary hover:bg-primary-hover text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                Patrocinar este proyecto
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <div className="flex gap-2">
                <button className="flex-1 border border-stone-200 dark:border-stone-800 rounded-xl h-12 flex items-center justify-center font-bold text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                  <span className="material-symbols-outlined mr-2">bookmark</span> Guardar
                </button>
                <button 
                  onClick={handleShare}
                  className={`flex-1 border border-stone-200 dark:border-stone-800 rounded-xl h-12 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    copied 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                    : 'hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                  title="Compartir en redes sociales"
                >
                  <span className="material-symbols-outlined mr-2">
                    {copied ? 'check_circle' : 'share'}
                  </span> 
                  {copied ? '¡Copiado!' : 'Compartir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
