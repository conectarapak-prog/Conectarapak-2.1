
import React, { useState, useEffect, useRef } from 'react';
import { getCircularEconomyAdvice, searchRegionalInsights } from '../services/geminiService';

type StrategyTab = 'bitacora' | 'investigacion' | 'informes' | 'comentarios';

interface SavedResearch {
  id: string;
  query: string;
  text: string;
  sources: any[];
  timestamp: number;
}

const FormattedAIText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  return (
    <div className="space-y-6 md:space-y-8 text-stone-700 dark:text-stone-300 print:text-black">
      {lines.map((line, i) => {
        if (line.startsWith('###') || /^\d\.\s/.test(line)) {
          return (
            <h4 key={i} className="text-xl md:text-2xl font-black text-stone-900 dark:text-white pt-4 md:pt-6 mb-2 flex items-center gap-3 md:gap-4 group/h">
              <span className="size-2 bg-accent rounded-full group-hover/h:scale-150 transition-transform duration-500 shrink-0"></span>
              {line.replace(/^###\s*|^\d\.\s*/, '')}
            </h4>
          );
        }
        
        const parts = line.split(/(\*\*.*?\*\*|\[.*?\])/g);
        return (
          <p key={i} className="text-base md:text-lg leading-relaxed md:leading-[2] font-medium opacity-90 print:opacity-100 pr-2">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <span key={j} className="text-stone-900 dark:text-white font-black px-1.5 py-0.5 rounded-md bg-stone-100/50 dark:bg-stone-800/50">
                    {part.slice(2, -2)}
                  </span>
                );
              }
              if (part.startsWith('[') && part.endsWith(']')) {
                 return (
                   <span key={j} className="inline-flex items-center px-3 py-0.5 mx-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-[10px] font-black uppercase tracking-widest rounded-full border border-stone-200 dark:border-stone-700">
                      {part.slice(1, -1)}
                   </span>
                 );
              }
              const datePattern = /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\sde\s\d{4}/gi;
              if (datePattern.test(part)) {
                return (
                  <span key={j} className="inline-flex items-center px-3 py-0.5 mx-1 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-[11px] font-bold rounded-lg border border-stone-200 dark:border-stone-700 whitespace-nowrap">
                    {part}
                  </span>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
};

interface StrategyCardProps {
  title: string;
  tool: string;
  result: string;
  icon: string;
  status: 'PENDIENTE' | 'EN PROCESO' | 'COMPLETADO';
  onClick: () => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ title, tool, result, icon, status, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 transition-all duration-700 hover:border-accent hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] cursor-pointer flex flex-col justify-between h-full overflow-hidden"
  >
    <div className="absolute -right-6 -top-6 size-48 bg-stone-50 dark:bg-stone-800/30 rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000 -z-0"></div>
    <div className="relative z-10 space-y-6">
      <div className="flex justify-between items-start">
        <div className="size-14 md:size-16 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-stone-400 group-hover:text-accent group-hover:bg-accent/5 transition-all duration-700">
          <span className="material-symbols-outlined text-3xl md:text-4xl">{icon}</span>
        </div>
        <div className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black tracking-[0.3em] border transition-all duration-500 ${
          status === 'PENDIENTE' ? 'border-stone-100 text-stone-300' : 'border-accent text-accent animate-pulse shadow-xl shadow-accent/20'
        }`}>
          {status}
        </div>
      </div>
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white tracking-tighter leading-none mb-4 uppercase">{title}</h3>
        <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 font-medium leading-relaxed italic pr-4">
          Marco estratégico <span className="text-accent font-bold">{tool}</span> para visualizar {result}.
        </p>
      </div>
    </div>
    <div className="relative z-10 mt-12 md:mt-16 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-8">
      <div className="flex -space-x-3">
        {[1,2,3].map(i => (
          <div key={i} className="size-8 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-white dark:border-stone-900 shadow-sm"></div>
        ))}
      </div>
      <div className="size-10 md:size-12 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-2xl flex items-center justify-center translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 shadow-2xl">
        <span className="material-symbols-outlined text-xl md:text-2xl font-bold">arrow_outward</span>
      </div>
    </div>
  </div>
);

export const Recommendations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StrategyTab>('bitacora');
  const [loading, setLoading] = useState(false);
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState<{text: string, sources: any[]} | null>(null);
  const [savedConsultations, setSavedConsultations] = useState<SavedResearch[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [activeTool, setActiveTool] = useState<{title: string, tool: string} | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('saved_consultations');
    if (stored) setSavedConsultations(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('saved_consultations', JSON.stringify(savedConsultations));
  }, [savedConsultations]);

  const handleResearch = async () => {
    if (!researchQuery.trim() || loading) return;
    setLoading(true);
    const res = await searchRegionalInsights(researchQuery);
    if (res) setResearchResult(res);
    setLoading(false);
  };

  const saveConsultation = () => {
    if (!researchResult || !researchQuery) return;
    const newSave: SavedResearch = {
      id: Date.now().toString(),
      query: researchQuery,
      text: researchResult.text,
      sources: researchResult.sources,
      timestamp: Date.now()
    };
    setSavedConsultations(prev => [newSave, ...prev]);
  };

  const downloadPDF = (item?: SavedResearch) => {
    const content = item || researchResult;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CONECTARAPAK - Reporte Oficial</title>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1c1c1c; line-height: 1.6; }
              h1 { border-bottom: 3px solid #F59E0B; padding-bottom: 20px; font-size: 24px; letter-spacing: -1px; }
              .content { font-size: 14px; }
            </style>
          </head>
          <body>
            <h1>CONECTARAPAK INTELLIGENCE</h1>
            <div class="content">${content.text.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const deleteConsultation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedConsultations(prev => prev.filter(c => c.id !== id));
  };

  const openTool = (title: string, tool: string) => {
    setActiveTool({title, tool});
    setShowChat(true);
    setMessages([{ role: 'ai', text: `Asistente Estratégico activado para **${title}**. ¿Te gustaría comenzar con un ejemplo de referencia regional en Tarapacá?` }]);
  };

  const tabs: {id: StrategyTab, label: string, icon: string}[] = [
    { id: 'bitacora', label: 'Estrategia', icon: 'grid_view' },
    { id: 'investigacion', label: 'Investigación', icon: 'search' },
    { id: 'informes', label: 'Reportes', icon: 'description' },
    { id: 'comentarios', label: 'Feedback', icon: 'chat_bubble' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto py-10 md:py-20 px-4 md:px-10 animate-fade-in flex flex-col gap-10 md:gap-20 min-h-screen">
      
      {/* Header Premium Axial - Diseño Resiliente */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 border-b border-stone-100 dark:border-stone-800 pb-10 md:pb-14 w-full">
        <div className="space-y-4 lg:space-y-6 flex-shrink-0 text-center lg:text-left w-full lg:w-auto">
          <div className="flex items-center justify-center lg:justify-start gap-4">
             <div className="size-2 md:size-3 bg-accent rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse"></div>
             <span className="text-[9px] md:text-[11px] font-black text-stone-400 uppercase tracking-[0.6em] leading-none">Strategy Engine v2.9</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-stone-900 dark:text-white tracking-tighter leading-none font-display uppercase">
            Control <span className="text-accent italic">Hub</span>
          </h1>
        </div>

        {/* Navegación por Píldoras - Adaptive Layout */}
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar py-2 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="bg-stone-100/40 dark:bg-stone-900/40 p-1.5 md:p-2.5 rounded-full lg:rounded-[3rem] border border-stone-200/50 dark:border-stone-800/50 flex items-center gap-1 md:gap-2 backdrop-blur-3xl shadow-inner min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 md:gap-5 px-6 md:px-12 py-3 md:py-5 rounded-full lg:rounded-[2.5rem] transition-all duration-700 whitespace-nowrap group ${
                  activeTab === tab.id 
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xl scale-105' 
                  : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <span className={`material-symbols-outlined text-xl md:text-2xl transition-transform group-hover:rotate-12 ${activeTab === tab.id ? 'fill-1' : ''}`}>{tab.icon}</span>
                <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em]">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 animate-fade-in" key={activeTab}>
        {activeTab === 'bitacora' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            <StrategyCard title="Value Prop" tool="VPC" result="propuesta" icon="stars" status="PENDIENTE" onClick={() => openTool('Propuesta de Valor', 'VPC')} />
            <StrategyCard title="Customer Profile" tool="VPC" result="segmentos" icon="person_search" status="PENDIENTE" onClick={() => openTool('Segmentación', 'VPC')} />
            <StrategyCard title="Lean Model" tool="Canvas" result="negocio" icon="grid_view" status="PENDIENTE" onClick={() => openTool('Modelo Lean', 'Lean Canvas')} />
            <StrategyCard title="PESTEL Study" tool="Marco" result="factores" icon="public" status="PENDIENTE" onClick={() => openTool('Análisis PESTEL', 'PESTEL')} />
          </div>
        )}

        {activeTab === 'investigacion' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            
            <div className="lg:col-span-8 space-y-10 md:space-y-16">
              <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                <h2 className="text-[10px] font-black text-accent uppercase tracking-[0.7em] ml-1">Validador Territorial</h2>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white tracking-tighter leading-tight max-w-2xl mx-auto lg:mx-0">Investiga leyes e incentivos regionales de Tarapacá</p>
              </div>

              {/* Input de Búsqueda Adaptativo */}
              <div className="w-full bg-white dark:bg-stone-900 rounded-[2.5rem] lg:rounded-[3.5rem] p-4 md:p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-4 group transition-all duration-700 focus-within:ring-4 focus-within:ring-accent/5">
                <div className="size-16 lg:size-20 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center text-stone-300 group-focus-within:text-accent shrink-0 hidden sm:flex">
                  <span className="material-symbols-outlined text-3xl lg:text-4xl">language</span>
                </div>
                <input 
                  type="text"
                  value={researchQuery}
                  onChange={(e) => setResearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
                  placeholder="Ej: ¿Qué beneficios tiene la Ley REP en Iquique?"
                  className="flex-1 bg-transparent border-none text-lg md:text-2xl px-4 lg:px-10 outline-none dark:text-white placeholder:text-stone-300 font-medium w-full"
                />
                <button 
                  onClick={handleResearch}
                  disabled={loading}
                  className="bg-accent text-white h-[60px] lg:h-[80px] px-8 lg:px-14 rounded-full lg:rounded-[2.5rem] font-black text-[10px] lg:text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:bg-accent-dark transition-all active:scale-95 flex items-center justify-center gap-4 w-full sm:w-auto"
                >
                  {loading ? <span className="animate-spin material-symbols-outlined">refresh</span> : <span className="material-symbols-outlined">travel_explore</span>}
                  <span className="sm:inline">{loading ? 'ANALIZANDO' : 'CONSULTAR IA'}</span>
                </button>
              </div>

              {/* Resultados con Toolbar Integrado (Anti-solapamiento) */}
              <div className="min-h-[400px]">
                {researchResult ? (
                  <div className="bg-white dark:bg-stone-900 p-8 md:p-20 rounded-[3rem] lg:rounded-[5rem] border border-stone-100 dark:border-stone-800 shadow-sm animate-fade-in relative overflow-hidden">
                    
                    {/* ACCIONES TOOLBAR INTEGRADO */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-10 md:mb-16 border-b border-stone-50 dark:border-stone-800 pb-8 gap-6">
                       <div className="flex items-center gap-4">
                          <div className="size-2 bg-accent rounded-full animate-pulse"></div>
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Informe Generado</span>
                       </div>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => downloadPDF()}
                            className="size-12 md:size-16 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center shadow-xl text-stone-400 hover:text-accent transition-all active:scale-90"
                            title="Descargar PDF"
                          >
                            <span className="material-symbols-outlined text-2xl md:text-3xl">picture_as_pdf</span>
                          </button>
                          <button 
                            onClick={saveConsultation}
                            className={`size-12 md:size-16 rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-90 ${
                              savedConsultations.some(c => c.query === researchQuery) 
                              ? 'bg-accent text-white' 
                              : 'bg-stone-50 dark:bg-stone-800 text-stone-400 hover:text-accent'
                            }`}
                            title="Guardar"
                          >
                            <span className="material-symbols-outlined text-2xl md:text-3xl">bookmark</span>
                          </button>
                       </div>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                      <FormattedAIText text={researchResult.text} />
                      
                      {researchResult.sources.length > 0 && (
                        <div className="mt-16 md:mt-20 pt-10 md:pt-12 border-t border-stone-100 dark:border-stone-800 space-y-6 md:space-y-8">
                          <h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-stone-300">Fuentes Verificadas:</h5>
                          <div className="flex flex-wrap gap-4 md:gap-5">
                            {researchResult.sources.map((src, i) => (
                              <a key={i} href={src.web?.uri} target="_blank" className="px-6 md:py-5 bg-stone-50 dark:bg-stone-800 rounded-2xl text-[10px] md:text-[11px] font-black text-accent uppercase tracking-widest hover:bg-accent hover:text-white transition-all flex items-center gap-3">
                                {src.web?.title || 'Fuente'}
                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 md:py-40 opacity-[0.05] border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-[3rem] lg:rounded-[5rem]">
                    <span className="material-symbols-outlined text-[100px] md:text-[160px]">travel_explore</span>
                    <p className="text-xl md:text-3xl font-black uppercase tracking-[0.5em] mt-8 md:mt-12 px-6">Explorador Inteligente Activo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Biblioteca Lateral / Inferior Adaptativa */}
            <div className="lg:col-span-4 space-y-8 md:space-y-10">
               <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[3rem] lg:rounded-[4rem] p-8 md:p-12 h-full flex flex-col shadow-sm lg:sticky lg:top-10">
                  <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-stone-50 dark:border-stone-800 pb-6 md:pb-8">
                     <h3 className="text-[10px] md:text-[11px] font-black text-stone-400 uppercase tracking-[0.5em] flex items-center gap-4">
                        <span className="material-symbols-outlined text-accent text-2xl">folder_managed</span>
                        Biblioteca
                     </h3>
                     <span className="px-3 py-1 bg-stone-50 dark:bg-stone-800 rounded-lg text-[9px] md:text-[10px] font-bold text-stone-400">{savedConsultations.length}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 md:space-y-8 pr-2">
                     {savedConsultations.length > 0 ? (
                        savedConsultations.map((save) => (
                           <div 
                             key={save.id}
                             onClick={() => {
                               setResearchQuery(save.query);
                               setResearchResult({ text: save.text, sources: save.sources });
                             }}
                             className="group bg-stone-50 dark:bg-stone-800/40 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-transparent hover:border-accent/30 hover:bg-white dark:hover:bg-stone-800 transition-all duration-700 cursor-pointer relative overflow-hidden"
                           >
                              <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); downloadPDF(save); }}
                                  className="size-8 md:size-10 rounded-xl bg-white dark:bg-stone-700 flex items-center justify-center hover:bg-accent hover:text-white shadow-sm"
                                >
                                   <span className="material-symbols-outlined text-lg">download</span>
                                </button>
                                <button 
                                  onClick={(e) => deleteConsultation(e, save.id)}
                                  className="size-8 md:size-10 rounded-xl bg-white dark:bg-stone-700 flex items-center justify-center hover:bg-red-500 hover:text-white shadow-sm"
                                >
                                   <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                              </div>
                              <h4 className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-stone-900 dark:text-white line-clamp-1 mb-3 md:mb-4 group-hover:text-accent transition-colors pr-12">
                                 {save.query}
                              </h4>
                              <p className="text-[11px] md:text-[12px] text-stone-400 line-clamp-2 italic font-medium leading-relaxed">
                                 {save.text}
                              </p>
                              <div className="mt-6 md:mt-8 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-all duration-500">
                                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-stone-400">{new Date(save.timestamp).toLocaleDateString()}</span>
                                 <div className="size-8 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                 </div>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-[0.08] py-20 grayscale">
                           <span className="material-symbols-outlined text-[80px] md:text-[100px] mb-8">bookmark_add</span>
                           <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">Sin Archivos</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {(activeTab === 'informes' || activeTab === 'comentarios') && (
          <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[3rem] lg:rounded-[5rem] p-16 md:p-40 flex flex-col items-center justify-center text-center opacity-40 h-[500px] md:h-[700px] shadow-sm">
             <div className="size-24 md:size-40 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mb-8 md:mb-12">
               <span className="material-symbols-outlined text-[60px] md:text-[80px] text-stone-200">
                  {activeTab === 'informes' ? 'description' : 'forum'}
               </span>
             </div>
             <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-stone-400 leading-none">Módulo en Desarrollo</h3>
             <p className="text-stone-400 font-medium mt-6 md:mt-8 italic max-w-sm text-sm md:text-lg leading-relaxed px-6">Espacio en fase de auditoría técnica y diseño regional.</p>
          </div>
        )}
      </div>

      <style>{`
        .fill-1 { font-variation-settings: 'FILL' 1; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @media print { .print\\:hidden { display: none !important; } }
      `}</style>
    </div>
  );
};
