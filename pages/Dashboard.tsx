
import React from 'react';
import { AISimulator } from '../components/AISimulator';
import { InvestmentSimulator } from '../components/InvestmentSimulator';
import { UserRole, View } from '../types';

interface DashboardProps {
  setView: (view: View) => void;
  userRole?: UserRole;
  userName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ setView, userRole, userName }) => {
  const isInvestor = userRole === 'investor_natural' || userRole === 'investor_legal';

  const tools = [
    { name: 'AI Power Lab', icon: 'auto_awesome', action: () => setView('analysis'), desc: 'Assets.sys', id: '01' },
    { name: 'Strategy Hub', icon: 'psychology', action: () => setView('recommendations'), desc: 'Logic.bin', id: '02' },
    { name: 'Network Map', icon: 'hub', action: () => setView('discovery'), desc: 'Nodes.map', id: '03' },
    { name: 'Security', icon: 'shield', action: () => setView('settings'), desc: 'Secure.crt', id: '04' },
  ];

  return (
    <div className="w-full space-y-16 py-12 animate-fade-in max-w-7xl mx-auto px-6">
      
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-stone-950 p-14 rounded-[4rem] border border-white/10 flex flex-col justify-between displacement shadow-2xl relative overflow-hidden" style={{"--depth": "-0.05"} as any}>
          <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-[100px]"></div>
          
          <div className="space-y-6 relative z-10">
            <p className="text-[11px] font-mono font-black text-primary uppercase tracking-[0.8em]">System.Node_Active</p>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase font-display">
              {userName?.split(' ')[0]} <span className="text-stone-800 italic">HUB</span>
            </h1>
          </div>
          
          <div className="flex gap-6 pt-12 relative z-10">
             <div className="px-10 py-5 bg-stone-900/50 rounded-3xl border border-white/5 backdrop-blur-md">
                <p className="text-[9px] font-mono font-black text-stone-500 uppercase mb-2 tracking-widest">Global_Impact</p>
                <p className="text-4xl font-black text-white leading-none">94.2<span className="text-primary text-xl ml-1">%</span></p>
             </div>
             <div className="px-10 py-5 bg-stone-900/50 rounded-3xl border border-white/5 backdrop-blur-md">
                <p className="text-[9px] font-mono font-black text-stone-500 uppercase mb-2 tracking-widest">Network_Sync</p>
                <p className="text-4xl font-black text-white leading-none">8.15</p>
             </div>
          </div>
        </div>
        
        <div className="lg:col-span-5 grid grid-cols-2 gap-6">
           {tools.map(tool => (
             <button key={tool.id} onClick={tool.action} className="bg-stone-950 p-8 rounded-[3rem] border border-white/10 hover:border-primary transition-all text-left flex flex-col justify-between group shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start relative z-10">
                  <span className="material-symbols-outlined text-stone-700 group-hover:text-primary group-hover:scale-110 transition-all text-3xl">{tool.icon}</span>
                  <span className="text-[10px] font-mono font-black text-stone-800 uppercase tracking-widest group-hover:text-stone-600 transition-colors">{tool.id}</span>
                </div>
                <div className="relative z-10">
                   <h4 className="text-md font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">{tool.name}</h4>
                   <p className="text-[9px] font-mono text-stone-500 uppercase tracking-[0.3em] mt-1">{tool.desc}</p>
                </div>
             </button>
           ))}
        </div>
      </section>

      <section className="bg-stone-900/30 p-12 rounded-[5rem] border border-white/5 grid-technical overflow-hidden relative shadow-inner">
        <div className="max-w-5xl mx-auto">
          {isInvestor ? <InvestmentSimulator /> : <AISimulator role={userRole || 'entrepreneur'} />}
        </div>
      </section>

    </div>
  );
};
