
import React, { useState } from 'react';

const LogoIcon = () => (
  <svg viewBox="0 0 100 100" className="size-12 fill-none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="white" stroke="#599E39" strokeWidth="2"/>
    <path d="M20 70 L40 45 L55 60 L75 35 L85 70 Z" fill="#437A28"/>
    <path d="M15 75 L35 55 L50 68 L70 45 L85 75 Z" fill="#599E39" opacity="0.8"/>
    <circle cx="50" cy="30" r="12" fill="#F59E0B"/>
    <path d="M30 80 Q50 95 70 80" stroke="#599E39" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="flex flex-col animate-fade-in -mt-10">
      {/* Form Section */}
      <section className="bg-primary py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white text-3xl font-black mb-10 tracking-tight">Contáctanos</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white text-sm font-bold flex gap-1">
                  Nombre <span className="text-red-300">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white border-none rounded-sm py-3 px-4 focus:ring-2 focus:ring-accent"
                />
                <p className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Nombre</p>
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-bold invisible">Apellidos</label>
                <input 
                  type="text" 
                  className="w-full bg-white border-none rounded-sm py-3 px-4 focus:ring-2 focus:ring-accent"
                />
                <p className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Apellidos</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-bold flex gap-1">
                Correo electrónico <span className="text-red-300">*</span>
              </label>
              <input 
                type="email" 
                required
                className="w-full bg-white border-none rounded-sm py-3 px-4 focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-bold flex gap-1">
                Teléfono <span className="text-red-300">*</span>
              </label>
              <input 
                type="tel" 
                required
                className="w-full bg-white border-none rounded-sm py-3 px-4 focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-bold">Asunto</label>
              <input 
                type="text" 
                className="w-full bg-white border-none rounded-sm py-3 px-4 focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-bold">Consulta</label>
              <textarea 
                rows={6}
                className="w-full bg-white border-none rounded-sm py-3 px-4 focus:ring-2 focus:ring-accent resize-y"
              ></textarea>
            </div>

            <div>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold text-sm transition-all shadow-lg active:scale-95"
              >
                {submitted ? '¡Mensaje Enviado!' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Corporate Info Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <LogoIcon />
            <div className="text-center md:text-left">
              <h3 className="text-primary text-3xl font-black tracking-tighter leading-none">CONECTARAPAK</h3>
              <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Ecosistema Circular de Tarapacá</p>
            </div>
          </div>

          <div className="space-y-8">
            <p className="text-stone-600 font-medium text-sm leading-relaxed max-w-lg">
              CONECTARAPAK es una plataforma líder para la aceleración del desarrollo sostenible, 
              conectando a la comunidad con proyectos que transforman la Región de Tarapacá.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-stone-500 text-xs font-medium">
                <span className="material-symbols-outlined text-stone-400">location_on</span>
                Alto Hospicio, Tarapaca, Chile
              </div>
              <div className="flex items-center gap-4 text-stone-500 text-xs font-medium">
                <span className="material-symbols-outlined text-stone-400">phone_iphone</span>
                Teléfono: +56981534890
              </div>
              <div className="flex items-center gap-4 text-stone-500 text-xs font-medium">
                <span className="material-symbols-outlined text-stone-400">mail</span>
                Correo: conectarapak@outlook.cl
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
