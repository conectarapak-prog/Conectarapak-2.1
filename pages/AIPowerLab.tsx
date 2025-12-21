
import React, { useState } from 'react';
import { analyzeImageWithPro, generateImagePro, editImageWithIA } from '../services/geminiService';
import { NewsItem } from '../types';

interface AIPowerLabProps {
  onPublish: (insight: Partial<NewsItem>) => void;
}

export const AIPowerLab: React.FC<AIPowerLabProps> = ({ onPublish }) => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'generate' | 'edit'>('analyze');
  const [file, setFile] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = (ev) => setFile(ev.target?.result as string);
    if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const runProcess = async () => {
    setLoading(true);
    setResult(null);
    setIsPublished(false);
    try {
      if (activeTab === 'analyze' && file) {
        const base64 = file.split(',')[1];
        const res = await analyzeImageWithPro(base64, prompt || "Analiza la circularidad técnica.");
        setResult(res);
      } else if (activeTab === 'generate') {
        const res = await generateImagePro(prompt, "1K", "16:9");
        setResult(res);
      } else if (activeTab === 'edit' && file) {
        const base64 = file.split(',')[1];
        const res = await editImageWithIA(base64, prompt);
        setResult(res);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handlePublishInsight = () => {
    if (!result) return;
    onPublish({
      title: activeTab === 'analyze' ? "Auditoría Técnica Visual" : "Innovación Circular Generada",
      excerpt: typeof result === 'string' && !result.startsWith('data:image') ? result : `Se ha generado un activo visual con prompt: ${prompt}`,
      image: result.startsWith('data:image') ? result : (file || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"),
      category: "INSIGHT TÉCNICO"
    });
    setIsPublished(true);
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-stone-200 dark:border-stone-800 pb-8 gap-6">
        <div>
          <h2 className="text-5xl font-black dark:text-white tracking-tighter">AI <span className="text-primary italic">Power Lab</span></h2>
          <p className="text-stone-500 font-medium mt-2">Centro creativo y de auditoría técnica circular.</p>
        </div>
        <div className="flex bg-stone-100 dark:bg-stone-900 p-1.5 rounded-3xl gap-2">
           {['analyze', 'generate', 'edit'].map((tab) => (
             <button 
              key={tab}
              onClick={() => { setActiveTab(tab as any); setResult(null); }} 
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
             >
               {tab === 'analyze' ? 'Auditoría' : tab === 'generate' ? 'Generar' : 'Editar Foto'}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-earth-card p-10 rounded-[3.5rem] shadow-xl border border-stone-100 dark:border-stone-800 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-400">
              {activeTab === 'generate' ? 'Prompt Creativo' : 'Subir Imagen y Prompt'}
            </h4>
            
            {activeTab !== 'generate' && (
              <div className="relative aspect-video bg-stone-50 dark:bg-stone-900 rounded-[2rem] border-4 border-dashed border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center overflow-hidden group hover:border-primary/50 transition-colors">
                {file ? (
                  <img src={file} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center p-10 space-y-4">
                    <span className="material-symbols-outlined text-6xl text-stone-300">add_photo_alternate</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Cargar Activo Circular</p>
                  </div>
                )}
                <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                {file && (
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="absolute top-4 right-4 size-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Instrucciones IA</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={activeTab === 'edit' ? "Ej: Añade textura de plástico reciclado al empaque..." : "Describe el análisis o visión..."}
                className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-[2rem] p-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all min-h-[140px] resize-none"
              />
            </div>

            <button 
              onClick={runProcess}
              disabled={loading || (!file && activeTab !== 'generate') || (!prompt && activeTab === 'generate')}
              className="w-full h-20 bg-primary text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-4 hover:scale-[1.02] transition-all"
            >
              {loading ? <span className="animate-spin material-symbols-outlined">refresh</span> : <span className="material-symbols-outlined">{activeTab === 'analyze' ? 'analytics' : 'auto_awesome'}</span>}
              {loading ? 'Pensando...' : `Ejecutar ${activeTab.toUpperCase()}`}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7">
           <div className="bg-white dark:bg-earth-card border border-stone-100 dark:border-stone-800 rounded-[3.5rem] h-full p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
              {!result && !loading && (
                <div className="text-center opacity-20 space-y-6">
                   <span className="material-symbols-outlined text-[12rem] text-stone-300">temp_preferences_custom</span>
                   <p className="text-2xl font-black tracking-tighter text-stone-500 uppercase">Visor de Resultados</p>
                </div>
              )}
              
              {loading && (
                <div className="flex flex-col items-center gap-8">
                   <div className="size-24 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-sm font-black uppercase tracking-[0.3em] text-primary animate-pulse">Consultando Red Neuronal...</p>
                </div>
              )}

              {result && (
                <div className="w-full h-full animate-fade-in overflow-y-auto custom-scrollbar flex flex-col items-center justify-center gap-8">
                   <div className="w-full flex justify-end px-4">
                      {!isPublished && (
                        <button 
                          onClick={handlePublishInsight}
                          className="bg-primary text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-primary-hover transition-all flex items-center gap-2"
                        >
                           <span className="material-symbols-outlined text-sm">publish</span> Sincronizar Insight con Feed
                        </button>
                      )}
                   </div>
                   
                   {result.startsWith('data:image') ? (
                     <div className="space-y-6 w-full">
                        <div className="flex justify-between items-center mb-4">
                           <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">Resultado Visual Generado</h5>
                           <a href={result} download="ai-circular.png" className="text-stone-400 hover:text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                              Descargar <span className="material-symbols-outlined text-sm">download</span>
                           </a>
                        </div>
                        <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 bg-black aspect-video relative group">
                           <img src={result} className="w-full h-full object-cover" alt="Result" />
                           <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                     </div>
                   ) : (
                     <div className="prose dark:prose-invert max-w-none w-full">
                        <div className="bg-stone-50 dark:bg-stone-900 p-10 rounded-[2.5rem] border border-stone-100 dark:border-stone-800">
                           <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm">verified</span> Informe de Auditoría Gemini 3
                           </h5>
                           <div className="text-stone-600 dark:text-stone-300 leading-loose text-lg font-medium whitespace-pre-wrap italic">
                              {result}
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
