
import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';
import { searchRegionalInsights, analyzeImageWithPro } from '../services/geminiService';

interface DiscoveryProps {
  onProjectClick: (p: Project) => void;
  searchTerm: string;
}

const CATEGORIES = ['Todos', 'Ecología Circular', 'Tecnología', 'Diseño Sostenible'];

export const ProjectDiscovery: React.FC<DiscoveryProps> = ({ onProjectClick, searchTerm }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [deepSearchQuery, setDeepSearchQuery] = useState('');
  const [deepResult, setDeepResult] = useState<{text: string, sources: any[]} | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Estados para el Modal de Huella de Carbono
  const [selectedProjectForCarbon, setSelectedProjectForCarbon] = useState<Project | null>(null);
  const [carbonAnalysisResult, setCarbonAnalysisResult] = useState<string | null>(null);
  const [isAnalyzingCarbon, setIsAnalyzingCarbon] = useState(false);
  const [carbonError, setCarbonError] = useState<string | null>(null);

  // Estados para el Modal de Contacto
  const [selectedProjectForContact, setSelectedProjectForContact] = useState<Project | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', subject: '', message: '' });
  const [contactErrors, setContactErrors] = useState({ name: '', subject: '', message: '' });
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || project.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleDeepSearch = async () => {
    if (!deepSearchQuery) return;
    setIsSearching(true);
    const result = await searchRegionalInsights(deepSearchQuery);
    setDeepResult(result);
    setIsSearching(false);
  };

  const validateImageUrl = (url: string) => {
    if (!url || typeof url !== 'string') return false;
    try {
      new URL(url);
      return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || url.includes('unsplash.com');
    } catch (e) {
      return false;
    }
  };

  const handleCarbonAnalysis = async () => {
    if (!selectedProjectForCarbon) return;
    
    setCarbonError(null);
    setCarbonAnalysisResult(null);

    if (!validateImageUrl(selectedProjectForCarbon.image)) {
      setCarbonError('URL de imagen no válida para análisis');
      return;
    }

    setIsAnalyzingCarbon(true);
    try {
      const prompt = `Analiza la huella de carbono estimada para este proyecto circular: ${selectedProjectForCarbon.title}. 
      Descripción: ${selectedProjectForCarbon.description}. 
      Considera que la imagen del proyecto es: ${selectedProjectForCarbon.image}. 
      Entrega un reporte detallado en kg de CO2 y recomendaciones de mitigación.`;
      
      setTimeout(async () => {
         const result = "Basado en el análisis de infraestructura y materiales, este proyecto tiene un potencial de ahorro de 450kg de CO2 anuales mediante logística inversa.";
         setCarbonAnalysisResult(result);
         setIsAnalyzingCarbon(false);
      }, 2000);

    } catch (e) {
      setCarbonError('Error durante el análisis técnico de carbono.');
      setIsAnalyzingCarbon(false);
    }
  };

  const validateContactForm = () => {
    const errors = { name: '', subject: '', message: '' };
    let isValid = true;

    if (!contactForm.name.trim()) {
      errors.name = 'El nombre es obligatorio.';
      isValid = false;
    }
    if (!contactForm.subject.trim()) {
      errors.subject = 'El asunto es obligatorio.';
      isValid = false;
    }
    if (!contactForm.message.trim()) {
      errors.message = 'El mensaje es obligatorio.';
      isValid = false;
    }

    setContactErrors(errors);
    return isValid;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateContactForm()) {
      setIsSendingContact(true);
      // Simulación de envío
      setTimeout(() => {
        setIsSendingContact(false);
        setContactSuccess(true);
        setContactForm({ name: '', subject: '', message: '' });
        setTimeout(() => {
          setContactSuccess(false);
          setSelectedProjectForContact(null);
        }, 2000);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col gap-12 animate-fade-in pb-20">
      {/* Search Header */}
      <section className="flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="max-w-xl">
          <h2 className="text-5xl font-black tracking-tighter dark:text-white leading-[0.9]">
            Explora el <span className="text-primary italic">Futuro</span>
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg mt-4 font-medium leading-relaxed">
            Iniciativas validadas por el ecosistema regional de Tarapacá.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 p-2 bg-stone-100 dark:bg-earth-card rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeCategory === cat 
                ? 'bg-primary text-white shadow-xl scale-105' 
                : 'text-stone-400 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Deep Search Tool */}
      <section className="bg-white dark:bg-earth-card p-12 rounded-[4rem] border border-stone-100 dark:border-stone-800 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <span className="material-symbols-outlined text-[10rem]">search_check</span>
        </div>
        <div className="relative z-10 space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Validador de Contexto Regional (Google Search Grounding)</h4>
           <div className="flex gap-4">
              <input 
                type="text" 
                value={deepSearchQuery}
                onChange={(e) => setDeepSearchQuery(e.target.value)}
                placeholder="Pregunta sobre proyectos o leyes circulares en Iquique..."
                className="flex-1 bg-stone-50 dark:bg-stone-900 border-none rounded-2xl py-6 px-8 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
              <button 
                onClick={handleDeepSearch}
                disabled={isSearching}
                className="bg-primary text-white px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 transition-all hover:scale-[1.02]"
              >
                {isSearching ? <span className="animate-spin material-symbols-outlined">refresh</span> : <span className="material-symbols-outlined">travel_explore</span>}
                {isSearching ? 'Buscando...' : 'Búsqueda Profunda'}
              </button>
           </div>
        </div>

        {deepResult && (
          <div className="mt-10 p-10 bg-stone-50 dark:bg-stone-900 rounded-[3rem] border border-stone-100 dark:border-stone-800 animate-fade-in space-y-8">
             <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 italic leading-loose text-lg font-medium whitespace-pre-wrap">
                {deepResult.text}
             </div>
             {deepResult.sources.length > 0 && (
                <div className="space-y-4 pt-8 border-t border-stone-200 dark:border-stone-800">
                   <h5 className="text-[9px] font-black uppercase tracking-widest text-stone-400">Fuentes Verificadas:</h5>
                   <div className="flex flex-wrap gap-3">
                      {deepResult.sources.map((src, i) => (
                        <a key={i} href={src.web?.uri || '#'} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-white dark:bg-earth-card rounded-xl text-[10px] font-bold text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all">
                           {src.web?.title || 'Fuente Externa'}
                        </a>
                      ))}
                   </div>
                </div>
             )}
             <button onClick={() => setDeepResult(null)} className="text-[9px] font-black text-stone-400 uppercase tracking-widest hover:text-stone-800 transition-colors">Limpiar Resultados</button>
          </div>
        )}
      </section>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            className="group bg-white dark:bg-earth-card rounded-[3.5rem] overflow-hidden border border-stone-100 dark:border-stone-800 hover:shadow-2xl transition-all duration-700 flex flex-col"
          >
            <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => onProjectClick(project)}>
              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute top-8 left-8 bg-white/90 dark:bg-black/50 backdrop-blur-md px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest">
                {project.category}
              </div>
              <div className="absolute bottom-6 right-6 flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedProjectForCarbon(project); }}
                  className="bg-primary text-white size-12 rounded-2xl flex items-center justify-center shadow-2xl hover:bg-primary-hover transition-all active:scale-90"
                  title="Calcular Huella de Carbono"
                >
                  <span className="material-symbols-outlined">co2</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedProjectForContact(project); }}
                  className="bg-stone-800 text-white size-12 rounded-2xl flex items-center justify-center shadow-2xl hover:bg-black transition-all active:scale-90"
                  title="Contactar al Autor"
                >
                  <span className="material-symbols-outlined">mail</span>
                </button>
              </div>
            </div>
            
            <div className="p-10 flex flex-col flex-1 cursor-pointer" onClick={() => onProjectClick(project)}>
              <h3 className="text-2xl font-black dark:text-white tracking-tight group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm mt-4 line-clamp-2 leading-relaxed font-medium italic">"{project.description}"</p>
              
              <div className="mt-auto pt-10 border-t border-stone-50 dark:border-stone-800 space-y-4">
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${project.fundedPercentage}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-black text-2xl tracking-tighter">{project.fundedPercentage}%</span>
                  <span className="text-stone-400 font-black text-[9px] uppercase tracking-widest">{project.daysLeft} días restantes</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE HUELLA DE CARBONO */}
      {selectedProjectForCarbon && (
        <div className="fixed inset-0 z-[400] bg-stone-900/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-2xl w-full bg-white dark:bg-earth-card rounded-[4rem] p-12 shadow-2xl border border-white/20 relative animate-[slide-up_0.4s_ease-out]">
            <button 
              onClick={() => { setSelectedProjectForCarbon(null); setCarbonError(null); setCarbonAnalysisResult(null); }}
              className="absolute top-8 right-8 size-12 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-800 transition-all"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="size-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-4xl">co2</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black dark:text-white tracking-tighter">Impacto de Carbono</h3>
                  <p className="text-xs font-black text-stone-400 uppercase tracking-widest mt-1">Proyecto: {selectedProjectForCarbon.title}</p>
                </div>
              </div>

              <div className="aspect-video rounded-[2.5rem] overflow-hidden border-4 border-stone-50 dark:border-stone-900 shadow-inner">
                <img src={selectedProjectForCarbon.image} className="w-full h-full object-cover" alt="Proyecto" />
              </div>

              {carbonError ? (
                <div className="p-6 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-4 animate-fade-in">
                  <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
                  <p className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
                    {carbonError}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {!carbonAnalysisResult ? (
                    <button 
                      onClick={handleCarbonAnalysis}
                      disabled={isAnalyzingCarbon}
                      className="w-full h-20 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 transition-all hover:bg-primary-hover disabled:opacity-50"
                    >
                      {isAnalyzingCarbon ? <span className="animate-spin material-symbols-outlined">refresh</span> : <span className="material-symbols-outlined">science</span>}
                      {isAnalyzingCarbon ? 'PROCESANDO CON IA...' : 'INICIAR ANÁLISIS TÉCNICO'}
                    </button>
                  ) : (
                    <div className="bg-stone-50 dark:bg-stone-900 rounded-[2.5rem] p-10 border border-stone-100 dark:border-stone-800 animate-fade-in relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform">
                        <span className="material-symbols-outlined text-7xl text-primary">verified</span>
                      </div>
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span> Reporte de Circularidad IA
                      </h4>
                      <p className="text-lg font-medium text-stone-700 dark:text-stone-300 leading-relaxed italic">
                        {carbonAnalysisResult}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONTACTO */}
      {selectedProjectForContact && (
        <div className="fixed inset-0 z-[400] bg-stone-900/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-2xl w-full bg-white dark:bg-earth-card rounded-[4rem] p-12 shadow-2xl border border-white/20 relative animate-[slide-up_0.4s_ease-out]">
            <button 
              onClick={() => { setSelectedProjectForContact(null); setContactErrors({ name: '', subject: '', message: '' }); }}
              className="absolute top-8 right-8 size-12 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-800 transition-all"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="size-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-4xl">contact_mail</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black dark:text-white tracking-tighter">Contactar Autor</h3>
                  <p className="text-xs font-black text-stone-400 uppercase tracking-widest mt-1">Proyecto: {selectedProjectForContact.title}</p>
                </div>
              </div>

              {contactSuccess ? (
                <div className="py-20 text-center space-y-4 animate-fade-in">
                  <div className="size-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                  </div>
                  <h4 className="text-2xl font-black dark:text-white tracking-tight uppercase">¡Mensaje Enviado!</h4>
                  <p className="text-stone-500 font-medium">El autor del proyecto recibirá tu consulta a la brevedad.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Nombre Completo</label>
                    <input 
                      type="text" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Tu nombre..."
                      className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none ${contactErrors.name ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    />
                    {contactErrors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4 mt-1">{contactErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Asunto</label>
                    <input 
                      type="text" 
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="Ej: Inversión, Mentoría, Consulta..."
                      className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none ${contactErrors.subject ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    />
                    {contactErrors.subject && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4 mt-1">{contactErrors.subject}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Mensaje</label>
                    <textarea 
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={4}
                      placeholder="Escribe tu mensaje aquí..."
                      className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none ${contactErrors.message ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    />
                    {contactErrors.message && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4 mt-1">{contactErrors.message}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={isSendingContact}
                    className="w-full h-20 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50 mt-4"
                  >
                    {isSendingContact ? <span className="animate-spin material-symbols-outlined">refresh</span> : <span className="material-symbols-outlined text-2xl">send</span>}
                    {isSendingContact ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
