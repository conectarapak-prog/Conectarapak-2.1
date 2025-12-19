
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const roles: { role: UserRole, title: string, desc: string, icon: string, color: string }[] = [
    { 
      role: 'entrepreneur', 
      title: 'Emprendedor', 
      desc: 'Tengo una idea circular, un prototipo o quiero comercializar productos sostenibles.', 
      icon: 'lightbulb', 
      color: 'bg-primary' 
    },
    { 
      role: 'investor_natural', 
      title: 'Inversor Natural', 
      desc: 'Busco proyectos con propósito para invertir mi capital personal.', 
      icon: 'person', 
      color: 'bg-blue-600' 
    },
    { 
      role: 'investor_legal', 
      title: 'Inversor Jurídico', 
      desc: 'Represento a una empresa u organización interesada en impacto territorial.', 
      icon: 'corporate_fare', 
      color: 'bg-indigo-600' 
    },
    { 
      role: 'advisor', 
      title: 'Asesor / Mentor', 
      desc: 'Quiero auditar, guiar y certificar proyectos en el ecosistema smart.', 
      icon: 'verified_user', 
      color: 'bg-amber-600' 
    }
  ];

  const handleRoleSelect = (role: UserRole, title: string) => {
    if (!name.trim()) {
      setError('Por favor, ingresa tu nombre antes de continuar.');
      return;
    }
    onLogin({ 
      name: name, 
      role: role, 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'anon'}` 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-earth-surface/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-4xl w-full bg-white dark:bg-earth-card rounded-[3.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative border border-white/10">
        <div className="absolute top-0 right-0 p-24 -mr-24 -mt-24 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-5xl font-bold">change_circle</span>
            <h2 className="text-2xl font-black dark:text-white tracking-tighter">CONECTARAPAK SMART</h2>
          </div>
          <h1 className="text-4xl font-extrabold dark:text-white tracking-tight">Acceso al Ecosistema</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">Valida tu identidad y selecciona tu rol estratégico.</p>
        </div>

        <div className="relative z-10 mb-8 max-w-md mx-auto">
          <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 ml-4">Nombre Completo o Razón Social</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="Ej: Juan Pérez o EcoIndustrias S.A."
            className={`w-full bg-stone-100 dark:bg-stone-900 border-2 rounded-2xl py-4 px-6 text-lg focus:ring-4 focus:ring-primary/20 transition-all ${error ? 'border-red-500' : 'border-transparent focus:border-primary'}`}
          />
          {error && <p className="text-red-500 text-[10px] font-bold mt-2 ml-4 uppercase tracking-widest">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => handleRoleSelect(r.role, r.title)}
              className="flex items-start gap-4 p-5 rounded-[2rem] border-2 border-stone-100 dark:border-stone-800 bg-white/50 dark:bg-earth-card/50 hover:border-primary hover:scale-[1.01] transition-all text-left group"
            >
              <div className={`size-12 shrink-0 rounded-xl ${r.color} text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{r.icon}</span>
              </div>
              <div>
                <h3 className="text-base font-bold dark:text-white mb-1">{r.title}</h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight font-medium opacity-80">
                  {r.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
            Seguridad Biométrica Simulada • Protocolo RBAC v4.2
          </p>
        </div>
      </div>
    </div>
  );
};
