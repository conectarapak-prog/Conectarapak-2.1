
import React, { useState } from 'react';
import { UserRole, User, DocumentType } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

type TerminalMode = 'login' | 'signup' | 'role_selection' | 'recovery';
type SignupStep = 'identity' | 'contact';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<TerminalMode>('login');
  const [signupStep, setSignupStep] = useState<SignupStep>('identity');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('RUT');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loginRole, setLoginRole] = useState<UserRole>('entrepreneur');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const roles: { role: UserRole, title: string, desc: string, icon: string, color: string }[] = [
    { role: 'entrepreneur', title: 'Emprendedor', desc: 'Lidero proyectos de impacto circular.', icon: 'lightbulb', color: 'bg-primary' },
    { role: 'investor_natural', title: 'Inversor Natural', desc: 'Persona buscando diversificar.', icon: 'person', color: 'bg-blue-600' },
    { role: 'investor_legal', title: 'Inversor Jurídico', desc: 'Instituciones o fondos.', icon: 'corporate_fare', color: 'bg-indigo-600' },
    { role: 'advisor', title: 'Asesor / Mentor', desc: 'Experto en sostenibilidad.', icon: 'verified_user', color: 'bg-amber-600' }
  ];

  const validateRut = (rut: string) => {
    const cleanRut = rut.replace(/[^0-9kK]/g, '');
    if (cleanRut.length < 8) return false;
    return /^[0-9]+[0-9kK]{1}$/.test(cleanRut);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (mode === 'login') {
      if (!email.trim()) newErrors.email = 'El identificador es obligatorio.';
      if (!loginRole) newErrors.loginRole = 'Selecciona un perfil de acceso.';
    }

    if (mode === 'signup' && signupStep === 'identity') {
      if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
      if (!documentId.trim()) newErrors.documentId = 'El N° de documento es obligatorio.';
      if (documentType === 'RUT' && !validateRut(documentId)) newErrors.documentId = 'Formato de RUT inválido.';
    }

    if (mode === 'signup' && signupStep === 'contact') {
      if (!emailRegex.test(email)) newErrors.email = 'Email inválido.';
      if (!phone.trim()) newErrors.phone = 'El teléfono es obligatorio.';
    }

    if (mode === 'role_selection' && !selectedRole) {
      newErrors.role = 'Debes seleccionar un perfil.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAction = () => {
    if (validate()) {
      if (mode === 'login') {
        processAuth();
      } else if (mode === 'signup') {
        if (signupStep === 'identity') setSignupStep('contact');
        else setMode('role_selection');
      } else if (mode === 'role_selection') {
        processAuth();
      }
    }
  };

  const processAuth = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onLogin({ 
        name: name || (mode === 'login' ? email.split('@')[0] : 'Usuario Circular'), 
        role: mode === 'login' ? loginRole : (selectedRole || 'entrepreneur'), 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || documentId || 'zen'}`,
        identifier: email,
        phone: phone,
        documentId: documentId,
        documentType: documentType,
        isVerified: true
      });
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-earth-surface/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="max-w-5xl w-full bg-white dark:bg-earth-card rounded-[3rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-stone-100 dark:border-stone-800">
        
        {/* Lado A: Branding Zen */}
        <div className="lg:w-2/5 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-[100px] -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="size-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <span className="material-symbols-outlined text-3xl">shield_person</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase font-display leading-[0.9]">
              Identidad <br/><span className="text-primary-light italic">Verificada</span>
            </h1>
            <p className="text-primary-light/80 text-sm mt-6 font-medium leading-relaxed">
              Vinculamos tu documento legal con tu perfil digital para garantizar la transparencia en Tarapacá.
            </p>
          </div>
          
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3 bg-black/10 p-4 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-primary-light">fingerprint</span>
                <p className="text-[9px] font-black uppercase tracking-widest leading-tight">Cifrado de grado bancario activo</p>
             </div>
          </div>
        </div>

        {/* Lado B: Formulario Optimizado */}
        <div className="flex-1 p-8 md:p-14 flex flex-col justify-center bg-white dark:bg-earth-card min-h-[600px]">
          
          {/* Header Switcher Compacto */}
          <div className="flex justify-between items-center mb-8">
            <div className="inline-flex p-1 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
              <button 
                onClick={() => { setMode('login'); setErrors({}); }}
                className={`px-8 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white dark:bg-stone-800 text-primary shadow-sm' : 'text-stone-400'}`}
              >
                Entrar
              </button>
              <button 
                onClick={() => { setMode('signup'); setSignupStep('identity'); setErrors({}); }}
                className={`px-8 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'signup' || mode === 'role_selection' ? 'bg-white dark:bg-stone-800 text-primary shadow-sm' : 'text-stone-400'}`}
              >
                Registro
              </button>
            </div>
            {mode === 'login' && (
              <button onClick={() => setMode('recovery')} className="text-[9px] font-black uppercase tracking-widest text-stone-300 hover:text-primary transition-colors">
                ¿PERDISTE EL ACCESO?
              </button>
            )}
          </div>

          <div className="space-y-6 animate-fade-in" key={`${mode}-${signupStep}`}>
            
            {mode === 'login' ? (
              <div className="space-y-6">
                {/* Selector de Perfil Desplegable */}
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Perfil de Acceso</label>
                   <div className="relative">
                      <select 
                        value={loginRole} 
                        onChange={(e) => setLoginRole(e.target.value as UserRole)}
                        className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-[1.5rem] py-5 pl-14 pr-8 text-sm font-bold appearance-none dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                         <option value="entrepreneur">Emprendedor Circular</option>
                         <option value="investor_natural">Inversor Natural</option>
                         <option value="investor_legal">Inversor Jurídico</option>
                         <option value="advisor">Asesor / Mentor</option>
                      </select>
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400 text-xl">
                        {roles.find(r => r.role === loginRole)?.icon || 'account_circle'}
                      </span>
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-300 pointer-events-none">expand_more</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Email o RUT</label>
                   <input 
                    type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[1.5rem] py-5 px-8 text-base outline-none transition-all ${errors.email ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    placeholder="identificador@red.cl"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Contraseña de Red</label>
                   <input 
                    type="password"
                    className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-[1.5rem] py-5 px-8 text-base outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                   />
                </div>
              </div>
            ) : mode === 'signup' && signupStep === 'identity' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Nombre Completo / Entidad</label>
                   <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[1.5rem] py-5 px-8 text-base outline-none transition-all ${errors.name ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    placeholder="Ej: EcoPyme SpA"
                   />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Tipo</label>
                      <select 
                        value={documentType} onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                        className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-2xl py-5 px-6 text-xs font-bold outline-none"
                      >
                         <option value="RUT">RUT</option>
                         <option value="DNI">DNI</option>
                         <option value="PASSPORT">PASS</option>
                      </select>
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Identificador</label>
                      <input 
                        type="text" value={documentId} onChange={(e) => setDocumentId(e.target.value)}
                        className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[1.5rem] py-5 px-8 text-base outline-none transition-all ${errors.documentId ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                        placeholder="12.345.678-9"
                      />
                   </div>
                </div>
              </div>
            ) : mode === 'signup' && signupStep === 'contact' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Correo Corporativo</label>
                   <input 
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[1.5rem] py-5 px-8 text-base outline-none transition-all ${errors.email ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    placeholder="tu@correo.cl"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Teléfono Directo</label>
                   <input 
                    type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[1.5rem] py-5 px-8 text-base outline-none transition-all ${errors.phone ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    placeholder="+56 9 ..."
                   />
                </div>
              </div>
            ) : mode === 'role_selection' ? (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-4">Paso Final: Selecciona tu Perfil</h3>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => setSelectedRole(r.role)}
                      className={`flex flex-col p-5 rounded-[2rem] border-2 transition-all text-left relative ${
                        selectedRole === r.role ? 'border-primary bg-primary/5 shadow-lg' : 'border-stone-50 dark:border-stone-800'
                      }`}
                    >
                      <span className={`material-symbols-outlined mb-2 ${selectedRole === r.role ? 'text-primary' : 'text-stone-300'}`}>{r.icon}</span>
                      <h5 className="font-black text-[10px] uppercase dark:text-white leading-none">{r.title}</h5>
                      <p className="text-[8px] text-stone-400 mt-1 leading-tight line-clamp-1">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-4 animate-shake">
                {Object.values(errors)[0]}
              </p>
            )}
          </div>

          <div className="mt-10 space-y-4">
             <button 
               onClick={handleAction}
               disabled={isProcessing}
               className="w-full h-16 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
             >
               {isProcessing ? <span className="animate-spin material-symbols-outlined text-xl">refresh</span> : <span className="material-symbols-outlined text-xl">{mode === 'login' ? 'login' : 'arrow_forward'}</span>}
               {isProcessing ? 'Validando...' : (mode === 'login' ? 'Entrar al Ecosistema' : 'Continuar Registro')}
             </button>
             {(mode === 'signup' && signupStep === 'contact') && (
               <button onClick={() => setSignupStep('identity')} className="w-full text-[9px] font-black text-stone-300 uppercase tracking-widest hover:text-stone-500">Volver a Identidad</button>
             )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};
