
import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';
import { estimateCarbonImpact } from '../services/geminiService';

interface DiscoveryProps {
  onProjectClick: (p: Project) => void;
  searchTerm: string;
}

export const ProjectDiscovery: React.FC<DiscoveryProps> = ({ onProjectClick, searchTerm }) => {
  const [activeTab, setActiveTab] = useState('Todos');
  const [calculatingProject, setCalculatingProject] = useState<Project | null>(null);
  const [carbonData, setCarbonData] = useState<{ co2: number, water: number, waste: number, level: string, summary: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingFootprint, setIsLoadingFootprint] = useState(false);
  const [hoveredFootprintId, setHoveredFootprintId] = useState<string | null>(null);

  // Estados para el contacto con emprendedor
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactProject, setContactProject] = useState<Project | null>(null);
  const [contactForm, setContactForm] = useState({ message: '' });
  const [isSending, setIsSending] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const categories = ['Todos', 'Tecnología', 'Arte', 'Impacto Social', 'Ecología Circular'];

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(project => {
      const matchesCategory = activeTab === 'Todos' || project.category === activeTab;
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  const handleCalculateFootprint = async (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setCalculatingProject(project);
    setIsModalOpen(true);
    setIsLoadingFootprint(true);
    setCarbonData(null);

    const result = await estimateCarbonImpact(project.title, project.description);
    if (result) {
      setCarbonData(result);
    }
    setIsLoadingFootprint(false);
  };

  const handleOpenContact = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setContactProject(project);
    setValidationError(null);
    setIsContactModalOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación: mensaje no vacío
    if (!contactForm.message.trim()) {
      setValidationError('El mensaje no puede estar vacío.');
      return;
    }

    setValidationError(null);
    setIsSending(true);
    
    // Simulación de envío
    setTimeout(() => {
      setIsSending(false);
      setIsContactModalOpen(false);
      setContactForm({ message: '' });
      alert('Mensaje enviado con éxito al emprendedor.');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in relative">
      <section className="flex flex-col gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold tracking-tight dark:text-white">
            Explora el ecosistema <span className="text-primary">CONECTARAPAK</span>
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg mt-2">
            Descubre y apoya proyectos innovadores impulsados por nuestra comunidad y asistidos por IA.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === cat 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => onProjectClick(project)}
              className="group bg-white dark:bg-earth-card rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                  {project.category}
                </div>
                
                <div 
                  className="absolute bottom-4 right-4 z-20"
                  onMouseEnter={() => setHoveredFootprintId(project.id)}
                  onMouseLeave={() => setHoveredFootprintId(null)}
                >
                  <button 
                    onClick={(e) => handleCalculateFootprint(e, project)}
                    className="size-10 bg-primary/90 hover:bg-primary text-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  >
                    <span className="material-symbols-outlined text-xl">eco</span>
                  </button>

                  {hoveredFootprintId === project.id && (
                    <div className="absolute bottom-full right-0 mb-4 w-56 bg-white/95 dark:bg-earth-card/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-stone-100 dark:border-white/10 animate-[fade-up_0.2s_ease-out] pointer-events-none origin-bottom-right">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Huella de Carbono</span>
                       </div>
                       <p className="text-[10px] font-medium text-stone-500 dark:text-stone-300 leading-relaxed">
                         Calcula el impacto ambiental del proyecto con IA.
                       </p>
                       <div className="absolute top-full right-4 w-3 h-3 bg-white/95 dark:bg-earth-card/95 rotate-45 -mt-1.5 border-r border-b border-stone-100 dark:border-white/10"></div>
                    </div>
                  )}
                </div>
                
                <button className="absolute top-4 right-4 size-8 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-500 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-xl">favorite</span>
                </button>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm mt-3 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* BOTÓN CONTACTAR EMPRENDEDOR */}
                <button 
                  onClick={(e) => handleOpenContact(e, project)}
                  className="mt-6 w-full py-3 px-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">forum</span>
                  Contactar al Emprendedor
                </button>
                
                <div className="mt-auto pt-6 space-y-4">
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(project.fundedPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-primary font-extrabold text-lg">{project.fundedPercentage}%</p>
                      <p className="text-[10px] uppercase font-bold text-stone-400">Financiado</p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-800 dark:text-stone-200 font-bold text-lg">{project.daysLeft}</p>
                      <p className="text-[10px] uppercase font-bold text-stone-400">Días restantes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-earth-card rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
           <span className="material-symbols-outlined text-5xl text-stone-300 mb-4">search_off</span>
           <p className="text-stone-500 dark:text-stone-400 font-bold">No encontramos proyectos que coincidan con tu búsqueda.</p>
           <button onClick={() => { setActiveTab('Todos'); }} className="mt-4 text-primary font-bold hover:underline">Limpiar filtros</button>
        </div>
      )}

      {/* Modal de Huella de Carbono */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-earth-card w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-stone-800">
            <div className="p-8 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-3xl">analytics</span>
                </div>
                <div>
                  <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Impacto Ambiental IA</h3>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Estimación predictiva por Gemini</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="size-10 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-400 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {isLoadingFootprint ? (
                <div className="flex flex-col items-center justify-center py-12 gap-6">
                  <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-lg font-bold text-stone-500 animate-pulse">Analizando ciclo de vida del proyecto...</p>
                </div>
              ) : carbonData ? (
                <div className="animate-fade-in space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 text-center">
                      <span className="material-symbols-outlined text-primary text-3xl mb-2">co2</span>
                      <p className="text-2xl font-black dark:text-white">{carbonData.co2}kg</p>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">CO2 Evitado / Año</p>
                    </div>
                    <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 text-center">
                      <span className="material-symbols-outlined text-blue-500 text-3xl mb-2">water_drop</span>
                      <p className="text-2xl font-black dark:text-white">{carbonData.water}L</p>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Agua Ahorrada / Año</p>
                    </div>
                    <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 text-center">
                      <span className="material-symbols-outlined text-amber-500 text-3xl mb-2">delete_sweep</span>
                      <p className="text-2xl font-black dark:text-white">{carbonData.waste}kg</p>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Residuos Reducidos</p>
                    </div>
                  </div>

                  <div className="p-8 bg-earth-surface text-white rounded-[2.5rem] relative overflow-hidden">
                    <div className={`absolute top-4 right-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      carbonData.level === 'Alto' ? 'bg-green-500' : carbonData.level === 'Medio' ? 'bg-blue-500' : 'bg-stone-500'
                    }`}>
                      Impacto: {carbonData.level}
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">auto_awesome</span> Análisis de Sostenibilidad
                    </h4>
                    <p className="text-sm leading-relaxed text-stone-300 font-medium italic">
                      "{carbonData.summary}"
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                      Apoyar este impacto
                    </button>
                    <button className="flex-1 py-4 bg-stone-100 dark:bg-stone-800 text-stone-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all">
                      Ver metodología
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-red-500 font-bold">
                   Error al obtener el cálculo. Por favor intenta de nuevo.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONTACTO CON EMPRENDEDOR */}
      {isContactModalOpen && contactProject && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-earth-card w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
            <div className="p-8 bg-stone-50 dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">contact_mail</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black dark:text-white tracking-tighter">Contactar Emprendedor</h3>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                    Enviando mensaje a {contactProject.author}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="size-10 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-400 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block ml-2">Destinatario</label>
                  <div className="bg-stone-50 dark:bg-stone-800/50 py-4 px-6 rounded-2xl text-sm font-bold text-stone-600 dark:text-stone-300 border border-stone-100 dark:border-stone-800">
                    {contactProject.author.toLowerCase().replace(/\s/g, '')}@conectarapak.cl
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block ml-2">Asunto del Proyecto</label>
                  <div className="bg-stone-50 dark:bg-stone-800/50 py-4 px-6 rounded-2xl text-sm font-bold text-stone-600 dark:text-stone-300 border border-stone-100 dark:border-stone-800">
                    Interés en: {contactProject.title}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block ml-2">Tu Mensaje</label>
                  <textarea 
                    required
                    value={contactForm.message}
                    onChange={(e) => {
                      setContactForm({ ...contactForm, message: e.target.value });
                      if (e.target.value.trim()) setValidationError(null);
                    }}
                    placeholder="Escribe tu propuesta o consulta para el emprendedor..."
                    className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-2xl py-4 px-6 text-sm dark:text-white h-40 resize-none transition-all ${
                      validationError ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-primary'
                    }`}
                  />
                  {validationError && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-2">
                      {validationError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex-1 py-4 bg-stone-100 dark:bg-stone-800 text-stone-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSending || !contactForm.message.trim()}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                >
                  {isSending ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined">send</span>
                  )}
                  {isSending ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
