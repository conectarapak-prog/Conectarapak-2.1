
import React, { useState } from 'react';
import { analyzeImageWithPro, generateImagePro } from '../services/geminiService';
import { NewsItem } from '../types';

export const AIPowerLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'generate'>('analyze');
  const [file, setFile] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const runProcess = async () => {
    setLoading(true);
    let res: any;
    if (activeTab === 'analyze' && file) res = await analyzeImageWithPro(file.split(',')[1], prompt || "Analiza.");
    else if (activeTab === 'generate') res = await generateImagePro(prompt, "1K", "16:9");
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="w-full space-y-8 py-8 animate-fade-in max-w-7xl mx-auto h-[calc(100vh-180px)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase leading-none">AI <span className="text-intel italic">Power Lab</span></h2>
        <div className="flex bg-stone-100 dark:bg-stone-900 p-1 rounded-xl nosigner-card">
           {['analyze', 'generate'].map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 rounded-lg text-[8px] font-mono font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-stone-800 text-intel shadow-sm' : 'text-stone-400'}`}>
               {tab === 'analyze' ? 'Auditoría Visual' : 'Generación IA'}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        <div className="lg:col-span-4 bg-white dark:bg-stone-950 p-8 rounded-[3rem] border nosigner-card flex flex-col gap-6">
           {activeTab === 'analyze' && (
             <div className="aspect-video bg-stone-50 dark:bg-stone-900 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center relative group overflow-hidden">
                {file ? <img src={file} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-stone-300">add_a_photo</span>}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                  const reader = new FileReader();
                  reader.onload = (ev) => setFile(ev.target?.result as string);
                  if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
                }} />
             </div>
           )}
           <textarea 
            value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="Parámetros de diseño/análisis..."
            className="flex-1 bg-stone-50 dark:bg-stone-900 border-none rounded-2xl p-6 text-xs font-mono font-bold dark:text-white outline-none focus:ring-1 focus:ring-intel resize-none shadow-inner"
           />
           <button onClick={runProcess} disabled={loading} className="h-16 bg-intel text-white rounded-xl font-mono font-black text-[10px] uppercase tracking-widest shadow-xl shadow-intel/10 active:scale-95 transition-all">
             {loading ? 'Sync...' : 'Iniciar Protocolo'}
           </button>
        </div>

        <div className="lg:col-span-8 bg-white dark:bg-stone-950 rounded-[3rem] border nosigner-card relative overflow-hidden flex flex-col items-center justify-center grid-technical">
           {loading ? (
             <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="size-10 border-2 border-intel border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[8px] font-mono font-black text-intel uppercase tracking-widest">Calculando Pixel_Data...</p>
             </div>
           ) : result ? (
             <div className="w-full h-full p-8 animate-fade-in flex items-center justify-center">
                {result.startsWith('data:image') ? (
                  <img src={result} className="max-h-full rounded-2xl shadow-2xl border nosigner-card" />
                ) : (
                  <p className="text-xs font-mono font-bold dark:text-stone-300 bg-stone-50 dark:bg-stone-900/50 p-8 rounded-2xl border nosigner-card italic">{result}</p>
                )}
             </div>
           ) : (
             <div className="opacity-[0.03] grayscale pointer-events-none text-center">
                <span className="material-symbols-outlined text-[150px]">hub</span>
                <p className="text-xl font-black uppercase tracking-[0.4em]">Node.Output</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
