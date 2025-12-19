
import React, { useState, useMemo, useRef } from 'react';
import { MOCK_NEWS, MAP_ACTORS as INITIAL_MAP_ACTORS, SPONSORS } from '../constants';

export const Home: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
  const [mapActors, setMapActors] = useState(INITIAL_MAP_ACTORS);
  const [activeActor, setActiveActor] = useState<typeof INITIAL_MAP_ACTORS[0] | null>(null);
  const [mapFilter, setMapFilter] = useState<string>('Todos');
  
  // Estados para el Registro de Aliados
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [newActor, setNewActor] = useState({
    name: '', type: 'Privado', impact: '', x: '50%', y: '50%', icon: 'business'
  });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const TarapacaPath = "M45,10 L55,15 L65,25 L70,45 L68,65 L60,85 L45,95 L35,80 L32,60 L35,40 L38,20 Z";

  const filterOptions = [
    { type: 'Todos', color: 'bg-stone-500', icon: 'apps', border: 'border-stone-500' },
    { type: 'Público', color: 'bg-blue-500', icon: 'account_balance', border: 'border-blue-500' },
    { type: 'Privado', color: 'bg-green-500', icon: 'corporate_fare', border: 'border-green-500' },
    { type: 'Académico', color: 'bg-purple-500', icon: 'school', border: 'border-purple-500' },
    { type: 'Gremio', color: 'bg-amber-500', icon: 'inventory_2', border: 'border-amber-500' },
    { type: 'ONG', color: 'bg-rose-500', icon: 'favorite', border: 'border-rose-500' }
  ];

  const filteredActors = useMemo(() => {
    if (mapFilter === 'Todos') return mapActors;
    return mapActors.filter(actor => actor.type === mapFilter);
  }, [mapFilter, mapActors]);

  const getActorCount = (type: string) => {
    return type === 'Todos' ? mapActors.length : mapActors.filter(a => a.type === type).length;
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
      setMapActors(prev => [...prev, { id: prev.length + 1, ...newActor, status: 'pending' } as any]);
      setRegStep(4);
    }, 3000);
  };

  const resetRegistration = () => {
    setIsRegModalOpen(false);
    setRegStep(1);
    setNewActor({ name: '', type: 'Privado', impact: '', x: '50%', y: '50%', icon: 'business' });
  };

  const infiniteSponsors = [...SPONSORS, ...SPONSORS];

  return (
    <div className="flex flex-col animate-fade-in -mt-10 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden rounded-b-[4rem] shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1518005020251-582964841930?auto=format&fit=crop&q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-surface/90 via-earth-surface/40 to-transparent"></div>
        <div className="relative z-10 max-w-[1440px] w-full px-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-md border border-white/10 text-primary-light text-xs font-black uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Inteligencia Territorial
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] font-display tracking-tighter">
              CONECTARA<br/><span className="text-primary italic">PAK</span> SMART
            </h1>
            <p className="text-xl text-stone-200 font-medium max-w-xl leading-relaxed">
              Plataforma de aceleración para el desarrollo sostenible y la economía circular. Conectamos talento, tecnología e impacto.
            </p>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setView('discovery')} className="bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:bg-primary-hover transition-all flex items-center gap-2 shadow-2xl shadow-primary/30">
                Explorar Proyectos <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* OPTIMIZED INTERACTIVE MAP SECTION */}
      <section className="py-24 px-10 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Intelligence HUD */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="size-1 rounded-full bg-primary shadow-[0_0_8px_#599E39]"></div>
                 <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Mapeo de Impacto Regional</h2>
              </div>
              <h3 className="text-6xl font-extrabold dark:text-white tracking-tighter text-stone-800 leading-[0.9]">
                Actores del <span className="text-stone-300">Ecosistema</span>
              </h3>
              <p className="text-stone-500 text-lg leading-relaxed font-medium max-w-md">
                Monitor de nodos estratégicos vinculados a la economía circular en la Región de Tarapacá. Inteligencia territorial en tiempo real.
              </p>
            </div>

            {/* Glass Filter Panel */}
            <div className="bg-white/50 dark:bg-earth-card/50 backdrop-blur-xl border border-stone-200/50 dark:border-stone-800 p-8 rounded-[3rem] shadow-xl">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Filtrar Infraestructura</h4>
                 <div className="flex gap-1">
                    <div className="size-1 rounded-full bg-primary animate-pulse"></div>
                    <div className="size-1 rounded-full bg-primary/30"></div>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {filterOptions.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setMapFilter(item.type)}
                    className={`group relative flex flex-col items-start gap-1 p-4 rounded-2xl border transition-all duration-500 overflow-hidden ${
                      mapFilter === item.type 
                      ? 'bg-stone-800 text-white border-transparent shadow-2xl scale-[1.02]' 
                      : 'bg-white dark:bg-earth-card border-stone-100 dark:border-stone-800 text-stone-600 hover:border-primary/50'
                    }`}
                  >
                    <div className={`size-1.5 rounded-full mb-1 transition-transform group-hover:scale-150 ${item.color}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{item.type}</span>
                    <span className={`text-[8px] font-bold mt-1 uppercase ${mapFilter === item.type ? 'text-stone-400' : 'text-stone-300'}`}>
                      {getActorCount(item.type)} Nodos
                    </span>
                    {mapFilter === item.type && (
                       <div className="absolute top-0 right-0 p-3 opacity-20">
                          <span className="material-symbols-outlined text-sm">{item.icon}</span>
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsRegModalOpen(true)}
              className="group w-full relative h-20 bg-primary text-white rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/30 transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10 flex items-center justify-center gap-4">
                 <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">add_location_alt</span>
                 <span className="text-sm font-black uppercase tracking-widest">Registrar mi Organización</span>
              </div>
            </button>
          </div>

          {/* Right Column: Smart Map Canvas */}
          <div className="lg:col-span-7 h-[650px] bg-white dark:bg-stone-900 rounded-[4rem] relative overflow-hidden shadow-inner-xl border border-stone-100 dark:border-stone-800 group/map">
            
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            
            {/* Tarapacá Shape with Depth */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="h-[85%] text-primary/5 filter blur-[2px] transition-all duration-700 group-hover/map:blur-0" viewBox="0 0 100 100" fill="currentColor">
                <path d={TarapacaPath} />
              </svg>
              <svg className="absolute h-[85%] text-primary/10 transition-transform duration-700 group-hover/map:scale-[1.02]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <path d={TarapacaPath} />
              </svg>
            </div>

            {/* HUD Overlay Elements */}
            <div className="absolute top-10 left-10 flex flex-col gap-2">
               <div className="bg-white/80 dark:bg-earth-card/80 backdrop-blur-md px-4 py-2 rounded-xl border border-stone-100 dark:border-stone-800 flex items-center gap-3">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-300 italic">Sistema de Monitoreo Activo</span>
               </div>
            </div>

            <div className="absolute bottom-10 right-10">
               <div className="bg-stone-800 text-white px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                  <div className="text-right">
                     <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Circular Score</p>
                     <p className="text-lg font-black leading-none">8.4<span className="text-[10px] text-primary">/10</span></p>
                  </div>
                  <div className="h-8 w-px bg-white/10"></div>
                  <span className="material-symbols-outlined text-primary">analytics</span>
               </div>
            </div>

            {/* Dynamic Nodes */}
            {filteredActors.map(actor => {
              const category = filterOptions.find(opt => opt.type === actor.type);
              const isActive = activeActor?.id === actor.id;
              
              return (
                <div 
                  key={actor.id} 
                  className={`absolute transition-all duration-700 ${isActive ? 'z-50 scale-110' : 'z-10'}`}
                  style={{ left: actor.x, top: actor.y }}
                  onMouseEnter={() => setActiveActor(actor)}
                  onMouseLeave={() => setActiveActor(null)}
                >
                  {/* Pulsing Aura */}
                  <div className={`absolute -inset-8 rounded-full opacity-20 animate-ping pointer-events-none ${category?.color}`}></div>
                  
                  {/* Main Node */}
                  <div className={`relative size-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${
                    isActive 
                    ? 'bg-primary text-white border-white shadow-2xl shadow-primary/50' 
                    : 'bg-white dark:bg-earth-card text-stone-700 dark:text-white border-transparent shadow-lg'
                  }`}>
                    <span className="material-symbols-outlined text-xl">{actor.icon}</span>
                    
                    {/* Tooltip Smart */}
                    <div className={`absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-64 p-6 bg-white dark:bg-earth-card rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-stone-100 dark:border-stone-800 transition-all duration-500 origin-bottom ${
                      isActive ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                         <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white ${category?.color}`}>
                           {actor.type}
                         </span>
                         <span className="text-[10px] font-bold text-stone-300 font-mono">ID: {actor.id}03</span>
                      </div>
                      <h4 className="text-base font-black dark:text-white mb-2 tracking-tight">{actor.name}</h4>
                      <div className="flex items-center gap-2 pt-3 border-t border-stone-50 dark:border-stone-800">
                         <span className="material-symbols-outlined text-xs text-primary">verified</span>
                         <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Validado por Gemini Smart</p>
                      </div>
                      
                      {/* Arrow Down */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-earth-card border-r border-b border-stone-100 dark:border-stone-800 rotate-45 -mt-2"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OPTIMIZED NEWS SECTION */}
      <section className="bg-stone-50 dark:bg-earth-dark py-32 px-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Actualidad Tarapacá</h2>
              <h3 className="text-6xl font-extrabold dark:text-white tracking-tighter leading-[0.9] font-display">
                Noticias del <span className="text-stone-400">Ecosistema</span>
              </h3>
            </div>
            <button className="group flex items-center gap-4 bg-white dark:bg-earth-card px-8 py-4 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 hover:border-primary transition-all">
               <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 group-hover:text-primary transition-colors">Explorar Archivo Histórico</span>
               <span className="material-symbols-outlined text-stone-300 group-hover:translate-x-1 transition-transform">auto_stories</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Featured News */}
            <div className="lg:col-span-7 group cursor-pointer">
              <div className="relative aspect-[16/9] rounded-[3.5rem] overflow-hidden shadow-2xl bg-stone-200 dark:bg-stone-800">
                <img 
                  src={MOCK_NEWS[0].image} 
                  alt={MOCK_NEWS[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-8 left-8 flex gap-3">
                  <span className="px-5 py-2 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                    {MOCK_NEWS[0].category}
                  </span>
                  <span className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/20">
                    Impacto IA: +12%
                  </span>
                </div>
                <div className="absolute bottom-10 left-10 right-10">
                  <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{MOCK_NEWS[0].date} • 5 min lectura</p>
                  <h4 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tighter">
                    {MOCK_NEWS[0].title}
                  </h4>
                  <p className="text-stone-300 text-lg leading-relaxed line-clamp-2 max-w-2xl font-medium">
                    {MOCK_NEWS[0].excerpt}
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary News List */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {MOCK_NEWS.slice(1).map((news) => (
                <div key={news.id} className="group flex gap-6 items-center p-4 rounded-[2.5rem] hover:bg-white dark:hover:bg-earth-card transition-all duration-500 border border-transparent hover:border-stone-100 dark:hover:border-stone-800 cursor-pointer">
                  <div className="size-32 rounded-3xl overflow-hidden shrink-0 shadow-lg bg-stone-200 dark:bg-stone-800">
                    <img 
                      src={news.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={news.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600";
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest">{news.category}</span>
                      <span className="size-1 bg-stone-300 rounded-full"></span>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{news.date}</span>
                    </div>
                    <h5 className="text-lg font-bold dark:text-white leading-tight group-hover:text-primary transition-colors">
                      {news.title}
                    </h5>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-stone-300 text-sm">trending_up</span>
                      <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Aceleración Circular Detectada</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 p-8 bg-primary/5 rounded-[2.5rem] border border-dashed border-primary/30 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-all">
                <div>
                   <h6 className="text-xs font-black dark:text-white uppercase tracking-widest">Suscripción Inteligente</h6>
                   <p className="text-[10px] text-stone-500 font-medium">Recibe reportes de impacto semanal en tu correo.</p>
                </div>
                <button className="size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined">mail</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-white dark:bg-earth-surface py-24 overflow-hidden">
        <div className="relative flex gap-10 overflow-hidden select-none group/marquee">
          <div className="flex shrink-0 items-center justify-around gap-10 min-w-full animate-[marquee_40s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
            {infiniteSponsors.map((sponsor, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-8 bg-stone-50 dark:bg-earth-card border border-stone-100 rounded-[2.5rem] w-64 h-48 hover:shadow-2xl transition-all group/card">
                <div className="h-20 w-full flex items-center justify-center grayscale group-hover/card:grayscale-0 opacity-40 group-hover/card:opacity-100 transition-all">
                  <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain px-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reg Modal */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-earth-surface/90 backdrop-blur-xl animate-fade-in">
          <div className="max-w-xl w-full bg-white rounded-[3rem] p-10 shadow-2xl relative">
            <button onClick={resetRegistration} className="absolute top-8 right-8 text-stone-400"><span className="material-symbols-outlined">close</span></button>
            {regStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-3xl font-black">Únete a la Red</h3>
                <input type="text" placeholder="Nombre" className="w-full bg-stone-50 border-none rounded-2xl p-4" onChange={e => setNewActor({...newActor, name: e.target.value})} />
                <button onClick={() => setRegStep(2)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Siguiente</button>
              </div>
            )}
            {/* ... other steps ... */}
            {regStep === 4 && (
               <div className="text-center py-10 space-y-4">
                  <span className="material-symbols-outlined text-6xl text-green-500">verified</span>
                  <h3 className="text-2xl font-black">¡Nodo Registrado!</h3>
                  <button onClick={resetRegistration} className="bg-stone-900 text-white px-8 py-3 rounded-xl">Cerrar</button>
               </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
