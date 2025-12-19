
import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';
import { estimateCarbonImpact, analyzeImageWithPro } from '../services/geminiService';

interface DiscoveryProps {
  onProjectClick: (p: Project) => void;
  searchTerm: string;
}

export const ProjectDiscovery: React.FC<DiscoveryProps> = ({ onProjectClick, searchTerm }) => {
  const [calculatingProject, setCalculatingProject] = useState<Project | null>(null);
  const [carbonData, setCarbonData] = useState<{ co2: number, water: number, waste: number, level: string, summary: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingFootprint, setIsLoadingFootprint] = useState(false);

  // Estados para el contacto con emprendedor
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactProject, setContactProject] = useState<Project | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string, subject?: string, message?: string }>({});

  // Análisis de imagen
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageAnalysisResult, setImageAnalysisResult] = useState<string | null>(null);
  const [imageAnalysisError, setImageAnalysisError] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(project => {
      return project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             project.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const handleCalculateFootprint = async (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setCalculatingProject(project);
    setIsModalOpen(true);
    setIsLoadingFootprint(true);
    setCarbonData(null);
    setImageAnalysisResult(null);
    setImageAnalysisError(null);

    const result = await estimateCarbonImpact(project.title, project.description);
    if (result) {
      setCarbonData(result);
    }
    setIsLoadingFootprint(false);
  };

  const handleAnalyzeProjectImage = async (project: Project) => {
    setImageAnalysisError(null);
    
    const isValidUrlForAnalysis = (url: string) => {
      if (!url) return false;
      const isDataUrl = url.startsWith('data:image/');
      const hasComma = url.includes(',');
      return isDataUrl && hasComma;
    };

    if (!isValidUrlForAnalysis(project.image)) {
      setImageAnalysisError("URL de imagen no válida para análisis");
      return;
    }

    setIsAnalyzingImage(true);
    try {
      const analysis = await analyzeImageWithPro(project.image, "¿Cómo contribuye visualmente esta imagen a la percepción de economía circular del proyecto?");
      setImageAnalysisResult(analysis);
    } catch (err) {
      setImageAnalysisError("Error al procesar la imagen con la IA.");
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleOpenContact = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setContactProject(project);
    setFormErrors({});
    setContactForm({ name: '', subject: `Interés en: ${project.title}`, message: '' });
    setIsContactModalOpen(true);
  };

  const validateForm = () => {
    const errors: { name?: string, subject?: string, message?: string } = {};
    if (!contactForm.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!contactForm.subject.trim()) errors.subject = 'El asunto es obligatorio.';
    if (!contactForm.message.trim()) errors.message = 'El mensaje no puede estar vacío.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsContactModalOpen(false);
      setContactForm({ name: '', subject: '', message: '' });
      alert('¡Mensaje enviado con éxito!');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in relative">
      <section className="flex flex-col gap-4">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold tracking-tight dark:text-white">
            Explora el ecosistema <span className="text-primary italic">Tarapacá</span>
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg mt-2 font-medium">
            Propuestas innovadoras impulsadas por nuestra comunidad y validadas por IA.
          </p>
        </div>
      </section>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => onProjectClick(project)}
              className="group bg-white dark:bg-earth-card rounded-[2.5rem] overflow-hidden border border-stone-100 dark:border-stone-800 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 bg-white/95 dark:bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {project.category}
                </div>
                
                <div className="absolute bottom-6 right-6 z-20">
                  <button 
                    onClick={(e) => handleCalculateFootprint(e, project)}
                    className="size-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-all hover:rotate-6"
                  >
                    <span className="material-symbols-outlined text-2xl">eco</span>
                  </button>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-black dark:text-white line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                  {project.title}
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm mt-4 line-clamp-2 leading-relaxed font-medium">
                  {project.description}
                </p>

                <button 
                  onClick={(e) => handleOpenContact(e, project)}
                  className="mt-8 w-full py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  Contactar al Emprendedor
                </button>
                
                <div className="mt-auto pt-8 space-y-4">
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(project.fundedPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-primary font-black text-2xl leading-none">{project.fundedPercentage}%</p>
                      <p className="text-[9px] uppercase font-black text-stone-400 tracking-widest mt-1">Financiado</p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-800 dark:text-stone-200 font-black text-2xl leading-none">{project.daysLeft}</p>
                      <p className="text-[9px] uppercase font-black text-stone-400 tracking-widest mt-1">Días rest.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-earth-card rounded-[3rem] border border-dashed border-stone-200 dark:border-stone-800">
           <span className="material-symbols-outlined text-6xl text-stone-300 mb-4">query_stats</span>
           <p className="text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest text-sm">Sin resultados</p>
        </div>
      )}

      {/* Modal de Huella de Carbono y Análisis */}
      {isModalOpen && calculatingProject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-earth-card w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-stone-800">
            <div className="p-8 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-900/50">
              <div className="flex items-center gap-5">
                <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-3xl">query_stats</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Impacto IA: {calculatingProject.title}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Auditoría inteligente por Gemini Pro</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="size-12 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-400 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {isLoadingFootprint ? (
                <div className="flex flex-col items-center justify-center py-16 gap-6">
                  <div className="size-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-lg font-black text-stone-400 uppercase tracking-widest animate-pulse">Analizando ciclo de vida...</p>
                </div>
              ) : carbonData ? (
                <div className="animate-fade-in space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-stone-50 dark:bg-stone-900 p-8 rounded-[2rem] border border-stone-100 dark:border-stone-800 text-center group hover:bg-primary/5 transition-all">
                      <span className="material-symbols-outlined text-primary text-4xl mb-3 block group-hover:scale-110 transition-transform">co2</span>
                      <p className="text-3xl font-black dark:text-white">{carbonData.co2}kg</p>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">CO2 Evitado / Año</p>
                    </div>
                    <div className="bg-stone-50 dark:bg-stone-900 p-8 rounded-[2rem] border border-stone-100 dark:border-stone-800 text-center group hover:bg-blue-500/5 transition-all">
                      <span className="material-symbols-outlined text-blue-500 text-4xl mb-3 block group-hover:scale-110 transition-transform">water_drop</span>
                      <p className="text-3xl font-black dark:text-white">{carbonData.water}L</p>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Agua Ahorrada / Año</p>
                    </div>
                    <div className="bg-stone-50 dark:bg-stone-900 p-8 rounded-[2rem] border border-stone-100 dark:border-stone-800 text-center group hover:bg-amber-500/5 transition-all">
                      <span className="material-symbols-outlined text-amber-500 text-4xl mb-3 block group-hover:scale-110 transition-transform">recycling</span>
                      <p className="text-3xl font-black dark:text-white">{carbonData.waste}kg</p>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Residuos Reducidos</p>
                    </div>
                  </div>

                  <div className="p-10 bg-earth-surface text-white rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                    <div className={`absolute top-6 right-8 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                      carbonData.level === 'Alto' ? 'bg-green-500 shadow-green-500/30' : carbonData.level === 'Medio' ? 'bg-blue-500 shadow-blue-500/30' : 'bg-stone-500'
                    }`}>
                      Impacto: {carbonData.level}
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl">verified</span> Veredicto de Sostenibilidad
                    </h4>
                    <p className="text-base leading-relaxed text-stone-300 font-medium italic mb-8">
                      "{carbonData.summary}"
                    </p>

                    {imageAnalysisResult ? (
                      <div className="mt-8 pt-8 border-t border-white/10 animate-fade-in">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Auditoría Visual IA</h5>
                        <p className="text-sm text-stone-400 leading-relaxed font-medium">{imageAnalysisResult}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <button 
                          onClick={() => handleAnalyzeProjectImage(calculatingProject)}
                          disabled={isAnalyzingImage}
                          className={`w-full py-4 border-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                            imageAnalysisError ? 'border-red-500 bg-red-500/10 text-red-400 animate-shake' : 'border-primary/40 hover:bg-primary/10 text-white'
                          }`}
                        >
                          {isAnalyzingImage ? (
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                          ) : (
                            <span className="material-symbols-outlined">{imageAnalysisError ? 'error' : 'visibility'}</span>
                          )}
                          {isAnalyzingImage ? 'Escaneando Composición...' : imageAnalysisError ? 'Reintentar Análisis' : 'Analizar propuesta visual con Gemini Pro'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Contacto simplificado */}
      {isContactModalOpen && contactProject && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-white dark:bg-earth-card w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
            <form onSubmit={handleSendMessage} className="p-10 space-y-6">
              <h3 className="text-3xl font-black dark:text-white tracking-tighter">Nueva Consulta</h3>
              <input 
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Nombre..."
                className="w-full bg-stone-50 dark:bg-stone-900/50 border-none rounded-2xl py-4 px-6 text-sm"
              />
              <textarea 
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Mensaje..."
                className="w-full bg-stone-50 dark:bg-stone-900/50 border-none rounded-3xl py-5 px-6 text-sm h-32"
              />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsContactModalOpen(false)} className="flex-1 py-4 bg-stone-100 rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
                <button type="submit" disabled={isSending} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase shadow-lg">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
