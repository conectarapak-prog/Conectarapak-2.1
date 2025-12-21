
import React from 'react';
import { AISimulator } from '../components/AISimulator';
import { UserRole, View } from '../types';

interface DashboardProps {
  setView: (v: View) => void;
  userRole?: UserRole;
  userName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ setView, userRole, userName }) => {
  const tools = [
    { name: 'Power Lab IA', icon: 'auto_awesome', atmosphere: 'intel', action: () => setView('analysis'), desc: 'Generación de activos circulares con Gemini 3.' },
    { name: 'Strategy Hub', icon: 'psychology', atmosphere: 'intel', action: () => setView('recommendations'), desc: 'Marcos estratégicos e investigación territorial.' },
    { name: 'Red de Impacto', icon: 'hub', atmosphere: 'primary', action: () => setView('discovery'), desc: 'Explora nodos y conexiones regionales.' }
  ];

  const getAtmosphereClass = (atm: string) => {
    switch(atm) {
      case 'intel': return 'bg-intel/10 text-intel border-intel/20 hover:bg-intel hover:text-white';
      case 'primary': return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white';
      default: return 'bg-stone-100 text-stone-400';
    }
  };

  return (
    <div className="animate-fade-in space-y-12 py-10 px-8 max-w-[1440px] mx-auto">
      
      {/* Header Pro con Aura Semántica */}
      <section className="bg-white dark:bg-earth-card p-12 rounded-[4rem] border border-stone-100 dark:border-stone-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-12 group overflow-hidden relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
        <div className="relative z-10 flex items-center gap-10">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="size-48 rounded-[3rem] border-8 border-white dark:border-stone-800 shadow-2xl bg-stone-50" alt="Avatar" />
          <div className="space-y-3">
             <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.6em]">Terminal de Gestión</h2>
             <h1 className="text-6xl font-black dark:text-white uppercase tracking-tighter leading-none">
               {userName?.split(' ')[0]} <br/><span className="text-stone-300 italic">{userName?.split(' ')[1] || 'REGIONAL'}</span>
             </h1>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-10 bg-stone-50 dark:bg-stone-900/40 p-10 rounded-[2.5rem] border border-stone-100 dark:border-stone-800">
          <div className="text-center">
            <p className="text-4xl font-black text-primary tracking-tighter">12.8<span className="text-lg">k</span></p>
            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Ahorro CO2</p>
          </div>
          <div className="text-center border-l border-stone-200 dark:border-stone-800 pl-10">
            <p className="text-4xl font-black text-intel tracking-tighter">07</p>
            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Activos IA</p>
          </div>
        </div>
      </section>

      {/* Grid de Herramientas por Atmósfera */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tools.map((tool, i) => (
          <div 
            key={i} 
            onClick={tool.action}
            className="group p-10 bg-white dark:bg-earth-card border border-stone-100 dark:border-stone-800 rounded-[3rem] hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col gap-8 active:scale-95"
          >
            <div className={`size-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${getAtmosphereClass(tool.atmosphere)} shadow-sm`}>
              <span className="material-symbols-outlined text-3xl">{tool.icon}</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{tool.name}</h4>
              <p className="text-sm text-stone-500 font-medium italic opacity-80 leading-relaxed pr-4">"{tool.desc}"</p>
            </div>
            <div className="pt-6 border-t border-stone-50 dark:border-stone-800 text-[9px] font-black uppercase tracking-widest text-stone-300 group-hover:text-primary transition-colors">
               Inicializar Módulo <span className="material-symbols-outlined text-sm align-middle">arrow_forward</span>
            </div>
          </div>
        ))}
      </section>

      {/* Simulador con Atmósfera de Inteligencia */}
      <section className="bg-intel/[0.03] p-16 rounded-[4rem] border border-intel/10">
        <div className="flex items-center gap-3 mb-12">
           <div className="size-3 rounded-full bg-intel animate-pulse"></div>
           <h3 className="text-[10px] font-black text-intel uppercase tracking-[0.6em]">Proyección Predictiva Gemini</h3>
        </div>
        <AISimulator role={userRole || 'entrepreneur'} />
      </section>

    </div>
  );
};
