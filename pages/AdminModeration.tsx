
import React, { useState } from 'react';
import { MOCK_INCIDENTS } from '../constants';
import { analyzeProjectRisk } from '../services/geminiService';
import { Incident } from '../types';

export const AdminModeration: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(MOCK_INCIDENTS[0]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDeepScan = async () => {
    if (!selectedIncident) return;
    setIsAnalyzing(true);
    const report = await analyzeProjectRisk(selectedIncident.title, selectedIncident.description);
    setAiAnalysis(report || 'Error al generar el reporte.');
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold dark:text-white tracking-tighter">Centro de Control Smart</h2>
          <p className="text-stone-500 text-sm font-medium">Monitoreo de integridad y cumplimiento circular.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-earth-card p-2 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
           <div className="px-4 py-2 text-center border-r border-stone-100 dark:border-stone-800">
             <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Incidentes Hoy</p>
             <p className="text-xl font-bold text-stone-800 dark:text-white">24</p>
           </div>
           <div className="px-4 py-2 text-center">
             <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Riesgo Crítico</p>
             <p className="text-xl font-bold text-red-500">03</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Incident List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-sm dark:text-white uppercase tracking-[0.2em] text-stone-400">Cola de Revisión</h3>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[65vh] pr-2 custom-scrollbar">
            {MOCK_INCIDENTS.map((inc) => (
              <div 
                key={inc.id}
                onClick={() => { setSelectedIncident(inc); setAiAnalysis(null); }}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                  selectedIncident?.id === inc.id 
                  ? 'border-primary bg-white dark:bg-earth-card shadow-xl ring-4 ring-primary/5' 
                  : 'border-transparent bg-white/50 dark:bg-earth-card/50 hover:border-stone-200 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    inc.risk === 'High' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {inc.risk} Risk
                  </span>
                  <span className="text-[10px] text-stone-400 font-bold font-mono">{inc.id}</span>
                </div>
                <h4 className="font-extrabold text-sm dark:text-white mb-2 leading-tight">{inc.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-stone-500 font-bold uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">schedule</span> {inc.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-8">
          {selectedIncident ? (
            <div className="bg-white dark:bg-earth-card border border-stone-100 dark:border-stone-800 rounded-[3rem] p-10 shadow-2xl flex flex-col h-full overflow-hidden relative">
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                <div className="space-y-4 max-w-lg">
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-2xl flex items-center justify-center ${selectedIncident.risk === 'High' ? 'bg-red-500' : 'bg-amber-500'} text-white shadow-lg`}>
                      <span className="material-symbols-outlined font-bold">priority_high</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black dark:text-white tracking-tighter leading-none">{selectedIncident.title}</h3>
                      <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-2">Usuario ID: {selectedIncident.authorId} • Geolocalización: Tarapacá, CL</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-primary/20">
                    Confianza IA: {selectedIncident.confidence}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Descripción Crítica</h4>
                    <p className="text-lg leading-relaxed dark:text-stone-200 font-medium italic border-l-4 border-stone-200 dark:border-stone-700 pl-6 py-2">
                      "{selectedIncident.description}"
                    </p>
                  </div>

                  {!aiAnalysis ? (
                    <button 
                      onClick={handleDeepScan}
                      disabled={isAnalyzing}
                      className="w-full h-20 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-[2rem] font-black text-sm flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <span className="material-symbols-outlined animate-spin">refresh</span>
                      ) : (
                        <span className="material-symbols-outlined text-3xl">psychology</span>
                      )}
                      {isAnalyzing ? 'ESCANEANDO REDES...' : 'EJECUTAR AUDITORÍA GEMINI SMART'}
                    </button>
                  ) : (
                    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-[2rem] p-8 animate-fade-in">
                       <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                         <span className="material-symbols-outlined text-sm">verified</span> Informe de Integridad
                       </h4>
                       <div className="text-xs text-stone-600 dark:text-stone-300 whitespace-pre-wrap leading-loose font-medium">
                         {aiAnalysis}
                       </div>
                    </div>
                  )}
                </div>

                <div className="bg-stone-100 dark:bg-stone-900 rounded-[3rem] p-8 border border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center gap-6 group">
                   <div className="size-48 bg-white dark:bg-earth-card rounded-full flex items-center justify-center border-8 border-primary/5 group-hover:border-primary/20 transition-all shadow-inner relative">
                      <span className="text-4xl font-black text-stone-800 dark:text-white">{selectedIncident.confidence}%</span>
                      <svg className="absolute inset-0 size-full -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-stone-200 dark:text-stone-800"/>
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="552.92" strokeDashoffset={552.92 - (552.92 * selectedIncident.confidence) / 100} className="text-primary"/>
                      </svg>
                   </div>
                   <div className="text-center">
                     <p className="text-xs font-black uppercase tracking-[0.2em] dark:text-white mb-1">Cálculo de Veracidad</p>
                     <p className="text-[10px] text-stone-500 font-bold">Basado en 4.2k puntos de datos territoriales.</p>
                   </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-4">
                <button className="flex-1 min-w-[150px] py-4 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-200 transition-all">
                  Marcar Seguro
                </button>
                <button className="flex-1 min-w-[150px] py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all">
                  Escalar & Banear
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 rounded-[3rem] h-full flex flex-col items-center justify-center py-32 opacity-30">
               <span className="material-symbols-outlined text-8xl text-stone-300">shield_lock</span>
               <p className="text-2xl font-black mt-6 tracking-tighter">Acceso de Administrador</p>
               <p className="text-sm font-bold mt-2">Selecciona un reporte de la cola izquierda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
