
import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';

interface DiscoveryProps {
  onProjectClick: (p: Project) => void;
  searchTerm: string;
}

export const ProjectDiscovery: React.FC<DiscoveryProps> = ({ onProjectClick, searchTerm }) => {
  const [activeTab, setActiveTab] = useState('Todos');

  const categories = ['Todos', 'Tecnología', 'Arte', 'Impacto Social', 'Ecología Circular'];

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(project => {
      const matchesCategory = activeTab === 'Todos' || project.category === activeTab;
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <section className="flex flex-col gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold tracking-tight dark:text-white">
            Explora el ecosistema <span className="text-primary">CONECTARAPAK</span>
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg mt-2">
            Descubre y apoya proyectos innovadores impulsados por nuestra comunidad y asistidos por IA.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === cat 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => onProjectClick(project)}
              className="group bg-white dark:bg-earth-card rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                  {project.category}
                </div>
                <button className="absolute top-4 right-4 size-8 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-500 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-xl">favorite</span>
                </button>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm mt-3 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="mt-auto pt-6 space-y-4">
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(project.fundedPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-primary font-extrabold text-lg">{project.fundedPercentage}%</p>
                      <p className="text-[10px] uppercase font-bold text-stone-400">Financiado</p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-800 dark:text-stone-200 font-bold text-lg">{project.daysLeft}</p>
                      <p className="text-[10px] uppercase font-bold text-stone-400">Días restantes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-earth-card rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
           <span className="material-symbols-outlined text-5xl text-stone-300 mb-4">search_off</span>
           <p className="text-stone-500 dark:text-stone-400 font-bold">No encontramos proyectos que coincidan con tu búsqueda.</p>
           <button onClick={() => { setActiveTab('Todos'); }} className="mt-4 text-primary font-bold hover:underline">Limpiar filtros</button>
        </div>
      )}
    </div>
  );
};
