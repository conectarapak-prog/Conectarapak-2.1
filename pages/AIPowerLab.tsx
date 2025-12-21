
import React, { useState } from 'react';
// Fix: removed non-existent export 'editImageWithIA'
import { analyzeImageWithPro, generateImagePro } from '../services/geminiService';
import { NewsItem } from '../types';

interface AIPowerLabProps {
  onPublish: (insight: Partial<NewsItem>) => void;
}

export const AIPowerLab: React.FC<AIPowerLabProps> = ({ onPublish }) => {
  // Fix: removed 'edit' from activeTab as it is not implemented and causing compilation errors
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
    <div className="flex flex-col gap-10 animate-fade-in pb-20 max-w-[1440px] mx-auto px-8">
      
      {/* Header con Atmósfera de Inteligencia */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-intel/10 pb-8">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-intel/10 text-intel border border-intel/20">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Atmósfera de Inteligencia</span>
           </div>
           <h2 className="text-6xl font-black dark:text-white tracking-tighter leading-none uppercase">
             AI <span className="text-intel italic">Power Lab</span>
           </h2>
        </div>
        <div className="flex bg-stone-100 dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800">
           {['analyze', 'generate'].map((tab) => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)} 
              className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-intel text-white shadow-lg' : 'text-stone-400 hover:text-intel'}`}
             >
               {tab === 'analyze' ? 'Auditoría Visual' : 'Generación IA'}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
           <div className="bg-white dark:bg-earth-card p-10 rounded-[3rem] border border-intel/10 shadow-xl space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Parámetros de Entrada</h4>
              
              {activeTab === 'analyze' && (
                <div className="aspect-video bg-stone-50 dark:bg-stone-950 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center overflow-hidden relative cursor-pointer hover:border-intel/40 transition-colors">
                  {file ? <img src={file} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-4xl text-stone-300">add_photo_alternate</span>}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => setFile(ev.target?.result as string);
                    if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
                  }} />
                </div>
              )}

              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe el objetivo estratégico..."
                className="w-full bg-stone-50 dark:bg-stone-950 border-none rounded-2xl p-6 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-intel/10 min-h-[140px] resize-none"
              />

              <button 
                onClick={runProcess}
                disabled={loading}
                className="w-full h-16 bg-intel text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-intel/20 disabled:opacity-50 active:scale-95 transition-all"
              >
                {loading ? 'Sincronizando...' : 'Ejecutar Lab'}
              </button>
           </div>
        </div>

        <div className="lg:col-span-7 h-full">
           <div className="bg-white dark:bg-earth-card border border-intel/10 rounded-[3rem] p-12 h-full flex flex-col items-center justify-center shadow-2xl relative">
              <div className="absolute top-0 right-0 p-10 opacity-5 grayscale pointer-events-none">
                 <span className="material-symbols-outlined text-[10rem]">science</span>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center gap-6">
                   <div className="size-16 border-4 border-intel border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-intel animate-pulse">Deep Reasoning Active</p>
                </div>
              ) : result ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-8">
                   {result.startsWith('data:image') ? (
                     <img src={result} className="w-full rounded-[2rem] shadow-2xl border-4 border-white dark:border-stone-800" />
                   ) : (
                     <p className="text-xl font-bold text-stone-700 dark:text-stone-300 italic leading-relaxed bg-intel/5 p-10 rounded-[2rem] border border-intel/10">
                       {result}
                     </p>
                   )}
                </div>
              ) : (
                <div className="text-center opacity-10">
                   <span className="material-symbols-outlined text-[150px]">hub</span>
                   <p className="text-xl font-black uppercase mt-4">Esperando Input</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
