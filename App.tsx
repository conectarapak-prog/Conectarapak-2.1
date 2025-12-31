
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
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>(MOCK_NEWS);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

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
    // Animación de salida suave
    const root = document.getElementById('root');
    if (root) root.style.opacity = '0';
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (view !== currentView) {
        setViewHistory(prev => [...prev, currentView]);
        setCurrentView(view);
      }
      if (root) root.style.opacity = '1';
    }, 400);
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

  const publishInsight = (insight: Partial<NewsItem>) => {
    const newItem: NewsItem = {
      id: Date.now(),
      title: insight.title || "Nuevo Insight",
      category: insight.category || "IA",
      tag: "Gemini",
      image: insight.image || "",
      date: new Date().toLocaleDateString(),
      excerpt: insight.excerpt || "",
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
      case 'detail': return selectedProject ? <ProjectDetail project={selectedProject} onPublish={publishInsight} /> : <Home setView={navigateTo} />;
      case 'admin': return <AdminModeration />;
      case 'analysis': return <AIPowerLab />;
      case 'recommendations': return <Recommendations />;
      case 'education': return <Education />;
      case 'edit': return user ? <EditProfile user={user} onUpdate={(u) => setUser(u)} onCancel={goBack} /> : <Home setView={navigateTo} />;
      case 'settings': return <SecuritySettings onBack={goBack} />;
      case 'contact': return <Contact setView={navigateTo} />;
      default: return <Home setView={navigateTo} />;
    }
  };

  if (hasApiKey === false) {
    return (
      <div className="fixed inset-0 z-[1000] bg-earth-dark flex items-center justify-center p-6 text-white overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] animate-pulse"></div>
        <div className="max-w-xl w-full bg-stone-950 p-20 rounded-[5rem] border border-white/10 shadow-3xl relative z-10 text-center space-y-16">
           <div className="size-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-primary/20">
              <span className="material-symbols-outlined text-5xl text-primary animate-float">vpn_key</span>
           </div>
           <div className="space-y-6">
              <h2 className="text-6xl font-black uppercase tracking-tighter dark:text-white leading-none font-display">Activar<br/><span className="text-primary italic">Protocolo</span></h2>
              <p className="text-stone-500 text-[11px] font-mono font-bold leading-relaxed uppercase tracking-[0.5em]">Se requiere autenticación de API para operaciones de alta fidelidad.</p>
           </div>
           <button onClick={handleOpenKeySelector} className="w-full h-24 bg-white text-stone-950 rounded-full font-mono font-black text-[12px] uppercase tracking-[0.5em] shadow-3xl hover:bg-primary hover:text-white transition-all active:scale-95">Sincronizar Nodo</button>
           <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block text-[9px] font-mono font-black uppercase tracking-[0.4em] text-stone-700 hover:text-primary transition-colors italic">Doc_Billing.sys</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent transition-opacity duration-500" id="root">
      <Navbar currentView={currentView} setView={navigateTo} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} onSearchChange={setSearchTerm} user={user} onLogout={() => setUser(null)} />
      
      <main className="flex-1 w-full flex flex-col items-center relative z-10 pt-32 px-10">
        {currentView !== 'home' && currentView !== 'login' && (
          <div className="fixed top-36 left-14 z-50">
            <button onClick={goBack} className="size-16 bg-stone-950/40 backdrop-blur-3xl border border-white/5 rounded-full shadow-3xl flex items-center justify-center hover:scale-110 hover:border-primary transition-all group">
              <span className="material-symbols-outlined text-stone-500 text-2xl group-hover:text-primary transition-colors">west</span>
            </button>
          </div>
        )}
        <div className="w-full">
          {renderView()}
        </div>
      </main>
      
      {user && currentView !== 'login' && <><FloatingChatbot /><LiveAssistant /></>}
      
      <footer className="py-40 px-14 border-t border-white/5 mt-60 bg-stone-950/10">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-end gap-20">
          <div className="space-y-8">
            <h2 className="text-5xl font-black dark:text-white tracking-tighter uppercase font-display fluid-title">CONECTARAPAK</h2>
            <p className="text-[10px] font-mono text-stone-600 uppercase tracking-[0.6em] leading-loose italic">
              infraestructura de datos circular integrada. <br/> tarapacá regional node v4.5.2_beta
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
             <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <div key={i} className="size-1.5 bg-stone-900 rounded-full"></div>)}
             </div>
             <p className="text-stone-800 text-[10px] font-mono font-black uppercase tracking-[0.4em]">© 2024 DESIGN_BY_NOSIGNER_PROTOCOL</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
