
import React from 'react';
import { AISimulator } from '../components/AISimulator';
import { UserRole, View } from '../types';

interface DashboardProps {
  setView: (view: View) => void;
  userRole?: UserRole;
  userName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ setView, userRole, userName }) => {
  const getToolsByRole = (role: UserRole | undefined) => {
    const baseTools = [
      { name: 'Red de Impacto', icon: 'hub', atmosphere: 'primary', action: () => setView('discovery'), desc: 'Explora nodos y conexiones regionales.' }
    ];

    switch (role) {
      case 'entrepreneur':
        return [
          { name: 'Power Lab IA', icon: 'auto_awesome', atmosphere: 'intel', action: () => setView('analysis'), desc: 'Optimiza tus activos con Gemini Pro.' },
          { name: 'Strategy Hub', icon: 'psychology', atmosphere: 'intel', action: () => setView('recommendations'), desc: 'Investigación territorial profunda.' },
          ...baseTools
        ];
      case 'investor_natural':
      case 'investor_legal':
        return [
          { name: 'Auditoría ESG', icon: 'verified', atmosphere: 'intel', action: () => setView('discovery'), desc: 'Valida la integridad de tus inversiones.' },
          { name: 'Reportes Impacto', icon: 'analytics', atmosphere: 'intel', action: () => setView('recommendations'), desc: 'Visualiza el retorno social y económico.' },
          ...baseTools
        ];
      case 'advisor':
        return [
          { name: 'Módulo Mentoría', icon: 'school', atmosphere: 'intel', action: () => setView('education'), desc: 'Gestiona tus lecciones y mentorías.' },
          { name: 'Auditoría Social', icon: 'gavel', atmosphere: 'intel', action: () => setView('admin'), desc: 'Control de cumplimiento y ética regional.' },
          ...baseTools
        ];
      default:
        return baseTools;
    }
  };

  const getStatsByRole = (role: UserRole | undefined) => {
    switch (role) {
      case 'entrepreneur':
        return { val1: '12.8k', label1: 'Ahorro CO2', val2: '07', label2: 'Activos IA', color: 'text-primary' };
      case 'investor_legal':
        return { val1: '$12.5M', label1: 'Capital ESG', val2: '9.8', label2: 'Score Riesgo', color: 'text-indigo-600' };
      case 'advisor':
        return { val1: '42h', label1: 'Mentoría', val2: '125', label2: 'Estudiantes', color: 'text-amber-600' };
      default:
        return { val1: '840', label1: 'Impacto', val2: '12', label2: 'Nodos', color: 'text-primary' };
    }
  };

  const tools = getToolsByRole(userRole);
  const stats = getStatsByRole(userRole);

  const getAtmosphereClass = (atm: string) => {
    switch(atm) {
      case 'intel': return 'bg-intel/10 text-intel border-intel/20 hover:bg-intel hover:text-white';
      case 'primary': return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white';
      default: return 'bg-stone-100 text-stone-400';
    }
  };

  return (
    <div className="animate-fade-in space-y-12 py-10 px-4 md:px-8 max-w-[1440px] mx-auto">
      
      {/* Header Pro Adaptativo */}
      <section className="bg-white dark:bg-earth-card p-10 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-10 overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-2 h-full ${stats.color.replace('text-', 'bg-')}`}></div>
        <div className="relative z-10 flex items-center gap-8">
          <div className="relative group cursor-pointer" onClick={() => setView('edit')}>
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} className="size-32 md:size-40 rounded-[2.5rem] border-4 border-white dark:border-stone-800 shadow-xl bg-stone-50 group-hover:opacity-80 transition-opacity" alt="Avatar" />
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl">edit</span>
             </div>
          </div>
          <div className="space-y-2">
             <h2 className={`text-[9px] font-black uppercase tracking-[0.6em] ${stats.color}`}>{userRole?.replace('_', ' ')}</h2>
             <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase tracking-tighter leading-none">
               {userName?.split(' ')[0]} <span className="text-stone-300 italic">{userName?.split(' ')[1] || 'REGIONAL'}</span>
             </h1>
             <div className="flex gap-4 pt-2">
                <button onClick={() => setView('edit')} className="text-[8px] font-black uppercase tracking-widest text-stone-400 hover:text-primary transition-colors flex items-center gap-1">
                   <span className="material-symbols-outlined text-xs">settings_account_box</span> Perfil
                </button>
                <button onClick={() => setView('settings')} className="text-[8px] font-black uppercase tracking-widest text-stone-400 hover:text-primary transition-colors flex items-center gap-1">
                   <span className="material-symbols-outlined text-xs">lock</span> Seguridad
                </button>
             </div>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-8 bg-stone-50 dark:bg-stone-900/40 p-8 rounded-[2rem] border border-stone-100 dark:border-stone-800 min-w-[250px]">
          <div className="text-center">
            <p className={`text-3xl font-black tracking-tighter ${stats.color}`}>{stats.val1}</p>
            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">{stats.label1}</p>
          </div>
          <div className="text-center border-l border-stone-200 dark:border-stone-800 pl-8">
            <p className={`text-3xl font-black tracking-tighter ${stats.color}`}>{stats.val2}</p>
            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">{stats.label2}</p>
          </div>
        </div>
      </section>

      {/* Grid de Herramientas Especializadas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, i) => (
          <div 
            key={i} 
            onClick={tool.action}
            className="group p-8 bg-white dark:bg-earth-card border border-stone-100 dark:border-stone-800 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col gap-6 active:scale-95"
          >
            <div className={`size-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${getAtmosphereClass(tool.atmosphere)} shadow-sm`}>
              <span className="material-symbols-outlined text-2xl">{tool.icon}</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter">{tool.name}</h4>
              <p className="text-xs text-stone-500 font-medium italic leading-relaxed opacity-70">"{tool.desc}"</p>
            </div>
            <div className={`pt-4 border-t border-stone-50 dark:border-stone-800 text-[8px] font-black uppercase tracking-widest transition-colors ${stats.color}`}>
               Inicializar Módulo <span className="material-symbols-outlined text-xs align-middle">arrow_forward</span>
            </div>
          </div>
        ))}
      </section>

      {/* Simulador Adaptativo */}
      <section className="bg-stone-50/50 dark:bg-stone-900/10 p-10 rounded-[3.5rem] border border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3 mb-10">
           <div className={`size-2.5 rounded-full animate-pulse ${stats.color.replace('text-', 'bg-')}`}></div>
           <h3 className={`text-[9px] font-black uppercase tracking-[0.6em] ${stats.color}`}>Proyección Predictiva Gemini Pro</h3>
        </div>
        <AISimulator role={userRole || 'entrepreneur'} />
      </section>

    </div>
  );
};
