
import React, { useState, useEffect } from 'react';
import { generateFullConvergenceReport } from '../services/geminiService';

export const Recommendations: React.FC = () => {
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFullProcess = async () => {
    if (!context.trim() || loading) return;
    setLoading(true);
    setResult(null);
    const convergenceReport = await generateFullConvergenceReport(context);
    setResult(convergenceReport);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-fade-in h-[calc(100vh-180px)] overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full gap-6">
        
        {/* INPUT PANE */}
        <div className="lg:w-1/3 flex flex-col gap-6">
           <div className="bg-white dark:bg-stone-950 p-8 rounded-[3rem] border nosigner-card flex-1 flex flex-col gap-6">
              <div className="space-y-2">
                 <p className="text-[9px] font-mono font-black text-primary uppercase tracking-[0.4em]">Strategy.Input_Module</p>
                 <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase leading-none font-display">Convergencia</h2>
              </div>
              <textarea 
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Describa el desafío regional para el análisis PESTEL/VPC..."
                className="flex-1 bg-stone-50 dark:bg-stone-900 border-none rounded-[1.5rem] p-6 text-xs font-mono font-bold dark:text-white outline-none focus:ring-1 focus:ring-primary resize-none shadow-inner"
              />
              <button 
                onClick={handleFullProcess}
                disabled={loading || !context.trim()}
                className="h-16 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-2xl font-mono font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all disabled:opacity-30"
              >
                {loading ? 'Sincronizando...' : 'Ejecutar Nodo IA'}
              </button>
           </div>
        </div>

        {/* OUTPUT TERMINAL PANE */}
        <div className="lg:w-2/3 bg-white dark:bg-stone-950 rounded-[3rem] border nosigner-card flex flex-col overflow-hidden shadow-2xl">
           <div className="bg-stone-50 dark:bg-stone-900 p-6 border-b nosigner-card flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className={`size-2 rounded-full ${result ? 'bg-primary' : 'bg-stone-200'} animate-pulse`}></div>
                 <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-[0.4em]">Terminal.Output_v4.2</span>
              </div>
              {result && <span className="text-[8px] font-mono font-bold text-primary uppercase tracking-widest border border-primary/20 px-3 py-1 rounded-lg">Verified.sys</span>}
           </div>
           
           <div className="flex-1 overflow-y-auto p-10 custom-scrollbar grid-technical">
              {!result && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-[0.05] grayscale select-none">
                  <span className="material-symbols-outlined text-[100px]">terminal</span>
                  <p className="text-2xl font-black uppercase tracking-[0.5em] mt-4">Standby</p>
                </div>
              )}
              {loading && (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                   <div className="size-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-[9px] font-mono font-black text-stone-400 animate-pulse uppercase tracking-[0.3em]">Calculando Sinergias Territoriales...</p>
                </div>
              )}
              {result && (
                <div className="space-y-8 prose dark:prose-invert max-w-none text-xs md:text-sm font-mono leading-relaxed">
                   {result.split('\n').map((line, i) => (
                     <p key={i} className={line.startsWith('###') ? 'text-primary font-black uppercase text-base border-b nosigner-card pb-2 mt-8' : ''}>
                       {line.replace(/###/g, '')}
                     </p>
                   ))}
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};
