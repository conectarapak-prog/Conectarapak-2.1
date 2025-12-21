
import React, { useState } from 'react';
import { AISimulator } from '../components/AISimulator';
import { UserRole, View } from '../types';

interface DashboardProps {
  setView: (v: View) => void;
  userRole?: UserRole;
  userName?: string;
}

const EntrepreneurJourney: React.FC<{ setView: (v: View) => void }> = ({ setView }) => {
  const [activeStepModal, setActiveStepModal] = useState<number | null>(null);

  const steps = [
    { 
      id: 1, 
      title: 'Acceso a la Red', 
      desc: 'Únete a la red de emprendedores circulares de la Región de Tarapacá.', 
      icon: 'groups', 
      color: 'border-primary/30 text-primary', 
      side: 'left',
      action: () => setActiveStepModal(1)
    },
    { 
      id: 2, 
      title: 'Estrategia Pro', 
      desc: 'Accede a herramientas avanzadas de ideación e informes técnicos con IA.', 
      icon: 'biotech', 
      color: 'border-accent/30 text-accent', 
      side: 'right',
      action: () => setView('recommendations')
    },
    { 
      id: 3, 
      title: 'Investigación', 
      desc: 'Utiliza nuestro arsenal de herramientas: VPC, Lean Canvas, PESTEL.', 
      icon: 'search', 
      color: 'border-primary/30 text-primary', 
      side: 'left',
      action: () => setView('analysis')
    },
    { 
      id: 4, 
      title: 'Lanzamiento', 
      desc: 'Presenta tu proyecto a inversores y la comunidad regional.', 
      icon: 'rocket_launch', 
      color: 'border-accent/30 text-accent', 
      side: 'right',
      action: () => setActiveStepModal(4)
    },
    { 
      id: 5, 
      title: 'Consolidación', 
      desc: 'Alcanza tus objetivos con el respaldo de nuestra plataforma.', 
      icon: 'trophy', 
      color: 'border-primary/30 text-primary', 
      side: 'left',
      action: () => setActiveStepModal(5)
    }
  ];

  return (
    <div className="py-16 md:py-24 space-y-16 md:space-y-20 animate-fade-in relative px-4">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-stone-900 dark:text-white font-display uppercase leading-tight">
          Camino del <span className="text-primary italic">Innovador</span>
        </h2>
        <p className="text-stone-500 font-medium text-base md:text-lg px-4">
          Un ecosistema diseñado para escalar proyectos de impacto circular.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Linea central refinada - Solo visible en Desktop */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-accent/40 to-primary/40 -translate-x-1/2 opacity-20 hidden md:block"></div>

        <div className="space-y-12 md:space-y-24">
          {steps.map((step) => (
            <div key={step.id} className={`flex flex-col md:flex-row items-center w-full relative ${step.side === 'left' ? 'md:flex-row-reverse' : ''}`}>
              <div className="hidden md:block md:w-1/2"></div>
              
              {/* Nodo Central */}
              <div className="size-12 md:size-16 rounded-full bg-white dark:bg-stone-900 border-4 border-stone-50 dark:border-stone-800 shadow-2xl flex items-center justify-center z-10 transition-transform hover:scale-110 mb-6 md:mb-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                 <div className={`size-full rounded-full border flex items-center justify-center ${step.color.split(' ')[0]}`}>
                    <span className={`text-xs md:text-sm font-black ${step.color.split(' ')[1]}`}>{step.id}</span>
                 </div>
              </div>

              <div className={`w-full md:w-1/2 md:px-16 z-20`}>
                <div 
                  onClick={step.action}
                  className="bg-white dark:bg-earth-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-stone-100 dark:border-stone-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 group cursor-pointer hover:-translate-y-2 text-center md:text-left"
                >
                  <div className={`size-14 md:size-16 rounded-2xl bg-stone-50 dark:bg-stone-900 flex items-center justify-center mb-6 md:mb-8 shadow-sm group-hover:bg-primary/5 transition-all mx-auto md:mx-0`}>
                    <span className={`material-symbols-outlined text-3xl md:text-4xl ${step.color.split(' ')[1]}`}>{step.icon}</span>
                  </div>
                  <h4 className={`text-2xl md:text-3xl font-black mb-3 md:mb-4 tracking-tighter uppercase ${step.color.split(' ')[1]}`}>{step.title}</h4>
                  <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 font-medium leading-relaxed italic pr-0 md:pr-6">{step.desc}</p>
                  
                  <div className="mt-8 md:mt-10 flex items-center justify-center md:justify-start gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 group-hover:text-primary transition-colors">
                    Desbloquear Fase <span className="material-symbols-outlined text-lg">arrow_right_alt</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeStepModal && (
        <div className="fixed inset-0 z-[500] bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in" onClick={() => setActiveStepModal(null)}>
           <div className="max-w-lg w-full bg-white dark:bg-stone-900 rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 text-center space-y-8 md:space-y-10 shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
              <div className="size-20 md:size-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
                 <span className="material-symbols-outlined text-5xl md:text-6xl">verified</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-black dark:text-white tracking-tighter uppercase">Hito Alcanzado</h3>
                <p className="text-stone-500 dark:text-stone-400 font-medium leading-relaxed text-sm md:text-base px-2">Este módulo de gestión territorial se encuentra activo y sincronizado con tu perfil de impacto.</p>
              </div>
              <button onClick={() => setActiveStepModal(null)} className="w-full py-5 md:py-6 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-2xl md:rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-transform">Confirmar Lectura</button>
           </div>
        </div>
      )}
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ setView, userRole, userName }) => {
  const getRoleTools = () => {
    switch (userRole) {
      case 'entrepreneur':
        return [
          { name: 'Power Lab IA', icon: 'auto_awesome', action: () => setView('analysis'), desc: 'Diseño y generación de activos circulares con Gemini.' },
          { name: 'Strategy Hub', icon: 'psychology', action: () => setView('recommendations'), desc: 'Marcos estratégicos e investigación territorial.' },
          { name: 'Audit Monitor', icon: 'travel_explore', action: () => setView('discovery'), desc: 'Análisis comparativo con datos regionales.' }
        ];
      case 'investor_natural':
      case 'investor_legal':
        return [
          { name: 'Discovery Feed', icon: 'storefront', action: () => setView('discovery'), desc: 'Explora oportunidades de inversión circular.' },
          { name: 'Portfolio IA', icon: 'query_stats', action: () => setView('recommendations'), desc: 'Optimización de activos sostenibles.' }
        ];
      case 'advisor':
        return [
          { name: 'Control Room', icon: 'gavel', action: () => setView('admin'), desc: 'Auditoría de reportes de integridad.' },
          { name: 'Vocal Assistant', icon: 'record_voice_over', action: () => {}, desc: 'Atención técnica por voz en tiempo real.' }
        ];
      default: return [];
    }
  };

  const tools = getRoleTools();

  return (
    <div className="animate-fade-in space-y-12 md:space-y-16 py-8 md:py-12 px-4 md:px-8 pb-32 max-w-[1440px] mx-auto">
      
      {/* Perfil de Usuario Premium - Centrado en Móvil */}
      <section className="bg-white dark:bg-earth-card p-10 md:p-16 rounded-[3.5rem] md:rounded-[5rem] border border-stone-100 dark:border-stone-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-16 group">
        <div className="absolute -top-20 -left-20 size-96 bg-primary/5 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-[4s] hidden md:block"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-14 text-center md:text-left">
          <div className="relative shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="size-44 md:size-56 rounded-[3rem] md:rounded-[4rem] border-6 md:border-8 border-white dark:border-stone-800 shadow-2xl bg-stone-50 transition-all duration-700 group-hover:rotate-3" alt="Avatar" />
            <div className="absolute -bottom-2 -right-2 bg-primary text-white size-10 md:size-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white dark:border-earth-card">
               <span className="material-symbols-outlined text-xl md:text-2xl">verified</span>
            </div>
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="text-[10px] md:text-[11px] font-black text-primary uppercase tracking-[0.5em] leading-none">Intelligence Terminal</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black dark:text-white tracking-tighter leading-[0.9] uppercase font-display">
              {userName?.split(' ')[0] || 'INNOVADOR'} <br/><span className="text-accent italic">{userName?.split(' ')[1] || 'REGIONAL'}</span>
            </h1>
            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
               <span className="px-6 py-2 bg-stone-100 dark:bg-stone-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400 border border-stone-200 dark:border-stone-800 whitespace-nowrap">{userRole?.replace('_', ' ')}</span>
               <span className="px-6 py-2 bg-primary/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 whitespace-nowrap">Verified Identity</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 md:gap-16 bg-stone-50/50 dark:bg-stone-950/40 p-10 md:p-16 rounded-[3rem] md:rounded-[4.5rem] border border-stone-100 dark:border-stone-800 shadow-inner w-full lg:w-auto">
          <div className="text-center space-y-2 md:space-y-3">
            <p className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter leading-none">2.4<span className="text-primary">k</span></p>
            <p className="text-[9px] md:text-[11px] font-black text-stone-400 uppercase tracking-[0.3em]">Impacto CO2</p>
          </div>
          <div className="text-center space-y-2 md:space-y-3 border-l border-stone-200 dark:border-stone-800 pl-8 md:pl-16">
            <p className="text-4xl md:text-6xl font-black text-accent tracking-tighter leading-none">05</p>
            <p className="text-[9px] md:text-[11px] font-black text-stone-400 uppercase tracking-[0.3em]">Activos IA</p>
          </div>
        </div>
      </section>

      {/* Grid de Herramientas Estándar - Centrado Resiliente */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
        {tools.map((tool, i) => (
          <div 
            key={i} 
            onClick={tool.action}
            className="group p-10 md:p-14 bg-white dark:bg-earth-card border border-stone-100 dark:border-stone-800 rounded-[3rem] md:rounded-[4rem] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 cursor-pointer flex flex-col gap-6 md:gap-10 active:scale-95 text-center md:text-left"
          >
            <div className="size-16 md:size-20 bg-stone-50 dark:bg-stone-900 text-stone-400 rounded-2xl md:rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-sm mx-auto md:mx-0">
              <span className="material-symbols-outlined text-4xl md:text-5xl">{tool.icon}</span>
            </div>
            <div className="space-y-3 md:space-y-5">
              <h4 className="text-2xl md:text-3xl font-bold dark:text-white tracking-tighter uppercase leading-none">{tool.name}</h4>
              <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 font-medium leading-relaxed italic md:pr-6 opacity-80 line-clamp-2 md:line-clamp-none">"{tool.desc}"</p>
            </div>
            <div className="mt-4 md:mt-6 pt-6 border-t border-stone-50 dark:border-stone-800 text-primary font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-4 group-hover:gap-6 transition-all">
               Initialize System <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </div>
          </div>
        ))}
      </section>

      {userRole === 'entrepreneur' && <EntrepreneurJourney setView={setView} />}

      {userRole && (
        <section className="bg-stone-50 dark:bg-stone-900/40 p-10 md:p-20 rounded-[3.5rem] md:rounded-[6rem] border border-stone-200 dark:border-stone-800 shadow-inner">
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-10 text-center md:text-left">
            <div className="space-y-4 md:space-y-6">
               <h3 className="text-[11px] md:text-[12px] font-black text-primary uppercase tracking-[0.6em] ml-0 md:ml-1">Ecosystem Projections</h3>
               <h4 className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter uppercase leading-tight md:leading-[0.85]">
                  Simulator <br className="hidden md:block"/>
                  <span className="text-accent italic">Scalability</span>
               </h4>
            </div>
            <div className="flex items-center gap-4 px-6 md:px-8 py-3 md:py-4 bg-white dark:bg-earth-card rounded-2xl md:rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800">
               <div className="size-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Deep Reasoning Active</span>
            </div>
          </div>
          <AISimulator role={userRole} />
        </section>
      )}

      <style>{`
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};
