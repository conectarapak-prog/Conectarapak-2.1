
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
import { CommunityFeed } from './pages/CommunityFeed';
import { EditProfile } from './pages/EditProfile';
import { SecuritySettings } from './pages/SecuritySettings';
import { FloatingChatbot } from './components/FloatingChatbot';
import { LiveAssistant } from './components/LiveAssistant';
import { View, Project, User, NewsItem } from './types';
import { MOCK_NEWS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [viewHistory, setViewHistory] = useState<View[]>(['home']);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>(MOCK_NEWS);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    checkApiKey();
  }, [darkMode]);

  const checkApiKey = async () => {
    // @ts-ignore
    const selected = await window.aistudio.hasSelectedApiKey();
    setHasApiKey(selected);
  };

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasApiKey(true);
  };

  const navigateTo = (view: View) => {
    if (view !== currentView) {
      setViewHistory(prev => [...prev, currentView]);
      setCurrentView(view);
    }
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setCurrentView(prev);
    }
  };

  const handleLogin = (newUser: User) => {
    setUser({ ...newUser, isVerified: true });
    navigateTo('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    navigateTo('dashboard');
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
      facts: insight.facts,
      interpretation: insight.interpretation,
      authorName: user?.name,
      authorAvatar: user?.avatar,
      isAI: true
    };
    setNewsFeed(prev => [newItem, ...prev]);
    navigateTo('feed');
  };

  const renderView = () => {
    if (currentView === 'login') return <Login onLogin={handleLogin} />;
    
    switch (currentView) {
      case 'home': return <Home setView={navigateTo} />;
      case 'feed': return <CommunityFeed news={newsFeed} onPublish={publishInsight} user={user} />;
      case 'dashboard': return <Dashboard setView={navigateTo} userRole={user?.role} userName={user?.name} />;
      case 'discovery': return <ProjectDiscovery setView={navigateTo} onProjectClick={(p) => { setSelectedProject(p); navigateTo('detail'); }} searchTerm={searchTerm} onPublish={publishInsight} />;
      case 'detail': return selectedProject ? <ProjectDetail project={selectedProject} onPublish={publishInsight} /> : <ProjectDiscovery setView={navigateTo} onProjectClick={(p) => { setSelectedProject(p); navigateTo('detail'); }} searchTerm={searchTerm} onPublish={publishInsight} />;
      case 'admin': return <AdminModeration />;
      case 'analysis': return <AIPowerLab onPublish={publishInsight} />;
      case 'recommendations': return <Recommendations />;
      case 'education': return <Education />;
      case 'edit': return user ? <EditProfile user={user} onUpdate={handleUpdateUser} onCancel={goBack} /> : <Home setView={navigateTo} />;
      case 'settings': return <SecuritySettings onBack={goBack} />;
      case 'contact': return <Contact setView={navigateTo} />;
      default: return <Home setView={navigateTo} />;
    }
  };

  if (hasApiKey === false) {
    return (
      <div className="fixed inset-0 z-[1000] bg-earth-surface flex items-center justify-center p-6 text-white">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
        <div className="max-w-xl w-full bg-white dark:bg-earth-card p-12 rounded-[3rem] border border-stone-200 dark:border-stone-800 shadow-2xl relative z-10 text-center space-y-8">
           <div className="size-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl text-primary">vpn_key</span>
           </div>
           <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Activar IA Pro</h2>
              <p className="text-stone-500 text-sm font-medium leading-relaxed">CONECTARAPAK requiere una Llave API de Google Cloud para procesos de alta precisión.</p>
           </div>
           <button onClick={handleOpenKeySelector} className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-4">Configurar Llave</button>
           <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-primary">Info. de Facturación</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 dark:bg-earth-dark transition-colors duration-300">
      <Navbar currentView={currentView} setView={navigateTo} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} onSearchChange={setSearchTerm} user={user} onLogout={() => { setUser(null); setCurrentView('home'); }} />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 md:py-12 flex flex-col items-center relative">
        
        {/* BACK PROTOCOL ICON - Posicionado estratégicamente */}
        {currentView !== 'home' && currentView !== 'login' && (
          <div className="absolute top-0 left-4 md:left-8 lg:left-12 z-40 animate-fade-in">
            <button 
              onClick={goBack}
              className="group flex items-center gap-3 bg-white/60 dark:bg-earth-card/60 backdrop-blur-md border border-stone-200/50 dark:border-stone-800/50 px-4 py-2 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500"
            >
              <div className="size-8 rounded-xl bg-white dark:bg-stone-900 flex items-center justify-center text-stone-400 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 group-hover:text-primary hidden md:block">Retroceder</span>
            </button>
          </div>
        )}

        <div className="w-full">
          {renderView()}
        </div>
      </main>
      
      {user && currentView !== 'login' && <><FloatingChatbot /><LiveAssistant /></>}
      
      <footer className="bg-white dark:bg-earth-card border-t border-stone-100 dark:border-stone-800 py-10">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}><span className="font-extrabold text-xl dark:text-white tracking-tighter uppercase">CONECTARAPAK</span></div>
          <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">© 2024 CONECTARAPAK • Inteligencia Regional Sostenible</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
