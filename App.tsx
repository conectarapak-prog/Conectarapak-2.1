
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { ProjectDiscovery } from './pages/ProjectDiscovery';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminModeration } from './pages/AdminModeration';
import { AIPowerLab } from './pages/AIPowerLab';
import { Recommendations } from './pages/Recommendations';
import { Education } from './pages/Education';
import { Contact } from './pages/Contact';
import { FloatingChatbot } from './components/FloatingChatbot';
import { LiveAssistant } from './components/LiveAssistant';
import { View, Project, User, NewsItem } from './types';
import { MOCK_NEWS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>(MOCK_NEWS);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
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

  const publishInsight = (insight: Partial<NewsItem>) => {
    const newItem: NewsItem = {
      id: Date.now(),
      title: insight.title || "Nuevo Insight de IA",
      category: insight.category || "AUDITORÍA IA",
      tag: "Gemini Pro",
      image: insight.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      excerpt: insight.excerpt || "",
      isAI: true
    };
    setNewsFeed(prev => [newItem, ...prev]);
    alert("¡Insight sincronizado con el feed global!");
  };

  const renderView = () => {
    if (currentView === 'login') return <Login onLogin={handleLogin} />;
    
    switch (currentView) {
      case 'home': return <Home setView={setCurrentView} news={newsFeed} />;
      case 'dashboard': return <Dashboard setView={setCurrentView} userRole={user?.role} userName={user?.name} />;
      case 'discovery': return <ProjectDiscovery onProjectClick={navigateToProject} searchTerm={searchTerm} />;
      case 'detail': return selectedProject ? <ProjectDetail project={selectedProject} onPublish={publishInsight} /> : <ProjectDiscovery onProjectClick={navigateToProject} searchTerm={searchTerm} />;
      case 'admin': return <AdminModeration />;
      case 'analysis': return <AIPowerLab onPublish={publishInsight} />;
      case 'recommendations': return <Recommendations />;
      case 'education': return <Education />;
      case 'contact': return <Contact setView={setCurrentView} />;
      default: return <Home setView={setCurrentView} news={newsFeed} />;
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
        onLogout={() => { setUser(null); setCurrentView('home'); }}
      />
      
      <main className={`flex-1 w-full ${['home', 'dashboard', 'contact'].includes(currentView) ? '' : 'max-w-[1440px] mx-auto px-4 md:px-10 py-10'}`}>
        {renderView()}
      </main>

      {user && currentView !== 'login' && (
        <>
          <FloatingChatbot />
          <LiveAssistant />
        </>
      )}

      <footer className="bg-white dark:bg-earth-card border-t border-stone-200 dark:border-stone-800 py-12">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <span className="font-extrabold text-xl dark:text-white tracking-tighter uppercase">CONECTARAPAK</span>
          </div>
          <p className="text-stone-400 text-xs font-medium">© 2024 CONECTARAPAK Inc. Inteligencia Regional Sostenible.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
