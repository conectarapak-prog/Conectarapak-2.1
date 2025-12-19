
import React, { useState } from 'react';
import { UserRole } from '../types';
import { generateProfileOptimization } from '../services/geminiService';

interface AISimulatorProps {
  role: UserRole;
}

export const AISimulator: React.FC<AISimulatorProps> = ({ role }) => {
  const [val1, setVal1] = useState(10000);
  const [val2, setVal2] = useState(30);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const getRoleConfig = () => {
    switch (role) {
      case 'entrepreneur':
        return {
          title: 'Simulador IA de Campaña',
          label1: 'Meta Financiera',
          label2: 'Duración',
          unit1: '$',
          unit2: 'Días',
          min1: 1000, max1: 100000,
          min2: 15, max2: 90
        };
      case 'investor_natural':
      case 'investor_legal':
        return {
          title: 'Simulador de Portafolio Circular',
          label1: 'Capital a Invertir',
          label2: 'N° de Proyectos',
          unit1: '$',
          unit2: 'Proyectos',
          min1: 5000, max1: 500000,
          min2: 1, max2: 20
        };
      case 'advisor':
        return {
          title: 'Simulador de Gestión de Mentoría',
          label1: 'Carga de Proyectos',
          label2: 'Horas / Semana',
          unit1: '',
          unit2: 'Horas',
          min1: 1, max1: 15,
          min2: 5, max2: 40
        };
      default:
        return {
          title: 'Simulador IA',
          label1: 'Parámetro A',
          label2: 'Parámetro B',
          unit1: '',
          unit2: '',
          min1: 0, max1: 100,
          min2: 0, max2: 100
        };
    }
  };

  const config = getRoleConfig();

  const handleOptimize = async () => {
    setLoading(true);
    const result = await generateProfileOptimization(role, { val1, val2 });
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-earth-card text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-24 -mr-20 -mt-20 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">{config.title}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-stone-400 uppercase tracking-widest">{config.label1}</span>
                <span className="text-xl font-black text-primary">
                  {config.unit1}{val1.toLocaleString()} {config.unit1 === '' && config.unit2 === 'Horas' ? '' : ''}
                </span>
              </div>
              <input 
                type="range" 
                // Fix: Access role from props instead of config object
                min={config.min1} max={config.max1} step={role === 'advisor' ? 1 : 1000}
                value={val1}
                onChange={(e) => setVal1(parseInt(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-full appearance-none cursor-pointer accent-primary" 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-stone-400 uppercase tracking-widest">{config.label2}</span>
                <span className="text-xl font-black text-primary">{val2} {config.unit2}</span>
              </div>
              <input 
                type="range" 
                min={config.min2} max={config.max2} step={1}
                value={val2}
                onChange={(e) => setVal2(parseInt(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-full appearance-none cursor-pointer accent-primary" 
              />
            </div>
          </div>

          <button 
            onClick={handleOptimize}
            disabled={loading}
            className="group w-full bg-primary hover:bg-primary-hover h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">sync</span>
            ) : (
              <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">auto_awesome</span>
            )}
            {loading ? 'Procesando con Gemini...' : 'Generar Optimización IA'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-white dark:bg-earth-card border-2 border-primary/20 p-8 rounded-[2.5rem] shadow-xl animate-fade-in relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
             <span className="material-symbols-outlined text-6xl text-primary">psychology</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Recomendaciones Gemini</h4>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-sm font-medium leading-relaxed text-stone-600 dark:text-stone-300 whitespace-pre-wrap">
                {feedback}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
