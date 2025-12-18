
import React from 'react';
import { View, User } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onSearchChange: (query: string) => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, darkMode, toggleDarkMode, onSearchChange, user, onLogout }) => {
  const getNavItems = () => {
    const base = [
      { id: 'home', label: 'Inicio' },
      { id: 'discovery', label: 'Explorar' }
    ];

    if (!user) return base;

    switch (user.role) {
      case 'entrepreneur':
        return [...base, { id: 'analysis', label: 'Mis Proyectos' }, { id: 'education', label: 'Academia' }];
      case 'investor_natural':
      case 'investor_legal':
        return [...base, { id: 'recommendations', label: 'Asesoría Inversión' }, { id: 'discovery', label: 'Portafolio' }];
      case 'advisor':
        return [...base, { id: 'admin', label: 'Moderación' }, { id: 'education', label: 'Mentorías' }];
      default:
        return base;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-earth-card/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-sm px-6 lg:px-10 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setView('home')}
          >
            <div className="size-8 text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl font-bold">recycling</span>
            </div>
            <h1 className="text-lg font-extrabold tracking-tighter hidden sm:block dark:text-white uppercase font-display">
              CONECTARAPAK
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            {getNavItems().map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id as View)}
                className={`text-[10px] uppercase tracking-widest font-black transition-colors ${
                  currentView === v.id ? 'text-primary' : 'text-stone-500 dark:text-stone-400 hover:text-primary'
                }`}
              >
                {v.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {currentView === 'discovery' && (
            <div className="hidden lg:flex items-center bg-stone-100 dark:bg-stone-800 rounded-full h-10 px-4 w-64 border border-transparent focus-within:border-primary/50 transition-all">
              <span className="material-symbols-outlined text-stone-400 text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Buscar proyectos..." 
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm w-full dark:text-white placeholder:text-stone-400"
              />
            </div>
          )}

          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400"
          >
            <span className="material-symbols-outlined">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-stone-200 dark:border-stone-800">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black dark:text-white leading-none uppercase">{user.name}</p>
                <p className="text-[9px] text-primary font-bold uppercase tracking-tighter">{user.role.replace('_', ' ')}</p>
              </div>
              <div className="relative group cursor-pointer" onClick={onLogout}>
                <img src={user.avatar} className="size-10 rounded-2xl border-2 border-primary/20 object-cover" alt="Profile" />
                <div className="absolute inset-0 bg-red-500/80 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="material-symbols-outlined text-white text-xl">logout</span>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setView('login')}
              className="bg-primary text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              Ingresar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
