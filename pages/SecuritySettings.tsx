
import React, { useState } from 'react';

interface SecuritySettingsProps {
  onBack: () => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onBack }) => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [stealthMode, setStealthMode] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const SettingToggle = ({ label, desc, active, onToggle, icon }: any) => (
    <div className="flex items-center justify-between p-6 bg-stone-50 dark:bg-stone-900/50 rounded-3xl border border-transparent hover:border-stone-100 dark:hover:border-stone-800 transition-all group">
      <div className="flex items-center gap-5">
        <div className="size-10 bg-white dark:bg-stone-800 rounded-xl flex items-center justify-center text-stone-400 group-hover:text-primary transition-colors">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest dark:text-white">{label}</h4>
          <p className="text-[10px] text-stone-500 font-medium leading-relaxed mt-0.5">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-primary' : 'bg-stone-200 dark:bg-stone-700'}`}
      >
        <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? 'translate-x-7' : 'translate-x-1'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-10 py-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Centro de <span className="text-primary italic">Seguridad</span></h2>
          <p className="text-stone-500 font-medium text-sm">Gestiona la protección de tus activos circulares.</p>
        </div>
        <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-primary transition-colors">
          Volver
        </button>
      </div>

      <div className="bg-white dark:bg-earth-card rounded-[3rem] border border-stone-100 dark:border-stone-800 p-10 shadow-xl space-y-8">
        
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] ml-2">Blindaje de Cuenta</h3>
          <div className="space-y-2">
            <SettingToggle 
              label="Autenticación 2FA" 
              desc="Requiere un código regional adicional al ingresar."
              active={mfaEnabled}
              onToggle={() => setMfaEnabled(!mfaEnabled)}
              icon="security"
            />
            <SettingToggle 
              label="Alertas de Inicio" 
              desc="Notificar por WhatsApp ante conexiones anómalas."
              active={loginAlerts}
              onToggle={() => setLoginAlerts(!loginAlerts)}
              icon="notifications_active"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] ml-2">Privacidad de Red</h3>
          <div className="space-y-2">
            <SettingToggle 
              label="Modo Stealth" 
              desc="Oculta tus inversiones de la red pública global."
              active={stealthMode}
              onToggle={() => setStealthMode(!stealthMode)}
              icon="visibility_off"
            />
          </div>
        </div>

        {/* Sesiones Recientes */}
        <div className="pt-6 border-t border-stone-100 dark:border-stone-800 space-y-6">
           <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] ml-2">Historial de Acceso</h3>
           <div className="space-y-3">
              {[
                { loc: 'Iquique, Tarapacá', device: 'Chrome / MacOS', status: 'Activo ahora' },
                { loc: 'Alto Hospicio, Tarapacá', device: 'App / Android', status: 'Ayer, 22:15' }
              ].map((session, i) => (
                <div key={i} className="flex justify-between items-center px-6 py-4 bg-stone-50 dark:bg-stone-900/30 rounded-2xl">
                   <div>
                      <p className="text-[10px] font-black dark:text-white uppercase leading-none">{session.loc}</p>
                      <p className="text-[9px] text-stone-400 mt-1 uppercase">{session.device}</p>
                   </div>
                   <span className="text-[8px] font-black text-primary uppercase tracking-widest">{session.status}</span>
                </div>
              ))}
           </div>
        </div>

        <button className="w-full py-5 border-2 border-red-500/20 text-red-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
          Cerrar Todas las Sesiones
        </button>

      </div>
    </div>
  );
};
