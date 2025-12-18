
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Home } from './pages/Home';
import { ProjectDiscovery } from './pages/ProjectDiscovery';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminModeration } from './pages/AdminModeration';
import { PredictiveAnalysis } from './pages/PredictiveAnalysis';
import { Recommendations } from './pages/Recommendations';
import { Education } from './pages/Education';
import { View, Project, User } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);

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

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentView('home');
  };

  const renderView = () => {
    const protectedViews: View[] = ['admin', 'analysis', 'recommendations'];
    if (protectedViews.includes(currentView) && !user) {
      return <Login onLogin={handleLogin} />;
    }

    if (currentView === 'admin' && user?.role !== 'advisor') {
      return <div className="p-20 text-center font-bold">Acceso Denegado. Solo Asesores.</div>;
    }
    if (currentView === 'analysis' && user?.role !== 'entrepreneur') {
      return <div className="p-20 text-center font-bold">Acceso Denegado. Solo Emprendedores.</div>;
    }

    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'home':
        return <Home setView={setCurrentView} />;
      case 'discovery':
        return <ProjectDiscovery onProjectClick={navigateToProject} searchTerm={searchTerm} />;
      case 'detail':
        return selectedProject ? <ProjectDetail project={selectedProject} /> : <ProjectDiscovery onProjectClick={navigateToProject} searchTerm={searchTerm} />;
      case 'admin':
        return <AdminModeration />;
      case 'analysis':
        return <PredictiveAnalysis />;
      case 'recommendations':
        return <Recommendations />;
      case 'education':
        return <Education />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-earth-dark transition-colors duration-300">
      {/* Top Social Media Bar */}
      <section className="bg-earth-surface py-2.5 flex justify-center gap-6 items-center border-b border-white/5 z-[60]">
        <div className="max-w-[1440px] w-full px-10 flex justify-between items-center">
          <div className="hidden sm:flex items-center gap-4">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">Conectando Tarapacá</p>
            <div className="size-1 rounded-full bg-primary/40"></div>
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Sustentabilidad & IA</p>
          </div>
          <div className="flex gap-6 items-center mx-auto sm:mx-0">
            <a href="#" className="transition-all hover:scale-125 hover:text-primary text-white/70">
              <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
            </a>
            <a href="#" className="transition-all hover:scale-125 hover:text-primary text-white/70">
              <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.48.75 2.78 1.89 3.55-.7 0-1.36-.21-1.94-.53v.05c0 2.07 1.47 3.8 3.43 4.19-.36.1-.73.15-1.12.15-.27 0-.54-.03-.8-.08.54 1.69 2.12 2.92 3.99 2.96-1.46 1.14-3.3 1.82-5.3 1.82-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.93 6.59 1.93 7.9 0 12.21-6.54 12.21-12.21 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
            </a>
            <a href="#" className="transition-all hover:scale-125 hover:text-primary text-white/70">
              <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="transition-all hover:scale-125 hover:text-primary text-white/70">
              <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </section>

      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onSearchChange={setSearchTerm}
        user={user}
        onLogout={() => setUser(null)}
      />
      
      <main className={`flex-1 w-full ${currentView === 'home' ? '' : 'max-w-[1440px] mx-auto px-4 md:px-10 py-10'}`}>
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
