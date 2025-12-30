
import React, { useState, useEffect } from 'react';
import { generateFullConvergenceReport } from '../services/geminiService';

type StrategyTab = 'estrategia' | 'investigacion' | 'reportes';

interface SavedReport {
  id: string;
  title: string;
  tool: string;
  content: string;
  date: string;
  context: string;
  fileSize?: string;
}

/**
 * Parser de texto mejorado que limpia sintaxis Markdown residual
 */
const FormattedOutput: React.FC<{ text: string }> = ({ text }) => {
  const sections = text.split(/(?=###)/g);
  
  const cleanTitle = (t: string) => t.replace(/###/g, '').replace(/\*\*/g, '').replace(/#/g, '').trim();
  const cleanLine = (l: string) => l.replace(/\*\*/g, '').replace(/__/g, '').replace(/^[\*\-]\s*/, '• ').trim();

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {sections.map((section, idx) => {
        const lines = section.split('\n').filter(l => l.trim());
        if (!lines.length) return null;
        
        const title = cleanTitle(lines[0]);
        const content = lines.slice(1);

        if (!title) return null;

        return (
          <div key={idx} className="bg-white dark:bg-stone-900 p-8 md:p-10 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-20 group-hover:opacity-100 transition-opacity"></div>
            
            <h4 className="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tighter mb-6 flex items-center gap-4">
              <span className="bg-primary/10 text-primary text-[10px] size-10 flex items-center justify-center rounded-2xl font-black">0{idx + 1}</span>
              {title}
            </h4>
            
            <div className="space-y-4">
              {content.map((line, lIdx) => {
                const parts = line.split(/(\(.*?\))/g);
                return (
                  <p key={lIdx} className="text-sm md:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                    {parts.map((p, pIdx) => {
                      if (p.startsWith('(') && p.endsWith(')')) {
                        return (
                          <span key={pIdx} className="text-primary text-[9px] font-black uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-lg mx-1 inline-block border border-primary/10">
                            {p.slice(1, -1)}
                          </span>
                        );
                      }
                      return cleanLine(p);
                    })}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Recommendations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StrategyTab>('estrategia');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [showArchivedToast, setShowArchivedToast] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hub_saved_reports');
    if (stored) setSavedReports(JSON.parse(stored));
  }, []);

  const autoSaveReport = (content: string, contextText: string) => {
    const newReport: SavedReport = {
      id: Date.now().toString(),
      title: `CONVERGENCIA_${contextText.slice(0, 15).toUpperCase().replace(/\s/g, '_')}`,
      tool: "FULL CONVERGENCE",
      content: content,
      context: contextText,
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      fileSize: `${(content.length / 1024).toFixed(1)} KB`
    };
    const updated = [newReport, ...savedReports];
    setSavedReports(updated);
    localStorage.setItem('hub_saved_reports', JSON.stringify(updated));
    setShowArchivedToast(true);
    setTimeout(() => setShowArchivedToast(false), 4000);
  };

  const handleFullProcess = async () => {
    if (!context.trim() || loading) return;
    setLoading(true);
    setResult(null);
    
    const convergenceReport = await generateFullConvergenceReport(context);
    setResult(convergenceReport);
    setLoading(false);
    
    // Guardado automático como "archivo en línea" en la pestaña de Investigación
    autoSaveReport(convergenceReport, context);
  };

  const downloadPDF = () => {
    if (!result) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>CONECTARAPAK - INFORME ESTRATÉGICO</title>
          <style>
            body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 50px; color: #1c1c16; line-height: 1.6; }
            h1 { color: #599E39; text-transform: uppercase; font-size: 32px; letter-spacing: -1px; margin-bottom: 5px; }
            .meta { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            h2 { color: #1c1c16; font-size: 20px; text-transform: uppercase; margin-top: 40px; border-left: 4px solid #599E39; padding-left: 15px; }
            p { margin-bottom: 15px; text-align: justify; }
            .glossary { color: #599E39; font-weight: bold; font-size: 11px; }
          </style>
        </head>
        <body>
          <h1>Informe de Convergencia Total</h1>
          <div class="meta">Generado por Nodo IA CONECTARAPAK • ${new Date().toLocaleDateString()}</div>
          <p><strong>Contexto de Análisis:</strong> ${context}</p>
          <div>${result.replace(/\n/g, '<br>').replace(/###/g, '<h2>').replace(/##/g, '<h2>')}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const deleteReport = (id: string) => {
    const updated = savedReports.filter(r => r.id !== id);
    setSavedReports(updated);
    localStorage.setItem('hub_saved_reports', JSON.stringify(updated));
  };

  const isExploringFiles = activeTab === 'investigacion' || activeTab === 'reportes';

  return (
    <div className="max-w-[1440px] mx-auto py-10 px-4 md:px-10 animate-fade-in min-h-screen flex flex-col gap-10 relative">
      
      {/* Toast de Archivo Guardado */}
      {showArchivedToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-stone-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce border border-white/10">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">inventory_2</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest">Archivo Digital Creado</p>
            <p className="text-[8px] text-stone-400 font-bold uppercase">Sincronizado en pestaña de Investigación</p>
          </div>
        </div>
      )}

      {/* HEADER DINÁMICO */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 border-b border-stone-100 dark:border-stone-800 pb-12">
        <div className="space-y-2 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
            <span className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(89,158,57,0.5)]"></span>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">Active Intelligence Node</p>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-stone-900 dark:text-white tracking-tighter leading-none font-display uppercase">
            Control <span className="text-primary italic">Hub</span>
          </h1>
        </div>

        <div className="bg-stone-50 dark:bg-stone-900/60 p-2 rounded-[3rem] border border-stone-100 dark:border-stone-800 flex items-center gap-2 shadow-inner">
           {['estrategia', 'investigacion', 'reportes'].map((t) => (
             <button 
               key={t}
               onClick={() => { setActiveTab(t as any); if(t === 'estrategia') setResult(null); }}
               className={`flex items-center gap-4 px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                 activeTab === t ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xl scale-105' : 'text-stone-400 hover:text-stone-600'
               }`}
             >
                <span className="material-symbols-outlined text-xl">{t === 'estrategia' ? 'grid_view' : t === 'investigacion' ? 'folder_open' : 'description'}</span>
                {t === 'investigacion' ? 'Archivos' : t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PANEL IZQUIERDO: INPUT - Solo se muestra en la pestaña de Estrategia */}
        {!isExploringFiles && (
          <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-8 animate-fade-in">
             <div className="bg-white dark:bg-stone-900 p-8 rounded-[3.5rem] border border-stone-100 dark:border-stone-800 shadow-sm space-y-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 ml-4">Contexto de Proyecto</label>
                   <textarea 
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Describe tu idea para Iquique o Tarapacá para generar el Informe de Convergencia..."
                      className="w-full h-40 bg-stone-50/50 dark:bg-stone-950/50 border-none rounded-[2rem] p-8 text-sm font-medium italic dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner"
                   />
                </div>

                <div className="flex justify-center gap-6 opacity-30">
                   {['stars', 'person_search', 'grid_view', 'public'].map(icon => (
                     <span key={icon} className="material-symbols-outlined">{icon}</span>
                   ))}
                </div>

                <button 
                  onClick={handleFullProcess}
                  disabled={loading || !context.trim()}
                  className="group w-full h-20 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-primary hover:text-white active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                >
                  {loading ? <span className="animate-spin material-symbols-outlined text-2xl">refresh</span> : <span className="material-symbols-outlined text-2xl">bolt</span>}
                  {loading ? 'Sincronizando...' : 'EJECUTAR CONVERGENCIA'}
                </button>
             </div>

             <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 flex items-center gap-6">
                <div className="size-14 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                   <span className="material-symbols-outlined text-3xl">cloud_sync</span>
                </div>
                <p className="text-[10px] text-stone-500 font-bold leading-relaxed uppercase tracking-widest">
                  Cada proceso genera un <span className="text-primary font-black">archivo digital persistente</span> en tu repositorio de investigación.
                </p>
             </div>
          </div>
        )}

        {/* PANEL DERECHO: TERMINAL / ARCHIVOS - Ajusta su ancho según la pestaña */}
        <div className={`${isExploringFiles ? 'lg:col-span-12' : 'lg:col-span-8'} transition-all duration-500`}>
           <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[4rem] min-h-[750px] overflow-hidden relative shadow-sm flex flex-col">
              
              <div className="bg-stone-50/50 dark:bg-stone-950/30 p-8 border-b border-stone-50 dark:border-stone-800 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className={`size-3 rounded-full ${result || loading ? 'bg-primary' : 'bg-stone-200'} animate-pulse`}></div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-400">
                      {isExploringFiles ? 'Explorador de Archivos Estratégicos' : 'Terminal de Estrategia Activa'}
                    </h3>
                 </div>
                 {result && activeTab === 'estrategia' && (
                   <div className="flex gap-6">
                      <button onClick={downloadPDF} className="text-[9px] font-black uppercase text-stone-400 hover:text-primary transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">picture_as_pdf</span> PDF
                      </button>
                      <button className="text-[9px] font-black uppercase text-primary transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">verified</span> Archivo Guardado
                      </button>
                   </div>
                 )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-16">
                
                {isExploringFiles ? (
                   <div className="space-y-6 animate-fade-in">
                      <div className={`grid grid-cols-1 ${isExploringFiles ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                        {savedReports.length > 0 ? savedReports.map(r => (
                          <div key={r.id} className="bg-stone-50/50 dark:bg-stone-950/30 p-8 rounded-[3rem] border border-stone-100 dark:border-stone-800 flex flex-col justify-between group hover:border-primary/30 hover:shadow-xl transition-all h-[200px]">
                             <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div className="size-12 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">description</span>
                                  </div>
                                  <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest">{r.fileSize}</span>
                                </div>
                                <div>
                                   <h4 className="text-sm font-black dark:text-white uppercase tracking-tight line-clamp-2">{r.title}</h4>
                                   <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">{r.date}</p>
                                </div>
                             </div>
                             <div className="flex gap-3 pt-4 border-t border-stone-200 dark:border-stone-800 mt-4">
                                <button onClick={() => { setResult(r.content); setContext(r.context); setActiveTab('estrategia'); }} className="flex-1 h-10 rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-300 hover:text-primary shadow-sm gap-2">
                                  <span className="material-symbols-outlined text-sm">visibility</span> Abrir
                                </button>
                                <button onClick={() => deleteReport(r.id)} className="size-10 shrink-0 rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-red-500 shadow-sm transition-colors">
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                             </div>
                          </div>
                        )) : (
                          <div className="col-span-full flex flex-col items-center justify-center text-center opacity-[0.05] grayscale py-32">
                             <span className="material-symbols-outlined text-[120px]">folder_open</span>
                             <p className="text-3xl font-black uppercase tracking-[0.5em] mt-8">Repositorio Vacío</p>
                             <p className="text-sm font-bold mt-4">Genera una estrategia para ver archivos aquí.</p>
                          </div>
                        )}
                      </div>
                   </div>
                ) : (
                  <>
                    {!result && !loading && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-[0.05] grayscale select-none py-32">
                        <span className="material-symbols-outlined text-[150px]">terminal</span>
                        <p className="text-4xl font-black uppercase tracking-[0.5em] mt-8">Standby Mode</p>
                        <p className="text-lg font-bold mt-4">Ingresa el contexto para inicializar el Informe de Convergencia.</p>
                      </div>
                    )}

                    {loading && (
                      <div className="h-full flex flex-col items-center justify-center space-y-10 py-32 animate-fade-in">
                         <div className="relative">
                            <div className="size-24 border-4 border-primary/20 rounded-full"></div>
                            <div className="absolute inset-0 size-24 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                         </div>
                         <div className="text-center space-y-2">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest animate-pulse">Sincronizando nodos regionales Tarapacá...</p>
                            <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest">Ejecutando Modelos PESTEL & VPC</p>
                         </div>
                      </div>
                    )}

                    {result && <FormattedOutput text={result} />}
                  </>
                )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
