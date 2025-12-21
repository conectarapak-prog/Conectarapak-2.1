
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { analyzeInvestmentImpact } from '../services/geminiService';

export const InvestmentSimulator: React.FC = () => {
  const MIN_SIM = 5000;
  const MAX_SIM = 250000;
  
  const [selectedProjectId, setSelectedProjectId] = useState(MOCK_PROJECTS[0].id);
  const [investmentAmount, setInvestmentAmount] = useState(MIN_SIM);
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const selectedProject = useMemo(() => 
    MOCK_PROJECTS.find(p => p.id === selectedProjectId) || MOCK_PROJECTS[0]
  , [selectedProjectId]);

  useEffect(() => {
    setInvestmentAmount(MIN_SIM);
    setAiReport(null);
  }, [selectedProjectId]);

  const stats = useMemo(() => {
    const p = (investmentAmount / selectedProject.goal) * 100;
    
    // Proyecciones de Impacto Refinadas
    const co2Avoided = (investmentAmount * 0.00085).toFixed(2);
    const jobsCreated = (investmentAmount / 50000).toFixed(1); 
    const efficiency = (92 + (investmentAmount / MAX_SIM) * 6).toFixed(1);

    let tier = "Micro-Ticket";
    let color = "text-stone-400";
    if (investmentAmount > 200000) { tier = "Strategic Angel"; color = "text-primary"; }
    else if (investmentAmount > 100000) { tier = "Core Supporter"; color = "text-indigo-500"; }
    else if (investmentAmount > 25000) { tier = "Active Booster"; color = "text-blue-500"; }

    return { 
      percentage: p.toFixed(2), 
      co2: co2Avoided, 
      jobs: jobsCreated, 
      efficiency, 
      tier,
      color
    };
  }, [investmentAmount, selectedProject]);

  const handleSimulate = async () => {
    setLoading(true);
    const report = await analyzeInvestmentImpact(
      selectedProject.title, 
      investmentAmount, 
      parseFloat(stats.percentage)
    );
    setAiReport(report);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-earth-card rounded-[2.5rem] border border-stone-100 dark:border-stone-800 p-8 md:p-10 shadow-xl overflow-hidden relative">
        
        {/* Glow dinámico suavizado */}
        <div 
          className="absolute top-0 right-0 p-32 -mr-16 -mt-16 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 opacity-[0.15]"
          style={{ backgroundColor: investmentAmount > 150000 ? '#599E39' : '#1E40AF' }}
        ></div>
        
        {/* Header Compacto */}
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-6 border-b border-stone-50 dark:border-stone-800">
           <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <span className={`size-1.5 rounded-full ${investmentAmount > MIN_SIM ? 'bg-primary animate-pulse' : 'bg-stone-300'}`}></span>
                 <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em]">Investment Protocol</p>
              </div>
              <h3 className="text-3xl font-black text-stone-900 dark:text-white tracking-tighter uppercase leading-none">
                Simulador de <span className="font-light italic text-stone-300">Impacto</span>
              </h3>
           </div>
           
           <div className="flex bg-stone-50 dark:bg-stone-900/60 p-1 rounded-xl border border-stone-100 dark:border-stone-800 overflow-x-auto no-scrollbar max-w-full">
              {MOCK_PROJECTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    selectedProjectId === p.id 
                    ? 'bg-white dark:bg-stone-800 text-primary shadow-sm' 
                    : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {p.title.split(':')[0]}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Control Area - Spacing Optimized */}
           <div className="lg:col-span-7 space-y-10">
              
              <div className="space-y-6">
                 <div className="flex justify-between items-end px-1">
                    <div className="space-y-0.5">
                       <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Inyección Estimada</p>
                       <div className="flex items-baseline gap-1.5">
                         <span className="text-5xl font-black text-stone-900 dark:text-white tracking-tighter">
                           ${investmentAmount.toLocaleString('es-CL')}
                         </span>
                         <span className="text-[10px] font-bold text-stone-300 uppercase">CLP</span>
                       </div>
                    </div>
                    <div className="text-right space-y-0.5">
                       <p className={`text-[8px] font-black uppercase tracking-widest ${stats.color}`}>{stats.tier}</p>
                       <p className={`text-5xl font-black tracking-tighter ${stats.color}`}>
                        {stats.percentage}<span className="text-xl">%</span>
                       </p>
                    </div>
                 </div>

                 <div className="relative h-8 flex items-center group">
                    <input 
                       type="range"
                       min={MIN_SIM}
                       max={MAX_SIM}
                       step={1000}
                       value={investmentAmount}
                       onChange={(e) => setInvestmentAmount(parseInt(e.target.value))}
                       className="w-full h-1 bg-stone-100 dark:bg-stone-800 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <div 
                      className="absolute -top-3 text-[8px] font-black text-primary transition-all pointer-events-none opacity-0 group-hover:opacity-100"
                      style={{ left: `${((investmentAmount - MIN_SIM) / (MAX_SIM - MIN_SIM)) * 100}%` }}
                    >
                      LIQUIDITY_MARK
                    </div>
                 </div>

                 <div className="flex justify-between px-1 text-[8px] font-black text-stone-300 uppercase tracking-[0.2em]">
                    <span>Min: $5.000</span>
                    <span>Max Simulator: $250.000</span>
                 </div>
              </div>

              {/* Impact Metrics - Compact Grid */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-50 dark:border-stone-800">
                 {[
                   { label: 'CO2 Evitado', val: `${stats.co2} t`, icon: 'eco', color: 'text-emerald-500' },
                   { label: 'Participación', val: `+${stats.jobs}`, icon: 'hub', color: 'text-blue-500' },
                   { label: 'Eficiencia IA', val: `${stats.efficiency}%`, icon: 'bolt', color: 'text-amber-500' }
                 ].map((metric, i) => (
                   <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2">
                         <span className={`material-symbols-outlined text-sm ${metric.color}`}>{metric.icon}</span>
                         <p className="text-[8px] font-black uppercase tracking-widest text-stone-300">{metric.label}</p>
                      </div>
                      <p className="text-xl font-black text-stone-800 dark:text-white tracking-tighter">{metric.val}</p>
                   </div>
                 ))}
              </div>

              <button 
                onClick={handleSimulate}
                disabled={loading}
                className="w-full h-16 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-primary hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <span className="animate-spin material-symbols-outlined text-xl">sync</span> : <span className="material-symbols-outlined text-xl">biotech</span>}
                {loading ? 'Calculando...' : 'Ejecutar Auditoría de Impacto IA'}
              </button>
           </div>

           {/* AI Report - Spacing Optimized */}
           <div className="lg:col-span-5 flex flex-col h-full">
              <div className="flex-1 bg-stone-50 dark:bg-stone-900/40 rounded-[2rem] border border-stone-100 dark:border-stone-800 p-8 relative overflow-hidden flex flex-col">
                 
                 {aiReport ? (
                   <div className="space-y-6 animate-fade-in relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
                         <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">verified</span>
                            <div>
                               <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] leading-none">IA Report</h4>
                               <p className="text-[7px] font-bold text-stone-400 uppercase mt-0.5">Ref. {selectedProject.id}</p>
                            </div>
                         </div>
                      </div>

                      <div className="flex-1 overflow-y-auto no-scrollbar">
                         <div className="text-[11px] font-medium leading-[1.6] text-stone-600 dark:text-stone-400 italic">
                           {aiReport.split('\n').filter(l => l.trim()).map((line, i) => (
                             <p key={i} className="mb-2 last:mb-0">
                               {line.startsWith('**') ? <span className="text-stone-900 dark:text-white font-black">{line.replace(/\*\*/g, '')}</span> : line}
                             </p>
                           ))}
                         </div>
                      </div>
                      
                      <div className="pt-4 mt-auto border-t border-stone-100 dark:border-stone-800">
                         <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-xl border border-primary/10">
                            <span className="material-symbols-outlined text-primary text-xs">info</span>
                            <p className="text-[7px] font-black text-stone-500 uppercase leading-tight tracking-widest">
                               Auditoría predictiva basada en nodos regionales.
                            </p>
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20 py-10">
                      <span className="material-symbols-outlined text-6xl text-stone-300">query_stats</span>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-stone-400">Terminal Ready</p>
                        <p className="text-[10px] font-medium italic text-stone-500 max-w-[150px] mx-auto leading-tight">Configura el capital para análisis.</p>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
