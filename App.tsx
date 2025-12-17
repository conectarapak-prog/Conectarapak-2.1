
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProjectDiscovery } from './pages/ProjectDiscovery';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminModeration } from './pages/AdminModeration';
import { PredictiveAnalysis } from './pages/PredictiveAnalysis';
import { View, Project } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('discovery');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navigateToProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'discovery':
      case 'home':
        return <ProjectDiscovery onProjectClick={navigateToProject} />;
      case 'detail':
        return selectedProject ? <ProjectDetail project={selectedProject} /> : <ProjectDiscovery onProjectClick={navigateToProject} />;
      case 'admin':
        return <AdminModeration />;
      case 'analysis':
        return <PredictiveAnalysis />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <span className="material-symbols-outlined text-6xl">construction</span>
            <p className="text-xl font-bold mt-4 uppercase tracking-widest">En Construcción</p>
            <button 
              onClick={() => setCurrentView('discovery')}
              className="mt-6 text-primary font-bold underline"
            >
              Volver al inicio
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-earth-dark transition-colors duration-300">
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-10">
        {renderView()}
      </main>

      <footer className="bg-white dark:bg-earth-card border-t border-stone-200 dark:border-stone-800 py-12">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">change_circle</span>
            <span className="font-extrabold text-xl dark:text-white tracking-tighter">CONECTARAPAK</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-stone-400 uppercase tracking-widest">
            <a href="#" className="hover:text-primary">Sobre nosotros</a>
            <a href="#" className="hover:text-primary">Privacidad</a>
            <a href="#" className="hover:text-primary">Términos</a>
            <a href="#" className="hover:text-primary">Soporte</a>
          </div>
          <p className="text-stone-400 text-xs font-medium">
            © 2024 CONECTARAPAK Inc. Innovación Sostenible.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
