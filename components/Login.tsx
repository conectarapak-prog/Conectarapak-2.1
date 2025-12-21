
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
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const roles: { role: UserRole, title: string, desc: string, icon: string, color: string }[] = [
    { role: 'entrepreneur', title: 'Emprendedor', desc: 'Lidero proyectos de impacto circular.', icon: 'lightbulb', color: 'bg-primary' },
    { role: 'investor_natural', title: 'Inversor Natural', desc: 'Persona natural buscando diversificar.', icon: 'person', color: 'bg-blue-600' },
    { role: 'investor_legal', title: 'Inversor Jurídico', desc: 'Instituciones o fondos de inversión.', icon: 'corporate_fare', color: 'bg-indigo-600' },
    { role: 'advisor', title: 'Asesor / Mentor', desc: 'Experto en sostenibilidad y auditoría.', icon: 'verified_user', color: 'bg-amber-600' }
  ];

  const validateRut = (rut: string) => {
    const cleanRut = rut.replace(/[^0-9kK]/g, '');
    if (cleanRut.length < 8) return false;
    // Implementación básica de validación de formato RUT
    return /^[0-9]+[0-9kK]{1}$/.test(cleanRut);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (mode === 'login') {
      if (!email.trim()) newErrors.email = 'El identificador es obligatorio.';
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
        name: name || 'Usuario Circular', 
        role: selectedRole || 'entrepreneur', 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || documentId}`,
        identifier: email,
        phone: phone,
        documentId: documentId,
        documentType: documentType,
        isVerified: true
      });
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-earth-surface/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="max-w-5xl w-full bg-white dark:bg-earth-card rounded-[3rem] md:rounded-[5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden relative animate-[scale-up_0.5s_ease-out] border border-stone-100 dark:border-stone-800">
        
        {/* Lado A: Branding e Info Seguridad */}
        <div className="lg:w-2/5 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-[100px] -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="size-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 border border-white/20">
              <span className="material-symbols-outlined text-4xl">shield_person</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase font-display leading-[0.9]">
              Identidad <br/><span className="text-primary-light italic">Verificada</span>
            </h1>
            <p className="text-primary-light/80 text-lg mt-8 font-medium">
              Vinculamos tu documento legal con tu perfil digital para garantizar la transparencia en Tarapacá.
            </p>
          </div>
          
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3 bg-black/10 p-4 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-primary-light">fingerprint</span>
                <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Cifrado de grado bancario activo</p>
             </div>
             <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">CONECTARAPAK SECURE-ID v4.0</p>
          </div>
        </div>

        {/* Lado B: Formulario Multinivel */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white dark:bg-earth-card min-h-[650px]">
          
          {/* Header Switcher */}
          <div className="flex justify-between items-center mb-10">
            <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
              <button 
                onClick={() => { setMode('login'); setErrors({}); }}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white dark:bg-stone-800 text-primary shadow-sm' : 'text-stone-400'}`}
              >
                Entrar
              </button>
              <button 
                onClick={() => { setMode('signup'); setSignupStep('identity'); setErrors({}); }}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'signup' || mode === 'role_selection' ? 'bg-white dark:bg-stone-800 text-primary shadow-sm' : 'text-stone-400'}`}
              >
                Registro
              </button>
            </div>
            {mode === 'login' && (
              <button onClick={() => setMode('recovery')} className="text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-primary">
                ¿Perdiste el acceso?
              </button>
            )}
          </div>

          <div className="space-y-6 animate-fade-in" key={`${mode}-${signupStep}`}>
            
            {mode === 'recovery' ? (
              <div className="space-y-8 py-4">
                <div className="size-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                   <span className="material-symbols-outlined text-3xl">emergency_home</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Recuperación Crítica</h3>
                <p className="text-sm text-stone-500 leading-relaxed">Si no cuentas con acceso a tu correo o teléfono, el protocolo requiere:</p>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                      <span className="material-symbols-outlined text-primary">badge</span>
                      <p className="text-[10px] font-black uppercase tracking-widest">Cédula de Identidad Física</p>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                      <span className="material-symbols-outlined text-primary">face_retouching_natural</span>
                      <p className="text-[10px] font-black uppercase tracking-widest">Validación Biométrica Facial</p>
                   </div>
                </div>
                <button onClick={() => window.location.href='mailto:conectarapak@outlook.cl?subject=Recuperación%20Biométrica'} className="w-full h-16 bg-stone-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Contactar Soporte</button>
                <button onClick={() => setMode('login')} className="w-full text-[10px] font-black text-stone-400 uppercase tracking-widest">Volver</button>
              </div>
            ) : mode === 'role_selection' ? (
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Paso Final: Selecciona tu Perfil</h3>
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
              </div>
            ) : mode === 'signup' && signupStep === 'identity' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Nombre Completo o Entidad</label>
                   <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[2rem] py-5 px-8 text-lg outline-none transition-all ${errors.name ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    placeholder="Ej: Juan Pérez o EcoPyme SpA"
                   />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Tipo Doc.</label>
                      <select 
                        value={documentType} onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                        className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-2xl py-5 px-6 text-sm font-bold outline-none"
                      >
                         <option value="RUT">RUT (Chile)</option>
                         <option value="DNI">DNI</option>
                         <option value="PASSPORT">Pasaporte</option>
                         <option value="OTHER">Otro</option>
                      </select>
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">N° de Documento</label>
                      <input 
                        type="text" value={documentId} onChange={(e) => setDocumentId(e.target.value)}
                        className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[2rem] py-5 px-8 text-lg outline-none transition-all ${errors.documentId ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                        placeholder={documentType === 'RUT' ? "12.345.678-9" : "N° Identificación"}
                      />
                   </div>
                </div>
              </div>
            ) : mode === 'signup' && signupStep === 'contact' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Correo Electrónico</label>
                   <input 
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[2rem] py-5 px-8 text-lg outline-none transition-all ${errors.email ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    placeholder="tu@correo.cl"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Teléfono de Contacto</label>
                   <div className="relative">
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-stone-400 font-bold">+56</span>
                      <input 
                        type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[2rem] py-5 pl-20 pr-8 text-lg outline-none transition-all ${errors.phone ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                        placeholder="9 8153 4890"
                      />
                   </div>
                </div>
              </div>
            ) : (
              /* MODO LOGIN SIMPLE */
              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Email o RUT</label>
                   <input 
                    type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-stone-50 dark:bg-stone-900 border-2 rounded-[2rem] py-5 px-8 text-lg outline-none transition-all ${errors.email ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                    placeholder="identificador@red.cl"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Contraseña de Red</label>
                   <input 
                    type="password"
                    className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-[2rem] py-5 px-8 text-lg outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                   />
                </div>
              </div>
            )}
            
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4 animate-shake">
                {Object.values(errors)[0]}
              </p>
            )}
          </div>

          <div className="mt-12 space-y-4">
             <button 
               onClick={handleAction}
               disabled={isProcessing}
               className="w-full h-20 bg-primary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
             >
               {isProcessing ? <span className="animate-spin material-symbols-outlined text-3xl">refresh</span> : <span className="material-symbols-outlined text-3xl">{mode === 'role_selection' ? 'verified' : (signupStep === 'contact' ? 'arrow_forward' : 'login')}</span>}
               {isProcessing ? 'Validando...' : (mode === 'login' ? 'Entrar al Ecosistema' : mode === 'signup' ? (signupStep === 'identity' ? 'Siguiente: Contacto' : 'Siguiente: Perfil') : 'Finalizar Registro')}
             </button>
             {mode === 'signup' && signupStep === 'contact' && (
               <button onClick={() => setSignupStep('identity')} className="w-full text-[10px] font-black text-stone-400 uppercase tracking-widest">Volver a Identidad</button>
             )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scale-up { from { opacity: 0; transform: scale(0.9) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};
