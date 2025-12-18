
import React from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
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

  return (
    <div className="fixed inset-0 z-[100] bg-earth-surface/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-4xl w-full bg-white dark:bg-earth-card rounded-[3.5rem] p-12 shadow-2xl overflow-hidden relative border border-white/10">
        <div className="absolute top-0 right-0 p-20 -mr-20 -mt-20 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl font-bold">change_circle</span>
            <h2 className="text-2xl font-black dark:text-white tracking-tighter">CONECTARAPAK SMART</h2>
          </div>
          <h1 className="text-4xl font-extrabold dark:text-white tracking-tight">Bienvenido al Ecosistema</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">Selecciona tu perfil para personalizar tu experiencia territorial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => onLogin({ name: `Usuario ${r.title}`, role: r.role, avatar: `https://picsum.photos/seed/${r.role}/100/100` })}
              className="flex items-start gap-5 p-6 rounded-[2rem] border-2 border-stone-100 dark:border-stone-800 bg-white/50 dark:bg-earth-card/50 hover:border-primary hover:scale-[1.02] transition-all text-left group"
            >
              <div className={`size-14 shrink-0 rounded-2xl ${r.color} text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                <span className="material-symbols-outlined text-3xl">{r.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold dark:text-white mb-1">{r.title}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-medium">
                  {r.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center mt-10 text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
          Protección de Datos Nivel 4 • Protocolo RBAC Activado
        </p>
      </div>
    </div>
  );
};
