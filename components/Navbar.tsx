
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const VIEW_LABELS: Record<string, string> = {
  discovery: 'Explorar',
  recommendations: 'Recomendaciones',
  education: 'Educación',
  admin: 'Administración'
};

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, darkMode, toggleDarkMode }) => {
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
            {(['discovery', 'recommendations', 'education', 'admin'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`text-sm font-semibold transition-colors ${
                  currentView === v ? 'text-primary' : 'text-stone-500 dark:text-stone-400 hover:text-primary'
                }`}
              >
                {VIEW_LABELS[v] || v}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-stone-100 dark:bg-stone-800 rounded-full h-10 px-4 w-64 border border-transparent focus-within:border-primary/50 transition-all">
            <span className="material-symbols-outlined text-stone-400 text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Buscar proyectos..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full dark:text-white"
            />
          </div>

          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400"
          >
            <span className="material-symbols-outlined">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button 
            onClick={() => setView('analysis')}
            className="bg-accent hover:bg-accent-dark text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            Crear Proyecto
          </button>

          <div className="size-10 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden border-2 border-primary/50 cursor-pointer">
            <img src="https://picsum.photos/seed/user1/100/100" alt="Profile" />
          </div>
        </div>
      </div>
    </header>
  );
};
