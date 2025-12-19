
import React from 'react';
import { AISimulator } from '../components/AISimulator';
import { UserRole } from '../types';

interface DashboardProps {
  setView: (v: any) => void;
  userRole?: UserRole;
}

export const Dashboard: React.FC<DashboardProps> = ({ setView, userRole }) => {
  const ctas = [
    {
      title: 'Publica tu proyecto',
      desc: 'Inicia tu campaña de crowdfunding y escala tu impacto circular.',
      icon: 'add_circle',
      action: () => setView('analysis'),
      color: 'bg-primary'
    },
    {
      title: 'Apoya talento local',
      desc: 'Contribuye a proyectos que transforman nuestra región de Tarapacá.',
      icon: 'volunteer_activism',
      action: () => setView('discovery'),
      color: 'bg-blue-600'
    },
    {
      title: 'Explora iniciativas',
      desc: 'Descubre las soluciones sostenibles más innovadoras del ecosistema.',
      icon: 'explore',
      action: () => setView('discovery'),
      color: 'bg-amber-600'
    },
    {
      title: 'Conecta tu organización',
      desc: 'Súmate como aliado estratégico, academia o empresa auspiciadora.',
      icon: 'hub',
      action: () => setView('home'),
      color: 'bg-purple-600'
    },
    {
      title: 'Invierte con impacto',
      desc: 'Oportunidades de inversión con retorno social, ambiental y económico.',
      icon: 'trending_up',
      action: () => setView('recommendations'),
      color: 'bg-stone-800'
    }
  ];

  return (
    <div className="animate-fade-in space-y-16 py-10">
      {/* Header Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Ecosistema Central</h2>
        <h1 className="text-5xl md:text-6xl font-black dark:text-white tracking-tighter leading-none">
          PANEL DE <span className="text-primary italic">CONEXIÓN</span>
        </h1>
        <p className="text-xl text-stone-500 dark:text-stone-400 font-medium leading-relaxed">
          Bienvenido al centro neurálgico de la innovación sostenible en el norte de Chile. 
          Aquí convergen ideas, capital y propósito.
        </p>
      </section>

      {/* CTA Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ctas.map((cta, i) => (
          <button
            key={i}
            onClick={cta.action}
            className="group relative flex flex-col p-8 bg-white dark:bg-earth-card rounded-[2.5rem] border border-stone-200 dark:border-stone-800 text-left hover:shadow-2xl hover:scale-[1.02] transition-all overflow-hidden"
          >
            <div className={`absolute top-0 right-0 p-16 -mr-16 -mt-16 opacity-10 rounded-full blur-2xl ${cta.color}`}></div>
            <div className={`size-14 rounded-2xl ${cta.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
              <span className="material-symbols-outlined text-3xl font-bold">{cta.icon}</span>
            </div>
            <h3 className="text-2xl font-black dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors">
              {cta.title}
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium leading-relaxed">
              {cta.desc}
            </p>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Comenzar ahora <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </button>
        ))}

        {/* Info Card / Metric Summary */}
        <div className="lg:col-span-1 bg-primary text-white p-8 rounded-[2.5rem] flex flex-col justify-between shadow-xl relative overflow-hidden">
           <div className="absolute bottom-0 right-0 p-24 -mb-16 -mr-16 bg-white/10 rounded-full blur-3xl"></div>
           <div>
             <h4 className="text-sm font-black uppercase tracking-widest mb-4">Estado Territorial</h4>
             <div className="space-y-4">
                <div>
                   <p className="text-4xl font-black leading-none">12.4k</p>
                   <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Conexiones Activas</p>
                </div>
                <div className="h-px bg-white/20"></div>
                <div>
                   <p className="text-4xl font-black leading-none">85%</p>
                   <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Sostenibilidad Media</p>
                </div>
             </div>
           </div>
           <button className="mt-8 bg-white text-primary px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-100 transition-all">
             Ver Estadísticas
           </button>
        </div>
      </section>

      {/* NEW AI SIMULATOR SECTION - Personalized by User Role */}
      {userRole && (
        <section className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-black dark:text-white tracking-tighter">Optimización <span className="text-primary italic">Asistida</span></h3>
            <p className="text-stone-500 font-medium mt-2">Usa nuestra IA territorial para proyectar el impacto de tu estrategia.</p>
          </div>
          <AISimulator role={userRole} />
        </section>
      )}

      {/* How it works section */}
      <section className="bg-stone-100 dark:bg-earth-surface rounded-[4rem] p-12 md:p-20 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
           <div className="space-y-4">
             <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Propósito Local</h2>
             <h3 className="text-4xl md:text-5xl font-black dark:text-white tracking-tighter leading-tight">
               ¿Cómo funciona <span className="text-primary italic">CONECTARAPAK</span>?
             </h3>
             <p className="text-xl text-stone-600 dark:text-stone-300 font-bold leading-relaxed">
               Crowdfunding regional para impulsar talento local e innovación.
             </p>
             <p className="text-stone-500 dark:text-stone-400 leading-relaxed font-medium">
               Conectamos comunidad, sector público y privado para financiar proyectos, fortalecer la economía regional y potenciar el turismo local con proyección continental.
             </p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                 <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined font-bold">payments</span>
                 </div>
                 <div>
                    <h4 className="font-black dark:text-white text-sm uppercase tracking-widest mb-1">Micro-inversión</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Democratizamos el acceso al capital para proyectos con impacto real.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="size-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                    <span className="material-symbols-outlined font-bold">groups_3</span>
                 </div>
                 <div>
                    <h4 className="font-black dark:text-white text-sm uppercase tracking-widest mb-1">Sinergia Social</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Vinculamos actores clave para asegurar la viabilidad de cada idea.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex-1 relative">
           <div className="aspect-square bg-stone-200 dark:bg-earth-card rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-white dark:border-earth-surface">
              <img 
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                alt="Impacto Territorial"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                 <div className="bg-white/90 dark:bg-earth-card/90 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Visión 2030</p>
                    <p className="text-sm font-bold dark:text-white">Potenciando el turismo y la economía circular desde Tarapacá hacia toda América.</p>
                 </div>
              </div>
           </div>
           {/* Decorative Elements */}
           <div className="absolute -top-6 -right-6 size-24 bg-primary rounded-full animate-pulse opacity-20 blur-2xl"></div>
           <div className="absolute -bottom-6 -left-6 size-32 bg-blue-500 rounded-full animate-pulse opacity-10 blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};
