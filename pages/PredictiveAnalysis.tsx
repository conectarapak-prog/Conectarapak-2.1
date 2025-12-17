
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Ene', value: 40 },
  { name: 'Feb', value: 55 },
  { name: 'Mar', value: 45 },
  { name: 'Abr', value: 70 },
  { name: 'May', value: 85 },
  { name: 'Jun', value: 65 },
  { name: 'Jul', value: 90 },
  { name: 'Tu Proy.', value: 94 },
];

export const PredictiveAnalysis: React.FC = () => {
  const [goal, setGoal] = useState(10000);
  const [duration, setDuration] = useState(30);

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-200 dark:border-stone-800 pb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-widest">Borrador</span>
            <p className="text-stone-400 text-sm font-bold">Categoría: Tecnología Sostenible</p>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight dark:text-white">Análisis Predictivo</h2>
          <p className="text-stone-500 text-lg mt-1 font-medium">Evaluación predictiva para: EcoMochila Solar 2.0</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined">download</span> Exportar PDF
          </button>
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-105">
            Lanzar Campaña
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-earth-card p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Índice de Éxito</p>
              <p className="text-4xl font-extrabold text-primary">78<span className="text-lg text-stone-400">/100</span></p>
              <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '78%' }} />
              </div>
            </div>
            <div className="bg-white dark:bg-earth-card p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Recaudación Est.</p>
              <p className="text-2xl font-extrabold dark:text-white">$12,500 - $15k</p>
              <p className="text-[10px] font-bold text-green-500 mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Meta alcanzable
              </p>
            </div>
            <div className="bg-white dark:bg-earth-card p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Patrocinadores Est.</p>
              <p className="text-2xl font-extrabold dark:text-white">350 - 420</p>
              <p className="text-[10px] font-bold text-stone-400 mt-2">Ticket medio: $45</p>
            </div>
          </div>

          <div className="bg-white dark:bg-earth-card p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
            <h3 className="text-lg font-bold dark:text-white mb-6">Tendencia de Mercado</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-stone-900 text-white p-2 rounded text-xs font-bold">
                            {payload[0].value}% Probabilidad
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#599E39' : '#dce8d0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-earth-card text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl">tune</span>
            </div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Simulador IA
            </h3>
            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-stone-400">Meta Financiera</span>
                  <span className="text-primary">${goal.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="50000" 
                  step="1000" 
                  value={goal}
                  onChange={(e) => setGoal(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-stone-800 rounded-full appearance-none cursor-pointer accent-primary" 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-stone-400">Duración</span>
                  <span className="text-primary">{duration} Días</span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="60" 
                  step="1" 
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-stone-800 rounded-full appearance-none cursor-pointer accent-primary" 
                />
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-xs font-bold text-stone-400 mb-2">Impacto IA Proyectado:</p>
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-lg">trending_up</span>
                  <span className="text-sm font-extrabold uppercase">Probabilidad Alta</span>
                </div>
                <p className="text-[11px] text-stone-300 mt-2 leading-relaxed italic">
                  "Reducir el objetivo a $8,500 podría aumentar tu probabilidad de éxito al 85%."
                </p>
              </div>

              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl text-sm font-bold transition-all">
                Aplicar Cambios al Proyecto
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 p-6 rounded-3xl">
            <h3 className="text-sm font-extrabold dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl animate-pulse">auto_awesome</span>
              IA Copilot
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                <h4 className="text-xs font-bold dark:text-white">Optimizar Título</h4>
                <p className="text-[11px] text-stone-500 mt-1">Títulos de 5-7 palabras convierten un 12% mejor.</p>
                <button className="mt-3 text-[11px] font-extrabold text-primary hover:underline uppercase tracking-wider">Ver Sugerencias</button>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                <h4 className="text-xs font-bold dark:text-white">Añadir Video Pitch</h4>
                <p className="text-[11px] text-stone-500 mt-1">Los proyectos con video tienen un 50% más de éxito.</p>
                <button className="mt-3 text-[11px] font-extrabold text-primary hover:underline uppercase tracking-wider">Generar Guion IA</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
