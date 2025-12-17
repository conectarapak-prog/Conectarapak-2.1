
import React from 'react';
import { MOCK_INCIDENTS } from '../constants';

export const AdminModeration: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold dark:text-white">Panel de Moderación y Fraudes</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            IA Centinela activa • Monitoreando ecosistema en tiempo real
          </p>
        </div>
        <button className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">refresh</span>
          Actualizar Cola
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-900/50">
              <h3 className="font-bold text-sm dark:text-white uppercase tracking-wider">Cola de Incidentes</h3>
              <span className="text-[10px] font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">Total: 24</span>
            </div>
            <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
              {MOCK_INCIDENTS.map((inc) => (
                <div 
                  key={inc.id}
                  className={`p-4 rounded-xl border-l-4 transition-all cursor-pointer hover:scale-[1.02] ${
                    inc.risk === 'High' 
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-500' 
                    : 'bg-white dark:bg-earth-card border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                      inc.risk === 'High' ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-600'
                    }`}>
                      Riesgo {inc.risk === 'High' ? 'Alto' : 'Medio'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">{inc.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-sm dark:text-white">{inc.title}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">{inc.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-primary">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                    {inc.confidence}% Confianza IA
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="size-14 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl font-bold">payments</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold dark:text-white">Análisis de Fraude: Smurfing</h3>
                  <p className="text-sm text-stone-500 font-medium">INC-2049 • Proyecto "Eco-Energy V2"</p>
                </div>
              </div>
              <div className="bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span className="size-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-xs font-bold dark:text-white">En Revisión</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-100 dark:border-stone-800">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Resumen de IA</h4>
                  <p className="text-sm leading-relaxed dark:text-stone-300">
                    Se detectaron <span className="font-bold text-accent">50 donaciones</span> de exactamente <span className="font-mono">$9.99</span> desde 5 IPs diferentes en un lapso de 10 minutos. Geo-localización sugiere que todas las IPs operan en el mismo edificio.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-stone-400">Probabilidad de Fraude</span>
                      <span className="text-red-500">98%</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: '98%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-stone-400">Coincidencia de Patrones</span>
                      <span className="text-accent">85%</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 h-full min-h-[240px] bg-stone-900 relative">
                 <img 
                  src="https://picsum.photos/seed/fraudgraph/800/600" 
                  alt="Fraud Graph" 
                  className="w-full h-full object-cover opacity-50"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Visualización de Nodos IA</span>
                 </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col md:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Añadir nota interna de resolución..." 
                className="flex-1 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:ring-primary"
              />
              <div className="flex gap-2">
                <button className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold text-sm hover:bg-primary/20 transition-all">
                  Falso Positivo
                </button>
                <button className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">
                  Bloquear & Banear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
