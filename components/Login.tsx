
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

type TerminalMode = 'login' | 'signup' | 'role_selection';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<TerminalMode>('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const roles: { role: UserRole, title: string, desc: string, icon: string, color: string }[] = [
    { 
      role: 'entrepreneur', 
      title: 'Emprendedor', 
      desc: 'Lidero proyectos de impacto circular.', 
      icon: 'lightbulb', 
      color: 'bg-primary'
    },
    { 
      role: 'investor_natural', 
      title: 'Inversor Natural', 
      desc: 'Persona natural buscando diversificar.', 
      icon: 'person', 
      color: 'bg-blue-600'
    },
    { 
      role: 'investor_legal', 
      title: 'Inversor Jurídico', 
      desc: 'Instituciones o fondos de inversión.', 
      icon: 'corporate_fare', 
      color: 'bg-indigo-600'
    },
    { 
      role: 'advisor', 
      title: 'Asesor / Mentor', 
      desc: 'Experto en sostenibilidad y auditoría.', 
      icon: 'verified_user', 
      color: 'bg-amber-600'
    }
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/;

    if (!identifier.trim()) {
      newErrors.identifier = 'El correo o teléfono es obligatorio.';
    } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      newErrors.identifier = 'Ingresa un correo válido o número (+569...)';
    }

    if (mode === 'signup') {
      if (!name.trim()) newErrors.name = 'El nombre o empresa es obligatorio.';
      if (name.length < 3) newErrors.name = 'El nombre es demasiado corto.';
    }

    if (mode === 'role_selection' && !selectedRole) {
      newErrors.role = 'Debes seleccionar un perfil para continuar.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAction = () => {
    if (validate()) {
      if (mode === 'login') {
        processAuth();
      } else if (mode === 'signup') {
        setMode('role_selection');
      } else {
        processAuth();
      }
    }
  };

  const processAuth = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onLogin({ 
        name: name || 'Usuario Circular', 
        role: selectedRole || 'entrepreneur', 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${identifier}`,
        identifier: identifier
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleGoogleLink = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setName('Innovador Tarapacá');
      setIdentifier('google.user@tarapaca.cl');
      setMode('role_selection');
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-earth-surface/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="max-w-5xl w-full bg-white dark:bg-earth-card rounded-[3rem] md:rounded-[5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden relative animate-[scale-up_0.5s_ease-out]">
        
        {/* Lado A: Branding */}
        <div className="lg:w-2/5 bg-primary p-12 text-white flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-[100px] -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="size-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 border border-white/20">
              <span className="material-symbols-outlined text-4xl">hub</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase font-display leading-[0.9]">
              Terminal de <br/><span className="text-primary-light italic">Acceso</span>
            </h1>
            <p className="text-primary-light/80 text-lg mt-8 font-medium">
              Gestiona tus activos circulares y conecta con el ecosistema regional de Tarapacá.
            </p>
          </div>
          <div className="relative z-10 pt-10 text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
            Cifrado Perimetral Activo v3.1
          </div>
        </div>

        {/* Lado B: Formulario */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white dark:bg-earth-card min-h-[600px]">
          <div className="flex justify-between items-center mb-10">
            <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
              <button 
                onClick={() => { setMode('login'); setErrors({}); }}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white dark:bg-stone-800 text-primary shadow-sm' : 'text-stone-400'}`}
              >
                Entrar
              </button>
              <button 
                onClick={() => { setMode('signup'); setErrors({}); }}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode !== 'login' ? 'bg-white dark:bg-stone-800 text-primary shadow-sm' : 'text-stone-400'}`}
              >
                Registro
              </button>
            </div>
            <button onClick={handleGoogleLink} className="size-12 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-center hover:bg-stone-50 transition-all group">
               <svg className="size-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </button>
          </div>

          <div className="space-y-6 animate-fade-in" key={mode}>
            {mode === 'role_selection' ? (
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Selecciona tu Perfil</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => { setSelectedRole(r.role); setErrors({}); }}
                      className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all text-left relative group ${
                        selectedRole === r.role ? 'border-primary bg-primary/5 shadow-xl' : 'border-stone-100 dark:border-stone-800 hover:border-primary/40'
                      }`}
                    >
                      <div className={`size-10 rounded-xl ${r.color} text-white flex items-center justify-center mb-3`}>
                        <span className="material-symbols-outlined text-xl">{r.icon}</span>
                      </div>
                      <h5 className="font-black text-xs uppercase dark:text-white">{r.title}</h5>
                      <p className="text-[10px] text-stone-500 mt-1 leading-tight">{r.desc}</p>
                      {selectedRole === r.role && <div className="absolute top-4 right-4 text-primary animate-fade-in"><span className="material-symbols-outlined font-black">check_circle</span></div>}
                    </button>
                  ))}
                </div>
                {errors.role && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{errors.role}</p>}
              </div>
            ) : (
              <div className="space-y-6">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Nombre / Empresa</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[2rem] py-5 px-8 text-lg outline-none transition-all ${errors.name ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                      placeholder="Tu nombre completo..."
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4">{errors.name}</p>}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Identificador Único</label>
                  <input 
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[2rem] py-5 px-8 text-lg outline-none transition-all ${errors.identifier ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    placeholder="Email o Teléfono..."
                  />
                  {errors.identifier && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4">{errors.identifier}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 space-y-4">
             <button 
               onClick={handleAction}
               disabled={isProcessing}
               className="w-full h-20 bg-primary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
             >
               {isProcessing ? <span className="animate-spin material-symbols-outlined text-3xl">refresh</span> : <span className="material-symbols-outlined text-3xl">{mode === 'role_selection' ? 'verified' : 'login'}</span>}
               {isProcessing ? 'Validando...' : (mode === 'login' ? 'Acceder a Red' : mode === 'signup' ? 'Siguiente Paso' : 'Finalizar Registro')}
             </button>
             {mode === 'role_selection' && <button onClick={() => setMode('signup')} className="w-full text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-stone-800 transition-colors">Volver Atrás</button>}
          </div>
        </div>
      </div>
      <style>{`@keyframes scale-up { from { opacity: 0; transform: scale(0.9) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
};
