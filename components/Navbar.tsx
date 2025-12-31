
import React, { useState } from 'react';
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
  <svg viewBox="0 0 100 100" className="size-6 fill-none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="white" strokeWidth="2.5"/>
    <rect x="38" y="38" width="24" height="24" className="fill-primary" />
    <circle cx="50" cy="50" r="10" className="stroke-primary fill-none animate-pulse" strokeWidth="1" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user }) => {
  const navLinks: { label: string, view: View }[] = [
    { label: 'Network', view: 'home' },
    { label: 'Feed', view: 'feed' },
    { label: 'Discovery', view: 'discovery' },
    { label: 'Dashboard', view: 'dashboard' },
  ];

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-7xl">
      <div className="bg-stone-950/80 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
            <LogoIcon />
            <h1 className="text-[10px] font-mono font-black tracking-[0.5em] text-white uppercase group-hover:text-primary transition-colors">
              CONECTARAPAK
            </h1>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => setView(link.view)}
                className={`text-[9px] font-mono font-black uppercase tracking-[0.2em] transition-all relative py-1 ${
                  currentView === link.view ? 'text-primary' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                {link.label}
                {currentView === link.view && <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-primary glow-primary"></span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-[8px] font-mono font-bold text-stone-600 uppercase tracking-widest">
            <span>Server.Status</span>
            <span className="size-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#76C94F]"></span>
          </div>

          {user ? (
            <div className="flex items-center gap-4 border-l border-white/5 pl-6">
               <div className="text-right hidden sm:block">
                  <p className="text-[8px] font-mono font-black text-white leading-none uppercase">{user.name.split(' ')[0]}</p>
                  <p className="text-[7px] font-mono font-bold text-primary uppercase mt-1">Verified.Node</p>
               </div>
               <button onClick={() => setView('edit')} className="size-9 rounded-full overflow-hidden border border-white/10 hover:border-primary transition-colors">
                  <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
               </button>
            </div>
          ) : (
            <button onClick={() => setView('login')} className="bg-white text-stone-950 px-8 py-2 rounded-full text-[9px] font-mono font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              Sincronizar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
