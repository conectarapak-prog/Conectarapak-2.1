
import React, { useState } from 'react';
import { View } from '../types';

const LogoIcon = () => (
  <svg viewBox="0 0 100 100" className="size-14 fill-none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="white" stroke="#599E39" strokeWidth="2"/>
    <path d="M20 70 L40 45 L55 60 L75 35 L85 70 Z" fill="#437A28"/>
    <path d="M15 75 L35 55 L50 68 L70 45 L85 75 Z" fill="#599E39" opacity="0.8"/>
    <circle cx="50" cy="30" r="12" fill="#F59E0B"/>
    <path d="M30 80 Q50 95 70 80" stroke="#599E39" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

interface ContactProps {
  setView?: (view: View) => void;
}

export const Contact: React.FC<ContactProps> = ({ setView }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email) return 'El correo electrónico es obligatorio.';
    if (!emailRegex.test(email)) return 'Por favor, introduce un correo válido.';
    return '';
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?(\d[\d\s\-\.\(\)]{6,18}\d)$/;
    if (!phone) return 'El teléfono es obligatorio.';
    if (!phoneRegex.test(phone)) return 'Formato de teléfono no reconocido.';
    return '';
  };

  const handleBlur = (field: string) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!formData.name.trim()) error = 'El nombre es obligatorio.';
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      case 'subject':
        if (!formData.subject) error = 'Selecciona un motivo.';
        break;
      case 'message':
        if (!formData.message.trim()) error = 'Escribe tu consulta.';
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: !formData.name.trim() ? 'Obligatorio' : '',
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      subject: !formData.subject ? 'Selecciona motivo' : '',
      message: !formData.message.trim() ? 'Escribe mensaje' : ''
    };
    setErrors(newErrors);
    if (!Object.values(newErrors).some(err => err !== '')) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="flex flex-col animate-fade-in -mt-10">
      {/* Form Section */}
      <section className="bg-primary py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-white text-4xl font-black tracking-tight mb-2">Contáctanos</h2>
            <p className="text-white/70 font-medium">Estamos aquí para resolver tus dudas sobre el ecosistema circular.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm border border-white/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white text-sm font-bold">Nombre <span className="text-red-300">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={() => handleBlur('name')} placeholder="Tu nombre" className={`w-full bg-white border-2 rounded-xl py-3 px-4 text-stone-700 outline-none ${errors.name ? 'border-red-400' : 'border-transparent focus:border-accent'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-bold">Apellidos</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Tus apellidos" className="w-full bg-white border-transparent border-2 rounded-xl py-3 px-4 text-stone-700 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white text-sm font-bold">Correo <span className="text-red-300">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} className={`w-full bg-white border-2 rounded-xl py-3 px-4 text-stone-700 outline-none ${errors.email ? 'border-red-400' : 'border-transparent focus:border-accent'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-bold">Teléfono <span className="text-red-300">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} className={`w-full bg-white border-2 rounded-xl py-3 px-4 text-stone-700 outline-none ${errors.phone ? 'border-red-400' : 'border-transparent focus:border-accent'}`} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-bold">Asunto <span className="text-red-300">*</span></label>
              <select name="subject" value={formData.subject} onChange={handleChange} className={`w-full bg-white border-2 rounded-xl py-3 px-4 text-stone-600 outline-none ${errors.subject ? 'border-red-400' : 'border-transparent focus:border-accent'}`}>
                <option value="" disabled>Selecciona un motivo</option>
                <option value="consulta">Consulta General</option>
                <option value="proyecto">Propuesta Circular</option>
                <option value="inversion">Inversión</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-bold">Consulta <span className="text-red-300">*</span></label>
              <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className={`w-full bg-white border-2 rounded-xl py-3 px-4 text-stone-700 outline-none resize-none ${errors.message ? 'border-red-400' : 'border-transparent focus:border-accent'}`}></textarea>
            </div>
            <button type="submit" disabled={submitted} className={`w-full md:w-auto px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${submitted ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl'}`}>
              {submitted ? '¡Enviado!' : 'Enviar Consulta'}
            </button>
          </form>
        </div>
      </section>

      {/* Corporate Info Section - Minimalist & Aesthetic Alignment */}
      <section className="bg-white dark:bg-earth-dark py-32 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          
          {/* Brand Identity Side - Now Interactive */}
          <div className="flex flex-col items-start space-y-10">
            <div 
              onClick={() => setView?.('dashboard')}
              className="flex items-center gap-5 cursor-pointer group hover:opacity-80 transition-all active:scale-[0.98]"
              title="Volver al Panel Principal"
            >
              <div className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <LogoIcon />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-stone-800 dark:text-white text-4xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">CONECTARAPAK</h3>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mt-2">Ecosistema Circular</p>
              </div>
            </div>

            {/* Keyword tags aligned to the same left margin */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Aceleración Sostenible', icon: 'rocket_launch' },
                { label: 'Conexión Comunitaria', icon: 'groups' },
                { label: 'Transformación Regional', icon: 'landscape' },
                { label: 'Economía Circular', icon: 'sync' }
              ].map((tag) => (
                <span key={tag.label} className="px-4 py-2 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">{tag.icon}</span>
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Social icons aligned to left margin */}
            <div className="flex gap-3">
              <button className="size-11 rounded-xl bg-stone-50 dark:bg-earth-card flex items-center justify-center text-stone-400 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-xl">share</span>
              </button>
              <button className="size-11 rounded-xl bg-stone-50 dark:bg-earth-card flex items-center justify-center text-stone-400 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-xl">language</span>
              </button>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-stone-50 dark:bg-earth-card p-10 md:p-12 rounded-[3rem] border border-stone-100 dark:border-stone-800 space-y-10 shadow-sm self-start">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Información de contacto</h4>
            
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="size-10 bg-white dark:bg-earth-surface rounded-xl flex items-center justify-center shadow-sm text-primary">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-0.5">Ubicación</p>
                  <p className="text-xs font-bold dark:text-white">Alto Hospicio, Tarapacá, Chile</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="size-10 bg-white dark:bg-earth-surface rounded-xl flex items-center justify-center shadow-sm text-primary">
                  <span className="material-symbols-outlined text-lg">phone_iphone</span>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-0.5">WhatsApp</p>
                  <p className="text-xs font-bold dark:text-white">+56 9 8153 4890</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="size-10 bg-white dark:bg-earth-surface rounded-xl flex items-center justify-center shadow-sm text-primary">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-0.5">Correo Electrónico</p>
                  <p className="text-xs font-bold dark:text-white">conectarapak@outlook.cl</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
