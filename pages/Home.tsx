
import React, { useState, useMemo, useRef } from 'react';
import { MOCK_NEWS, MAP_ACTORS as INITIAL_MAP_ACTORS, SPONSORS } from '../constants';

export const Home: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
  const [mapActors, setMapActors] = useState(INITIAL_MAP_ACTORS);
  const [activeActor, setActiveActor] = useState<typeof INITIAL_MAP_ACTORS[0] | null>(null);
  const [mapFilter, setMapFilter] = useState<string>('Todos');
  
  // Estados para el Registro de Aliados
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regStep, setRegStep] = useState(1); // 1: Info, 2: Location, 3: IA Audit
  const [newActor, setNewActor] = useState({
    name: '',
    type: 'Privado',
    impact: '',
    x: '50%',
    y: '50%',
    icon: 'business'
  });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Silueta SVG simplificada de la Región de Tarapacá
  const TarapacaPath = "M45,10 L55,15 L65,25 L70,45 L68,65 L60,85 L45,95 L35,80 L32,60 L35,40 L38,20 Z";

  const filterOptions = [
    { type: 'Todos', color: 'bg-stone-500', icon: 'apps' },
    { type: 'Público', color: 'bg-blue-500', icon: 'account_balance' },
    { type: 'Privado', color: 'bg-green-500', icon: 'corporate_fare' },
    { type: 'Académico', color: 'bg-purple-500', icon: 'school' },
    { type: 'Gremio', color: 'bg-amber-500', icon: 'inventory_2' },
    { type: 'ONG', color: 'bg-rose-500', icon: 'favorite' }
  ];

  const filteredActors = useMemo(() => {
    if (mapFilter === 'Todos') return mapActors;
    return mapActors.filter(actor => actor.type === mapFilter);
  }, [mapFilter, mapActors]);

  const getCount = (type: string) => {
    if (type === 'Todos') return mapActors.length;
    return mapActors.filter(a => a.type === type).length;
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (regStep !== 2 || !mapContainerRef.current) return;
    
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setNewActor(prev => ({ ...prev, x: `${x.toFixed(1)}%`, y: `${y.toFixed(1)}%` }));
  };

  const startIAAduit = () => {
    setRegStep(3);
    setTimeout(() => {
      const actorToAdd = {
        id: mapActors.length + 1,
        ...newActor,
        status: 'pending'
      };
      setMapActors(prev => [...prev, actorToAdd as any]);
      setRegStep(4); // Success
    }, 3000);
  };

  const resetRegistration = () => {
    setIsRegModalOpen(false);
    setRegStep(1);
    setNewActor({ name: '', type: 'Privado', impact: '', x: '50%', y: '50%', icon: 'business' });
  };

  // Duplicamos los sponsors para el efecto de scroll infinito
  const infiniteSponsors = [...SPONSORS, ...SPONSORS];

  return (
    <div className="flex flex-col animate-fade-in -mt-10 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden rounded-b-[4rem] shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1518005020251-582964841930?auto=format&fit=crop&q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Smart City Landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-surface/90 via-earth-surface/40 to-transparent"></div>
        
        <div className="relative z-10 max-w-[1440px] w-full px-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-light text-xs font-bold uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Inteligencia Territorial
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] font-display">
              CONECTARA<br/><span className="text-primary italic">PAK</span> SMART
            </h1>
            <p className="text-xl text-stone-200 font-medium max-w-xl leading-relaxed">
              Plataforma de aceleración para el desarrollo sostenible y la economía circular. Conectamos talento, tecnología e impacto en un solo ecosistema inteligente.
            </p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setView('discovery')}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-hover transition-all flex items-center gap-2 shadow-xl shadow-primary/20"
              >
                Explorar Proyectos <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button 
                onClick={() => setView('education')}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all"
              >
                Academia Circular
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-24 px-10 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Mapeo de Impacto</h2>
              <h3 className="text-5xl font-extrabold dark:text-white tracking-tighter">Actores de la <span className="text-stone-400">Región</span></h3>
              <p className="text-stone-500 dark:text-stone-400 mt-6 text-lg leading-relaxed font-medium">
                Visualiza la red de colaboración que impulsa la sustentabilidad en Tarapacá. Articulamos el sector público, privado, la academia y la ciudadanía en un mapa interactivo inteligente.
              </p>
            </div>

            <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-primary">Filtros de Red Territorial</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filterOptions.map((item) => {
                  const isActive = mapFilter === item.type;
                  const count = getCount(item.type);
                  return (
                    <button
                      key={item.type}
                      onClick={() => setMapFilter(item.type)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                        isActive 
                          ? `${item.type === 'Todos' ? 'bg-stone-700' : item.color} text-white border-transparent shadow-lg scale-[1.05]` 
                          : 'bg-white dark:bg-earth-card border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-primary/50'
                      }`}
                    >
                      <div className={`size-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor] ${isActive ? 'bg-white' : item.color}`}></div>
                      <div className="flex flex-col items-start leading-none overflow-hidden text-left">
                        <span className="text-[9px] font-black uppercase tracking-widest truncate">{item.type}</span>
                        <span className={`text-[7px] font-bold mt-1 ${isActive ? 'text-white/70' : 'text-stone-400'}`}>{count} Nodos</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-10 bg-earth-surface text-white rounded-[3rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-20 -mr-20 -mt-20 bg-primary/20 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
               <div className="relative z-10 flex flex-col gap-6">
                 <div>
                   <h4 className="text-xl font-black mb-2">¿Tu organización es circular?</h4>
                   <p className="text-stone-400 text-xs font-medium leading-relaxed">Súmate a la red más grande de impacto en el norte de Chile y obtén visibilidad ante inversores y el sector público.</p>
                 </div>
                 <button 
                  onClick={() => setIsRegModalOpen(true)}
                  className="bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                 >
                   <span className="material-symbols-outlined text-base">add_location_alt</span>
                   Sumar mi Organización
                 </button>
               </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div 
              ref={mapContainerRef}
              onClick={handleMapClick}
              className={`relative bg-stone-100 dark:bg-stone-900 rounded-[4rem] aspect-square lg:aspect-video overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xl transition-all duration-500
                ${regStep === 2 ? 'ring-8 ring-primary/20 cursor-crosshair' : ''}
              `}
            >
              {/* Overlay para el paso de ubicación */}
              {regStep === 2 && (
                <div className="absolute inset-0 z-40 bg-primary/10 pointer-events-none flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-primary/20 animate-bounce">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Haz clic en el mapa para marcar tu sede</p>
                  </div>
                </div>
              )}

              {/* Background Map Shape */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-40">
                <svg className="h-[90%] w-auto text-primary/20" viewBox="0 0 100 100" fill="currentColor">
                  <path d={TarapacaPath} />
                </svg>
              </div>

              {/* Actor Markers */}
              {filteredActors.map((actor) => {
                const isVisible = mapFilter === 'Todos' || actor.type === mapFilter;
                return (
                  <div 
                    key={actor.id}
                    className={`absolute cursor-pointer transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}
                    style={{ left: actor.x, top: actor.y }}
                    onMouseEnter={() => setActiveActor(actor)}
                    onMouseLeave={() => setActiveActor(null)}
                  >
                    <div className="relative">
                      {isVisible && (
                        <div className={`size-12 rounded-full animate-ping absolute -left-1 -top-1 opacity-50 ${
                           actor.type === 'Privado' ? 'bg-green-500' : actor.type === 'Académico' ? 'bg-purple-500' : actor.type === 'Público' ? 'bg-blue-500' : 'bg-rose-500'
                        }`}></div>
                      )}
                      <div className={`size-10 rounded-2xl shadow-xl flex items-center justify-center border-2 transition-all duration-300 z-10 relative
                        ${activeActor?.id === actor.id ? 'scale-125 bg-primary text-white border-white' : 'bg-white dark:bg-earth-card text-stone-800 dark:text-stone-200 border-white dark:border-stone-800'}
                      `}>
                        <span className="material-symbols-outlined text-xl font-bold">{actor.icon}</span>
                      </div>
                      
                      {activeActor?.id === actor.id && (
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 bg-white dark:bg-earth-surface p-5 rounded-3xl shadow-2xl border border-stone-100 dark:border-white/10 z-50">
                            <h4 className="text-sm font-black dark:text-white">{actor.name}</h4>
                            <p className="text-[9px] text-stone-400 font-bold uppercase mt-1 tracking-widest">{actor.type}</p>
                         </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">hub</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest leading-none">Mapa Smart Tarapacá</p>
                    <p className="text-[9px] text-stone-300 mt-1 uppercase tracking-widest font-bold">{filteredActors.length} Nodos Visibles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborators and Sponsors Section (OPTIMIZADA) */}
      <section className="bg-white dark:bg-earth-surface py-24 overflow-hidden border-y border-stone-100 dark:border-stone-800">
        <div className="max-w-[1440px] mx-auto px-10 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Propósito Compartido</h2>
              <h3 className="text-6xl font-extrabold dark:text-white tracking-tighter leading-[0.9]">
                Nuestros <span className="text-stone-400">Aliados Estratégicos</span>
              </h3>
            </div>
            <p className="text-stone-500 dark:text-stone-400 max-w-sm font-medium text-sm leading-relaxed">
              Instituciones y corporaciones comprometidas con la regeneración económica de la Región de Tarapacá.
            </p>
          </div>
        </div>

        {/* Marquee de Logos */}
        <div className="relative flex gap-10 overflow-hidden select-none group/marquee">
          <div className="flex shrink-0 items-center justify-around gap-10 min-w-full animate-[marquee_40s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
            {infiniteSponsors.map((sponsor, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center justify-center p-8 bg-white dark:bg-earth-card border border-stone-100 dark:border-stone-800 rounded-[2.5rem] w-64 h-48 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group/card cursor-pointer"
              >
                <div className="h-20 w-full flex items-center justify-center grayscale group-hover/card:grayscale-0 transition-all duration-700 opacity-40 group-hover/card:opacity-100">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(sponsor.name)}&background=f0f0f0&color=599E39&bold=true&font-size=0.35`;
                    }}
                  />
                </div>
                <div className="mt-6 text-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{sponsor.name}</p>
                   <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Aliado de Impacto</p>
                </div>
                <div className="absolute bottom-4 right-6 size-2 rounded-full bg-primary/20 group-hover/card:bg-primary transition-colors"></div>
              </div>
            ))}
          </div>
          {/* Sombra de desvanecimiento lateral */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-earth-surface to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-earth-surface to-transparent z-10 pointer-events-none"></div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        <div className="mt-20 flex justify-center px-10">
           <div className="bg-primary/5 border border-primary/20 p-8 rounded-[3rem] w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-6">
                 <div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                    <span className="material-symbols-outlined text-3xl">handshake</span>
                 </div>
                 <div className="max-w-md">
                    <h4 className="text-xl font-black dark:text-white">Forma parte de la Red Global de Tarapacá</h4>
                    <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mt-1">Integra tu compañía en el mapeo regional y colabora en proyectos de alto impacto circular.</p>
                 </div>
              </div>
              <button 
                onClick={() => setView('contact')}
                className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 whitespace-nowrap"
              >
                Solicitar Alianza
              </button>
           </div>
        </div>
      </section>

      {/* MODAL DE REGISTRO DE ALIADOS */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-earth-surface/90 backdrop-blur-xl animate-fade-in">
          <div className="max-w-xl w-full bg-white dark:bg-earth-card rounded-[3rem] p-10 shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 -mr-20 -mt-20 bg-primary/10 rounded-full blur-3xl"></div>
            
            <button onClick={resetRegistration} className="absolute top-8 right-8 text-stone-400 hover:text-stone-600">
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Step 1: Basic Info */}
            {regStep === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <h3 className="text-3xl font-black dark:text-white tracking-tighter">Únete a la Red</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm mt-2 font-medium">Registro conciso para organizaciones de impacto.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block ml-2">Nombre de la Organización</label>
                    <input 
                      type="text" 
                      value={newActor.name}
                      onChange={(e) => setNewActor({...newActor, name: e.target.value})}
                      placeholder="Ej: EcoFábrica Tarapacá"
                      className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block ml-2">Tipo de Actor</label>
                    <select 
                      value={newActor.type}
                      onChange={(e) => setNewActor({...newActor, type: e.target.value})}
                      className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary dark:text-white appearance-none"
                    >
                      <option>Público</option>
                      <option>Privado</option>
                      <option>Académico</option>
                      <option>Gremio</option>
                      <option>ONG</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block ml-2">Propósito Circular (Breve)</label>
                    <textarea 
                      value={newActor.impact}
                      onChange={(e) => setNewActor({...newActor, impact: e.target.value})}
                      placeholder="¿Cómo contribuyes a la región?"
                      className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary dark:text-white h-24 resize-none"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setRegStep(2)}
                  disabled={!newActor.name || !newActor.impact}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50"
                >
                  Siguiente: Ubicar en el Mapa
                </button>
              </div>
            )}

            {/* Step 2: Visual Location */}
            {regStep === 2 && (
              <div className="space-y-8 animate-fade-in text-center">
                <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                  <span className="material-symbols-outlined text-4xl">pin_drop</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black dark:text-white tracking-tighter">¿Dónde están ubicados?</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm mt-2 font-medium">Haz clic directamente sobre el mapa que ves al fondo para marcar tu posición.</p>
                </div>
                <div className="flex justify-center items-center gap-4 p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl">
                   <div className="text-left">
                     <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Coordenadas Smart</p>
                     <p className="text-sm font-bold dark:text-white">X: {newActor.x} / Y: {newActor.y}</p>
                   </div>
                   <div className="size-2 bg-primary rounded-full animate-pulse"></div>
                </div>
                <button 
                  onClick={startIAAduit}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl"
                >
                  Finalizar & Validar con IA
                </button>
              </div>
            )}

            {/* Step 3: IA Audit Animation */}
            {regStep === 3 && (
              <div className="space-y-8 animate-fade-in text-center py-10">
                <div className="size-32 border-8 border-primary/20 border-t-primary rounded-full animate-spin mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary animate-pulse">psychology</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black dark:text-white tracking-tighter uppercase tracking-widest">Auditoría Gemini Smart</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm mt-4 font-bold animate-pulse">Analizando coherencia de impacto y veracidad territorial...</p>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {regStep === 4 && (
              <div className="space-y-8 animate-fade-in text-center">
                <div className="size-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-green-500/20">
                  <span className="material-symbols-outlined text-5xl">verified</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black dark:text-white tracking-tighter">¡Nodo Registrado!</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm mt-2 font-medium">Tu organización ya es visible en el mapa en modo "Pendiente de Validación".</p>
                </div>
                <button 
                  onClick={resetRegistration}
                  className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                >
                  Volver al Mapa
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Regional News Section */}
      <section className="bg-stone-50 dark:bg-earth-dark py-24 px-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Actualidad Tarapacá</h2>
              <h3 className="text-4xl font-extrabold dark:text-white tracking-tighter">Noticias del <span className="text-stone-400">Ecosistema</span></h3>
            </div>
            <button className="hidden md:flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-primary transition-colors">
              Ver todo el archivo <span className="material-symbols-outlined">menu_book</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {MOCK_NEWS.map((news) => (
              <div key={news.id} className="flex flex-col group cursor-pointer">
                <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl bg-stone-100 dark:bg-stone-800 border border-stone-100 dark:border-stone-800">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                  />
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-2 rounded-full bg-white/95 dark:bg-earth-card/95 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] text-primary shadow-lg border border-primary/10">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{news.date}</span>
                    <span className="size-1 bg-stone-300 rounded-full"></span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{news.tag}</span>
                  </div>
                  <h4 className="text-xl font-bold dark:text-white leading-tight group-hover:text-primary transition-colors duration-300">
                    {news.title}
                  </h4>
                  <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed line-clamp-2 font-medium">
                    {news.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-earth-surface py-20">
        <div className="max-w-[1440px] mx-auto px-10 flex flex-wrap justify-between gap-12">
          {[
            { label: 'Proyectos Activos', value: '124+' },
            { label: 'Impacto Circular', value: '85%' },
            { label: 'Fondos Recaudados', value: '$2.4M' },
            { label: 'Usuarios Smart', value: '12k' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="text-6xl font-black text-white font-display">{stat.value}</span>
              <span className="text-stone-500 font-bold uppercase tracking-widest text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
