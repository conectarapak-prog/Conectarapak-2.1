
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface EditProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onCancel: () => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<User>({ ...user });
  const [avatarSeed, setAvatarSeed] = useState(user.identifier || 'seed');

  const roles: { role: UserRole, title: string, icon: string }[] = [
    { role: 'entrepreneur', title: 'Emprendedor', icon: 'lightbulb' },
    { role: 'investor_natural', title: 'Inversor Natural', icon: 'person' },
    { role: 'investor_legal', title: 'Inversor Jurídico', icon: 'corporate_fare' },
    { role: 'advisor', title: 'Asesor / Mentor', icon: 'verified_user' }
  ];

  const handleAvatarRefresh = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
    setFormData(prev => ({ ...prev, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}` }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-10 py-10">
      <div className="space-y-2">
        <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Perfil <span className="text-primary italic">Digital</span></h2>
        <p className="text-stone-500 font-medium text-sm">Actualiza tu identidad en el ecosistema regional.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-earth-card rounded-[3rem] border border-stone-100 dark:border-stone-800 p-10 shadow-xl space-y-12">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-6">
           <div className="relative group">
              <img 
                src={formData.avatar} 
                className="size-32 rounded-[2.5rem] border-4 border-stone-50 dark:border-stone-800 shadow-xl object-cover bg-stone-50" 
                alt="Preview" 
              />
              <button 
                type="button"
                onClick={handleAvatarRefresh}
                className="absolute -bottom-2 -right-2 size-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:rotate-180 duration-500"
              >
                <span className="material-symbols-outlined text-xl">cached</span>
              </button>
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Identidad Digital Generada</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Nombre / Entidad</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-[1.5rem] py-5 px-8 text-lg font-bold outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ml-4">Rol en el Ecosistema</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(r => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: r.role }))}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                    formData.role === r.role ? 'border-primary bg-primary/5 text-primary' : 'border-stone-50 dark:border-stone-800 text-stone-400 grayscale hover:grayscale-0'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{r.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">{r.title}</span>
                </button>
              ))}
            </div>
            <p className="text-[9px] text-stone-400 italic px-4">Cambiar tu rol ajustará automáticamente tus herramientas en el Dashboard.</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-4 bg-stone-100 dark:bg-stone-800 text-stone-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95"
          >
            Guardar Cambios
          </button>
        </div>

      </form>
    </div>
  );
};
