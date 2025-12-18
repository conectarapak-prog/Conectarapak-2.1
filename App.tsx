
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
    // Si el usuario intenta acceder a una vista protegida sin login
    const protectedViews: View[] = ['admin', 'analysis', 'recommendations'];
    if (protectedViews.includes(currentView) && !user) {
      return <Login onLogin={handleLogin} />;
    }

    // RBAC: Verificación de permisos específicos
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
