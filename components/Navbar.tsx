
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

const LogoIcon = () => (
  <svg viewBox="0 0 100 100" className="size-10 fill-none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="white" className="dark:fill-stone-800" stroke="#599E39" strokeWidth="2"/>
    <path d="M20 70 L40 45 L55 60 L75 35 L85 70 Z" fill="#437A28"/>
    <path d="M15 75 L35 55 L50 68 L70 45 L85 75 Z" fill="#599E39" opacity="0.8"/>
    <circle cx="50" cy="30" r="12" fill="#F59E0B"/>
    <g stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round">
      <line x1="50" y1="12" x2="50" y2="16"/>
      <line x1="50" y1="44" x2="50" y2="48"/>
      <line x1="68" y1="30" x2="72" y2="30"/>
      <line x1="28" y1="30" x2="32" y2="30"/>
      <line x1="62.7" y1="17.3" x2="65.5" y2="20.1"/>
      <line x1="34.5" y1="39.9" x2="37.3" y2="42.7"/>
      <line x1="65.5" y1="39.9" x2="62.7" y2="42.7"/>
      <line x1="37.3" y1="20.1" x2="34.5" y2="17.3"/>
    </g>
    <path d="M30 80 Q50 95 70 80" stroke="#599E39" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, darkMode, toggleDarkMode, user, onLogout }) => {
  const navLinks: { label: string, view: View }[] = [
    { label: 'Inicio', view: 'home' },
    { label: 'Feed Comunitario', view: 'feed' },
    { label: 'Explorar', view: 'discovery' },
    { label: 'Panel', view: 'dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-earth-card/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-sm px-6 lg:px-10 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setView('home')}
          >
            <div className="group-hover:scale-110 transition-transform duration-300">
              <LogoIcon />
            </div>
            <h1 className="text-xl font-black tracking-tighter hidden sm:block dark:text-white uppercase font-display text-stone-800">
              CONECTARAPAK
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => setView(link.view)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${
                  currentView === link.view ? 'text-primary' : 'text-stone-400'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
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
              className="bg-primary text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
            >
              Ingresar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
