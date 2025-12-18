
import React, { useState } from 'react';
import { MOCK_NEWS, MAP_ACTORS, SPONSORS } from '../constants';

export const Home: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
  const [activeActor, setActiveActor] = useState<typeof MAP_ACTORS[0] | null>(null);

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
                Saber más
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Axes */}
      <section className="py-24 px-10 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Nuestros Ejes</h2>
            <h3 className="text-5xl font-extrabold dark:text-white tracking-tighter">Desarrollo <span className="text-stone-400">Inteligente</span></h3>
          </div>
          <p className="text-stone-500 dark:text-stone-400 max-w-md font-medium">
            Implementamos soluciones tecnológicas para resolver desafíos territoriales mediante la colaboración circular.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Economía Circular', icon: 'sync', desc: 'Sistemas regenerativos que eliminan el desperdicio desde el diseño.', color: 'border-green-500/20 hover:bg-green-500/5' },
            { title: 'Gobernanza Digital', icon: 'account_tree', desc: 'Transparencia y participación ciudadana impulsada por datos.', color: 'border-blue-500/20 hover:bg-blue-500/5' },
            { title: 'Innovación Social', icon: 'groups', desc: 'Empoderamiento comunitario a través de proyectos de impacto real.', color: 'border-amber-500/20 hover:bg-amber-500/5' }
          ].map((axis, i) => (
            <div key={i} className={`p-10 rounded-[3rem] border bg-white dark:bg-earth-card transition-all group cursor-pointer ${axis.color}`}>
              <div className="size-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl font-bold text-stone-700 dark:text-stone-300">{axis.icon}</span>
              </div>
              <h4 className="text-2xl font-extrabold mb-4 dark:text-white">{axis.title}</h4>
              <p className="text-stone-500 dark:text-stone-400 font-medium leading-relaxed">
                {axis.desc}
              </p>
              <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm">
                Ver detalles <span className="material-symbols-outlined text-sm">north_east</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regional News Section */}
      <section className="bg-white dark:bg-earth-surface py-24 px-10">
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
                <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 dark:bg-earth-card/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 px-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{news.date} • {news.tag}</span>
                  <h4 className="text-xl font-bold dark:text-white leading-tight group-hover:text-primary transition-colors">
                    {news.title}
                  </h4>
                  <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed line-clamp-2">
                    {news.excerpt}
                  </p>
                </div>
              </div>
            ))}
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
              <p className="text-stone-500 dark:text-stone-400 mt-6 text-lg leading-relaxed">
                Visualiza la red de colaboración que impulsa la sustentabilidad en Tarapacá. Articulamos el sector público, privado, la academia y la ciudadanía.
              </p>
            </div>

            <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-primary">Hazte visible en el mapa</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-medium">
                Al registrarte, tu organización se suma a nuestro grafo de impacto territorial. Aplicaremos filtros estratégicos para generar métricas de interés que optimicen la toma de decisiones en Tarapacá.
              </p>
              <button 
                onClick={() => setView('login')}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-hover transition-all shadow-lg shadow-primary/10"
              >
                Sumar mi Organización
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['Público', 'Privado', 'Académico', 'Gremio'].map((type) => (
                <div key={type} className="flex items-center gap-3 p-3 bg-white dark:bg-earth-card border border-stone-100 dark:border-stone-800 rounded-xl">
                  <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(89,158,57,0.8)]"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative bg-stone-100 dark:bg-stone-900 rounded-[4rem] aspect-square lg:aspect-video overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xl">
              <div className="absolute inset-0 opacity-20 dark:opacity-30">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                <svg className="w-full h-full text-stone-400" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                  <path d="M40,0 L42,10 L38,20 L45,35 L40,50 L43,70 L35,85 L38,100" stroke="currentColor" strokeWidth="0.5"/>
                </svg>
              </div>

              {MAP_ACTORS.map((actor) => (
                <div 
                  key={actor.id}
                  className="absolute cursor-pointer group"
                  style={{ left: actor.x, top: actor.y }}
                  onMouseEnter={() => setActiveActor(actor)}
                  onMouseLeave={() => setActiveActor(null)}
                >
                  <div className="relative">
                    <div className="size-10 bg-primary/20 rounded-full animate-ping absolute -inset-0"></div>
                    <div className="size-10 bg-white dark:bg-earth-card rounded-2xl shadow-xl flex items-center justify-center border-2 border-primary group-hover:scale-125 transition-transform relative z-10">
                      <span className="material-symbols-outlined text-primary text-xl font-bold">{actor.icon}</span>
                    </div>

                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-earth-surface text-white p-4 rounded-2xl shadow-2xl border border-white/10 transition-all pointer-events-none z-20 ${
                      activeActor?.id === actor.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{actor.type}</p>
                      <p className="text-sm font-bold leading-tight">{actor.name}</p>
                      <div className="mt-2 flex items-center gap-1 text-[8px] font-bold text-stone-400 uppercase">
                        <span className="size-1 rounded-full bg-green-500"></span> Activo Smart
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">analytics</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">Métricas Territoriales</p>
                    <p className="text-[10px] text-stone-300">Explora la densidad de impacto por actor</p>
                  </div>
                </div>
                <button className="bg-white text-earth-surface px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                  Ver Dashboard Mapa
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Collaborators and Sponsors Section */}
      <section className="bg-stone-50 dark:bg-earth-dark/40 py-24 px-10 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Propósito Compartido</h2>
            <h3 className="text-5xl font-extrabold dark:text-white tracking-tighter">Nuestros <span className="text-stone-400">Aliados Estratégicos</span></h3>
            <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto font-medium">
              Instituciones y empresas que impulsan el desarrollo sostenible en la Región de Tarapacá.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {SPONSORS.map((sponsor, i) => (
              <div 
                key={i} 
                className="group relative flex flex-col items-center justify-center p-8 bg-white dark:bg-earth-card border border-stone-100 dark:border-stone-800 rounded-[2rem] hover:shadow-2xl hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="h-16 w-full flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(sponsor.name)}&background=f0f0f0&color=599E39&bold=true`;
                    }}
                  />
                </div>
                <div className="mt-4 text-center">
                   <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-primary transition-colors">{sponsor.name}</p>
                </div>
                {/* Status Indicator */}
                <div className="absolute top-4 right-4 size-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col items-center">
            <div className="p-10 bg-earth-surface text-white rounded-[3rem] w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-20 -mr-20 -mt-20 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="relative z-10">
                 <h4 className="text-2xl font-black tracking-tight mb-2">¿Quieres ser parte de la red?</h4>
                 <p className="text-stone-400 text-sm max-w-md font-medium">Únete como colaborador estratégico o auspiciador para potenciar el impacto circular en la región.</p>
               </div>
               <button className="relative z-10 bg-white text-earth-surface px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
                 Conviértete en Aliado
               </button>
            </div>
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
