
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { ProjectDiscovery } from './pages/ProjectDiscovery';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminModeration } from './pages/AdminModeration';
import { PredictiveAnalysis } from './pages/PredictiveAnalysis';
import { Recommendations } from './pages/Recommendations';
import { Education } from './pages/Education';
import { Contact } from './pages/Contact';
import { FloatingChatbot } from './components/FloatingChatbot';
import { View, Project, User, UserRole } from './types';

const FooterLogo = () => (
  <svg viewBox="0 0 100 100" className="size-8 fill-none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="white" className="dark:fill-stone-800" stroke="#599E39" strokeWidth="2"/>
    <path d="M20 70 L40 45 L55 60 L75 35 L85 70 Z" fill="#437A28"/>
    <path d="M15 75 L35 55 L50 68 L70 45 L85 75 Z" fill="#599E39" opacity="0.8"/>
    <circle cx="50" cy="30" r="12" fill="#F59E0B"/>
    <path d="M30 80 Q50 95 70 80" stroke="#599E39" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

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
    setCurrentView('dashboard');
  };

  const checkAccess = (view: View, role?: UserRole): boolean => {
    const publicViews: View[] = ['home', 'dashboard', 'discovery', 'detail', 'login', 'contact'];
    if (publicViews.includes(view)) return true;
    if (!role) return false;

    switch (view) {
      case 'analysis':
        return role === 'entrepreneur';
      case 'recommendations':
        return role === 'investor_natural' || role === 'investor_legal';
      case 'admin':
        return role === 'advisor';
      case 'education':
        return role === 'entrepreneur' || role === 'advisor';
      default:
        return false;
    }
  };

  const AccessDenied = ({ requiredRole }: { requiredRole: string }) => (
    <div className="flex flex-col items-center justify-center py-32 animate-fade-in text-center px-6">
      <div className="size-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-8">
        <span className="material-symbols-outlined text-5xl">lock_person</span>
      </div>
      <h2 className="text-4xl font-black dark:text-white tracking-tighter mb-4">Acceso Restringido</h2>
      <p className="text-stone-500 dark:text-stone-400 max-w-md mb-10 font-medium">
        Lo sentimos, esta sección está reservada exclusivamente para perfiles de <span className="text-red-500 font-bold uppercase">{requiredRole}</span>. 
        Tu rol actual no tiene los permisos necesarios.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="bg-stone-100 dark:bg-stone-800 px-8 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-stone-200 transition-all"
        >
          Volver al Panel
        </button>
        <button 
          onClick={() => setUser(null)}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Cambiar Perfil
        </button>
      </div>
    </div>
  );

  const renderView = () => {
    if (currentView === 'login') return <Login onLogin={handleLogin} />;
    const isPublic = ['home', 'dashboard', 'discovery', 'detail', 'contact'].includes(currentView);
    if (!isPublic && !user) return <Login onLogin={handleLogin} />;

    if (user && !checkAccess(currentView, user.role)) {
      const roleNames: Record<string, string> = {
        analysis: 'Emprendedor',
        recommendations: 'Inversor',
        admin: 'Asesor / Mentor',
        education: 'Emprendedor o Asesor'
      };
      return <AccessDenied requiredRole={roleNames[currentView] || 'Autorizado'} />;
    }

    switch (currentView) {
      case 'home':
        return <Home setView={setCurrentView} />;
      case 'dashboard':
        return <Dashboard setView={setCurrentView} />;
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
      case 'contact':
        return <Contact />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-earth-dark transition-colors duration-300">
      <section className="bg-earth-surface py-2 flex justify-center gap-6 items-center border-b border-white/5 z-[60]">
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
              <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="transition-all hover:scale-125 hover:text-green-500 text-white/70">
              <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M12.01 2.01c-5.52 0-10 4.48-10 10 0 1.75.46 3.4 1.26 4.83L2 22l5.3-1.24c1.39.74 2.96 1.17 4.63 1.17 5.52 0 10-4.48 10-10s-4.48-10-10-10zm.08 17.5c-1.5 0-3-.4-4.31-1.16l-.31-.18-3.2.75.76-3.12-.2-.31c-.83-1.34-1.27-2.89-1.27-4.49 0-4.69 3.81-8.5 8.51-8.5 4.7 0 8.51 3.81 8.51 8.5-.01 4.69-3.82 8.5-8.51 8.51zm4.7-6.5c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.58.13-.17.26-.67.85-.82 1.02-.15.17-.3.19-.56.06-.26-.13-1.1-.41-2.1-1.29-.78-.7-1.31-1.56-1.46-1.82-.15-.26-.02-.4.12-.53.12-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.39-.79-1.91-.21-.51-.41-.44-.58-.45-.16-.01-.34-.01-.52-.01-.18 0-.47.07-.72.34-.25.26-.95.93-.95 2.27s.98 2.62 1.11 2.8c.13.17 1.94 2.96 4.71 4.15.66.28 1.17.45 1.57.58.66.21 1.26.18 1.74.11.53-.08 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.11-.26-.17-.52-.3z"/></svg>
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
        onLogout={() => { setUser(null); setCurrentView('home'); }}
      />
      
      <main className={`flex-1 w-full ${['home', 'dashboard', 'contact'].includes(currentView) ? '' : 'max-w-[1440px] mx-auto px-4 md:px-10 py-10'}`}>
        {renderView()}
      </main>

      {/* El Chatbot IA es visible en todas las vistas excepto login */}
      {currentView !== 'login' && <FloatingChatbot />}

      <footer className="bg-white dark:bg-earth-card border-t border-stone-200 dark:border-stone-800 py-12">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('dashboard')}
          >
            <FooterLogo />
            <span className="font-extrabold text-xl dark:text-white tracking-tighter uppercase text-stone-800">CONECTARAPAK</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-stone-400 uppercase tracking-widest">
            <button onClick={() => setCurrentView('home')} className="hover:text-primary">Sobre nosotros</button>
            <a href="#" className="hover:text-primary">Privacidad</a>
            <a href="#" className="hover:text-primary">Términos</a>
            <button onClick={() => setCurrentView('contact')} className="hover:text-primary">Soporte</button>
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
