
import React, { useState, useEffect } from 'react';
import { generateStrategicFramework } from '../services/geminiService';

type StrategyTab = 'estrategia' | 'investigacion' | 'reportes';

interface SavedReport {
  id: string;
  title: string;
  tool: string;
  content: string;
  date: string;
  context: string;
}

interface StrategyCardProps {
  title: string;
  tool: string;
  desc: string;
  icon: string;
  isActive: boolean;
  status: 'PENDIENTE' | 'COMPLETADO';
  onClick: () => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ title, tool, desc, icon, isActive, status, onClick }) => (
  <button 
    onClick={onClick}
    className={`group relative text-left bg-white dark:bg-stone-900 border-2 rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col gap-6 overflow-hidden ${
      isActive ? 'border-primary shadow-2xl scale-[1.02]' : 'border-stone-50 dark:border-stone-800 hover:border-stone-200 opacity-80 hover:opacity-100'
    }`}
  >
    <div className="flex justify-between items-start">
      <div className={`size-14 rounded-2xl flex items-center justify-center transition-colors ${isActive ? 'bg-primary text-white' : 'bg-stone-50 dark:bg-stone-800 text-stone-400 group-hover:text-primary'}`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${status === 'COMPLETADO' ? 'border-primary text-primary' : 'border-stone-100 text-stone-300'}`}>
        {status}
      </span>
    </div>
    <div>
      <h3 className="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tighter leading-none mb-3">{title}</h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 font-medium leading-relaxed italic pr-4">
        {desc} <span className="text-primary font-bold">{tool}</span>.
      </p>
    </div>
    {isActive && (
      <div className="absolute bottom-0 right-0 size-16 bg-primary/10 rounded-tl-full flex items-end justify-end p-4 text-primary animate-pulse">
        <span className="material-symbols-outlined">bolt</span>
      </div>
    )}
  </button>
);

const FormattedOutput: React.FC<{ text: string }> = ({ text }) => {
  const sections = text.split(/(?=###)/g);
  
  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {sections.map((section, idx) => {
        const lines = section.split('\n').filter(l => l.trim());
        if (!lines.length) return null;
        const title = lines[0].replace(/###/g, '').trim();
        const content = lines.slice(1);

        return (
          <div key={idx} className="bg-white dark:bg-stone-900/60 p-10 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-20 group-hover:opacity-100 transition-opacity"></div>
            
            <h4 className="text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tighter mb-6 flex items-center gap-4">
              <span className="bg-primary/10 text-primary text-xs size-8 flex items-center justify-center rounded-xl font-black">0{idx + 1}</span>
              {title}
            </h4>
            
            <div className="space-y-6">
              {content.map((line, lIdx) => {
                const parts = line.split(/(\(.*?\))/g);
                return (
                  <p key={lIdx} className="text-base md:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                    {parts.map((p, pIdx) => {
                      if (p.startsWith('(') && p.endsWith(')')) {
                        return (
                          <span key={pIdx} className="text-primary text-[10px] font-black uppercase tracking-widest cursor-help bg-primary/5 px-3 py-1 rounded-xl mx-1 inline-block border border-primary/10" title="Aclaración de la IA">
                            {p.slice(1, -1)}
                          </span>
                        );
                      }
                      if (p.includes('Iquique') || p.includes('Tarapacá') || p.includes('Zofri')) {
                        return <span key={pIdx} className="text-stone-900 dark:text-white font-black">{p}</span>;
                      }
                      return p.replace(/^[\*\-]\s*/, '• ');
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
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [convergencia, setConvergencia] = useState<boolean>(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('hub_saved_reports');
    if (stored) setSavedReports(JSON.parse(stored));
  }, []);

  const tools = [
    { title: "Value Prop", tool: "VPC", desc: "Marco estratégico para visualizar propuesta de", icon: "stars" },
    { title: "Customer Profile", tool: "VPC", desc: "Marco estratégico para visualizar segmentos de", icon: "person_search" },
    { title: "Lean Model", tool: "Canvas", desc: "Marco estratégico para visualizar negocio de", icon: "grid_view" },
    { title: "PESTEL Study", tool: "Marco", desc: "Marco estratégico para analizar factores de", icon: "public" }
  ];

  const handleProcess = async () => {
    if (!context.trim() || !selectedTool || loading) return;
    setLoading(true);
    setResult(null);
    setConvergencia(false);
    
    const frameworkRes = await generateStrategicFramework(selectedTool, context);
    setResult(frameworkRes);
    setConvergencia(true);
    setLoading(false);
  };

  const downloadPDF = () => {
    if (!result) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>CONECTARAPAK - Reporte de Estrategia</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 50px; color: #1c1c1c; line-height: 1.6; }
            h1 { color: #599E39; border-bottom: 2px solid #599E39; padding-bottom: 10px; font-size: 24px; text-transform: uppercase; letter-spacing: -0.5px; }
            h3 { color: #333; margin-top: 30px; font-size: 18px; text-transform: uppercase; border-left: 4px solid #599E39; padding-left: 15px; }
            p { margin-bottom: 15px; font-size: 14px; }
            .context { font-style: italic; color: #666; background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
            .footer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div style="text-align: right; font-size: 10px; color: #999;">${new Date().toLocaleDateString()}</div>
          <h1>CONECTARAPAK INTELLIGENCE: ${selectedTool}</h1>
          <div class="context"><strong>Contexto:</strong> ${context}</div>
          <div>${result.replace(/\n/g, '<br>').replace(/###/g, '<h3>')}</div>
          <div class="footer">Este documento fue generado mediante Inteligencia Artificial por la Red Conectarapak • Tarapacá, Chile</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const saveReport = () => {
    if (!result || !selectedTool) return;
    
    const newReport: SavedReport = {
      id: Date.now().toString(),
      title: `${selectedTool}: ${context.slice(0, 30)}...`,
      tool: selectedTool,
      content: result,
      context: context,
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updated = [newReport, ...savedReports];
    setSavedReports(updated);
    localStorage.setItem('hub_saved_reports', JSON.stringify(updated));
    alert('¡Reporte guardado con éxito en tu biblioteca!');
  };

  const deleteReport = (id: string) => {
    const updated = savedReports.filter(r => r.id !== id);
    setSavedReports(updated);
    localStorage.setItem('hub_saved_reports', JSON.stringify(updated));
  };

  return (
    <div className="max-w-[1440px] mx-auto py-10 px-4 md:px-10 animate-fade-in min-h-screen flex flex-col gap-10">
      
      {/* HEADER DE CONTROL HUB */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 border-b border-stone-100 dark:border-stone-800 pb-12">
        <div className="space-y-2 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
            <span className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(89,158,57,0.8)]"></span>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">Intelligence Node active</p>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-stone-900 dark:text-white tracking-tighter leading-none font-display uppercase">
            Control <span className="text-primary italic">Hub</span>
          </h1>
        </div>

        <div className="bg-stone-50 dark:bg-stone-900/60 p-2 rounded-[3rem] border border-stone-100 dark:border-stone-800 flex items-center gap-2 shadow-inner">
           {['estrategia', 'investigacion', 'reportes'].map((t) => (
             <button 
               key={t}
               onClick={() => { setActiveTab(t as any); setResult(null); }}
               className={`flex items-center gap-4 px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                 activeTab === t ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xl scale-105' : 'text-stone-400 hover:text-stone-600'
               }`}
             >
                <span className="material-symbols-outlined text-xl">{t === 'estrategia' ? 'grid_view' : t === 'investigacion' ? 'search' : 'description'}</span>
                {t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PANEL IZQUIERDO: CONTEXTO Y HERRAMIENTAS */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-8">
           
           {activeTab !== 'reportes' ? (
             <div className="bg-white dark:bg-stone-900 p-10 rounded-[3.5rem] border border-stone-100 dark:border-stone-800 shadow-sm space-y-10">
                <div className="space-y-4">
                   <div className="flex justify-between items-center ml-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Contexto del Proyecto</label>
                      <span className="text-[8px] font-bold text-stone-300 uppercase">{context.length}/500</span>
                   </div>
                   <textarea 
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Ej: Impulsar un nuevo deporte acuático en Iquique protegiendo el ecosistema costero..."
                      className="w-full h-48 bg-stone-50/50 dark:bg-stone-950/50 border-none rounded-[2.5rem] p-10 text-sm font-medium italic dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner scrollbar-hide"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   {tools.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedTool(t.title); setResult(null); }}
                        className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${
                          selectedTool === t.title ? 'border-primary bg-primary/5 shadow-lg' : 'border-stone-50 dark:border-stone-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <span className={`material-symbols-outlined mb-2 text-2xl ${selectedTool === t.title ? 'text-primary' : 'text-stone-300'}`}>{t.icon}</span>
                        <h4 className="text-[10px] font-black uppercase dark:text-white leading-tight">{t.title}</h4>
                        <p className="text-[8px] text-stone-400 mt-1 leading-tight group-hover:text-stone-500 transition-colors">Marco {t.tool}</p>
                        {selectedTool === t.title && (
                          <span className="absolute -right-2 -bottom-2 material-symbols-outlined text-primary/10 text-6xl">check_circle</span>
                        )}
                      </button>
                   ))}
                </div>

                <button 
                  onClick={handleProcess}
                  disabled={loading || !context.trim() || !selectedTool}
                  className="group w-full h-20 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-primary hover:text-white active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                >
                  {loading ? <span className="animate-spin material-symbols-outlined text-2xl">refresh</span> : <span className="material-symbols-outlined text-2xl">bolt</span>}
                  {loading ? 'SINCRONIZANDO NODOS...' : 'EJECUTAR CONVERGENCIA IA'}
                </button>
             </div>
           ) : (
             <div className="bg-white dark:bg-stone-900 p-10 rounded-[3.5rem] border border-stone-100 dark:border-stone-800 shadow-sm space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400 ml-4">Estadísticas de Biblioteca</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-stone-50 dark:bg-stone-950 rounded-3xl">
                      <p className="text-3xl font-black dark:text-white">{savedReports.length}</p>
                      <p className="text-[8px] font-bold text-stone-400 uppercase mt-1">Reportes</p>
                   </div>
                   <div className="p-6 bg-stone-50 dark:bg-stone-950 rounded-3xl">
                      <p className="text-3xl font-black text-primary">IA</p>
                      <p className="text-[8px] font-bold text-stone-400 uppercase mt-1">Motor Gemini</p>
                   </div>
                </div>
             </div>
           )}

           <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 flex items-center gap-6">
              <div className="size-14 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                 <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <p className="text-[10px] text-stone-500 font-bold leading-relaxed uppercase tracking-widest">
                Gemini procesará términos técnicos <span className="text-primary font-black">aclarándolos</span> para tu total comprensión.
              </p>
           </div>
        </div>

        {/* PANEL DERECHO: TERMINAL DE ESTRATEGIA ACTIVA */}
        <div className="lg:col-span-7">
           <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[4rem] min-h-[750px] overflow-hidden relative shadow-sm flex flex-col">
              
              {/* Header de la Terminal */}
              <div className="bg-stone-50/50 dark:bg-stone-950/30 p-8 border-b border-stone-50 dark:border-stone-800 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className={`size-3 rounded-full ${result || activeTab === 'reportes' ? 'bg-primary' : 'bg-stone-200'} animate-pulse`}></div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-400">
                      {activeTab === 'reportes' ? 'Biblioteca de Estrategias' : 'Terminal de Estrategia Activa'}
                    </h3>
                 </div>
                 {result && (
                   <div className="flex gap-6">
                      <button 
                        onClick={downloadPDF}
                        className="text-[9px] font-black uppercase text-stone-400 hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <span className="material-symbols-outlined text-sm group-hover:scale-125 transition-transform">picture_as_pdf</span> PDF
                      </button>
                      <button 
                        onClick={saveReport}
                        className="text-[9px] font-black uppercase text-stone-400 hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">bookmark</span> Guardar
                      </button>
                   </div>
                 )}
              </div>

              {/* Area de scroll de la Terminal */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-16">
                
                {activeTab === 'reportes' ? (
                  <div className="space-y-6">
                     {savedReports.length > 0 ? (
                       savedReports.map(report => (
                         <div key={report.id} className="group bg-stone-50/50 dark:bg-stone-950/30 p-10 rounded-[3rem] border border-stone-100 dark:border-stone-800 hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start mb-6">
                               <div className="space-y-1">
                                  <h4 className="text-xl font-black dark:text-white uppercase tracking-tighter">{report.tool}</h4>
                                  <p className="text-[8px] font-black text-primary uppercase tracking-widest">{report.date}</p>
                               </div>
                               <div className="flex gap-2">
                                  <button onClick={() => { setContext(report.context); setSelectedTool(report.tool); setResult(report.content); setActiveTab('estrategia'); }} className="size-10 rounded-xl bg-white dark:bg-stone-800 text-stone-400 hover:text-primary flex items-center justify-center shadow-sm">
                                     <span className="material-symbols-outlined text-sm">visibility</span>
                                  </button>
                                  <button onClick={() => deleteReport(report.id)} className="size-10 rounded-xl bg-white dark:bg-stone-800 text-stone-400 hover:text-red-500 flex items-center justify-center shadow-sm">
                                     <span className="material-symbols-outlined text-sm">delete</span>
                                  </button>
                               </div>
                            </div>
                            <p className="text-xs text-stone-500 italic font-medium line-clamp-2 pr-10">"${report.context}"</p>
                         </div>
                       ))
                     ) : (
                       <div className="h-full flex flex-col items-center justify-center text-center opacity-[0.05] grayscale select-none py-32">
                          <span className="material-symbols-outlined text-[150px]">folder_open</span>
                          <p className="text-4xl font-black uppercase tracking-[0.5em] mt-8">Biblioteca Vacía</p>
                       </div>
                     )}
                  </div>
                ) : (
                  <>
                    {!result && !loading && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-[0.05] grayscale select-none pointer-events-none py-32">
                        <span className="material-symbols-outlined text-[180px]">terminal</span>
                        <p className="text-5xl font-black uppercase tracking-[0.5em] mt-8">Standby Mode</p>
                        <p className="text-xl font-bold mt-4 max-w-sm mx-auto">Configura el contexto y selecciona una herramienta para inicializar.</p>
                      </div>
                    )}

                    {loading && (
                      <div className="h-full flex flex-col items-center justify-center space-y-12 py-32 animate-fade-in">
                         <div className="relative">
                            <div className="size-32 border-4 border-primary/20 rounded-full"></div>
                            <div className="absolute inset-0 size-32 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                               <span className="material-symbols-outlined text-primary text-4xl animate-pulse">hub</span>
                            </div>
                         </div>
                         <div className="text-center space-y-4">
                            <h3 className="text-3xl font-black text-stone-900 dark:text-white uppercase tracking-tighter">Procesando Convergencia</h3>
                            <div className="flex flex-col gap-2">
                               <p className="text-stone-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Analizando marco legal ZOFRI...</p>
                               <p className="text-stone-400 font-bold text-[10px] uppercase tracking-widest animate-pulse [animation-delay:0.5s]">Evaluando impacto ecosistémico costero...</p>
                            </div>
                         </div>
                      </div>
                    )}

                    {result && (
                      <div className="animate-fade-in">
                         <FormattedOutput text={result} />

                         {convergencia && (
                           <div className="mt-16 p-10 bg-stone-900 rounded-[3rem] border border-primary/20 shadow-2xl relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
                                 <span className="material-symbols-outlined text-8xl text-primary">verified_user</span>
                              </div>
                              <div className="relative z-10 space-y-6">
                                 <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                    <h5 className="text-[11px] font-black text-white uppercase tracking-[0.6em]">Convergencia Regional Exitosa</h5>
                                 </div>
                                 <p className="text-lg text-stone-300 font-medium leading-relaxed italic border-l-2 border-primary/30 pl-6">
                                   "Este análisis integra el potencial del <span className="text-white">Puerto de Iquique</span> y la <span className="text-white">ZOFRI</span> como catalizadores de tu proyecto. El siguiente paso es la validación con actores locales del sector {selectedTool?.toLowerCase()}."
                                 </p>
                                 <div className="pt-4 flex gap-6">
                                    <div className="text-center">
                                       <p className="text-primary text-2xl font-black tracking-tighter">94%</p>
                                       <p className="text-[8px] font-black text-stone-500 uppercase">Viabilidad</p>
                                    </div>
                                    <div className="text-center">
                                       <p className="text-primary text-2xl font-black tracking-tighter">8.2</p>
                                       <p className="text-[8px] font-black text-stone-500 uppercase">Score ESG</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                         )}
                      </div>
                    )}
                  </>
                )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
