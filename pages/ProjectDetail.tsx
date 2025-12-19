import React, { useState, useEffect } from 'react';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [localRaised, setLocalRaised] = useState(project.raised);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calcular porcentaje local para reflejar cambios inmediatos
  const localPercentage = Math.round((localRaised / project.goal) * 100);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `CONECTARAPAK - ${project.title}`,
      text: project.description,
      url: shareUrl,
    };

    if (navigator.share && (typeof navigator.canShare === 'undefined' || navigator.canShare(shareData))) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if ((error as Error).name !== 'AbortError') console.error(error);
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleSponsor = async () => {
    const finalAmount = isCustomMode ? parseInt(customAmount) : contributionAmount;
    if (isNaN(finalAmount) || finalAmount < 1000) {
      alert("Por favor ingresa un monto válido (mínimo $1.000 CLP)");
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLocalRaised(prev => prev + finalAmount);
    setIsProcessing(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowSponsorModal(false);
      setIsCustomMode(false);
      setCustomAmount('');
    }, 2500);
  };

  const currentDisplayAmount = isCustomMode ? (parseInt(customAmount) || 0) : contributionAmount;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10 animate-fade-in pb-20">
      {/* Header Info */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
          <span className="material-symbols-outlined text-sm">eco</span>
          {project.category}
        </div>
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter dark:text-white">
          {project.title}
        </h2>
        <p className="text-xl text-stone-500 dark:text-stone-400 font-medium max-w-3xl mx-auto leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-7 space-y-12">
          <div className="aspect-video rounded-[3rem] overflow-hidden bg-stone-900 shadow-2xl relative group border-4 border-white dark:border-stone-800">
            <img 
              src={project.image} 
              alt="Main Project" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="size-24 bg-primary text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group/btn">
                <span className="material-symbols-outlined text-6xl group-hover/btn:rotate-12 transition-transform">play_arrow</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-earth-card rounded-[3rem] p-10 border border-stone-100 dark:border-stone-800 shadow-sm">
            <h3 className="text-2xl font-black dark:text-white mb-6 uppercase tracking-tight">Acerca del Proyecto</h3>
            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed font-medium">
              Este proyecto ha sido validado por nuestro ecosistema **CONECTARAPAK** bajo estándares de economía circular regional.
              Su implementación garantiza una reducción directa en el uso de plásticos de un solo uso en la zona franca de Iquique.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-stone-50">
                <img src="https://picsum.photos/seed/circ1/600/400" className="w-full h-full object-cover" alt="Detail 1" />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-stone-50">
                <img src="https://picsum.photos/seed/circ2/600/400" className="w-full h-full object-cover" alt="Detail 2" />
              </div>
            </div>
          </div>
        </div>

        {/* Improved Stats Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-earth-card rounded-[3rem] p-10 border border-stone-200 dark:border-stone-800 shadow-2xl sticky top-28 space-y-10">
            
            {/* Project Stats Header */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <h4 className="text-4xl md:text-5xl font-black text-primary tracking-tighter">
                  ${localRaised.toLocaleString('es-CL')}
                </h4>
                <span className="text-stone-400 font-bold text-sm mb-1 uppercase tracking-widest">
                  de ${project.goal.toLocaleString('es-CL')}
                </span>
              </div>

              <div className="relative">
                <div className="h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-primary via-lime-400 to-primary-hover transition-all duration-1000 ease-out relative" 
                    style={{ width: `${Math.min(localPercentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                  </div>
                </div>
                {localPercentage > 100 && (
                   <div className="absolute -top-6 right-0 bg-accent text-white px-2 py-0.5 rounded text-[8px] font-black uppercase animate-bounce">
                     ¡Superado!
                   </div>
                )}
              </div>

              <p className="text-sm font-black text-stone-500 uppercase tracking-widest">
                {localPercentage}% financiado
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-8 border-y border-stone-100 dark:border-stone-800 py-8">
              <div className="space-y-1">
                <p className="text-3xl font-black dark:text-white tracking-tighter">850</p>
                <p className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em]">Patrocinadores</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black dark:text-white tracking-tighter">{project.daysLeft}</p>
                <p className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em]">Días restantes</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={() => setShowSponsorModal(true)}
                className="group w-full bg-primary hover:bg-primary-hover text-white h-20 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                Patrocinar este proyecto
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              <div className="flex gap-4">
                <button 
                  onClick={toggleSave}
                  className={`flex-1 h-16 rounded-[1.2rem] border-2 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${
                    isSaved 
                    ? 'bg-accent/10 border-accent text-accent' 
                    : 'bg-white dark:bg-earth-card border-stone-100 dark:border-stone-800 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${isSaved ? 'fill-1' : ''}`}>
                    {isSaved ? 'bookmark_added' : 'bookmark'}
                  </span> 
                  {isSaved ? 'Guardado' : 'Guardar'}
                </button>
                <button 
                  onClick={handleShare}
                  className={`flex-1 h-16 rounded-[1.2rem] border-2 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${
                    copied 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white dark:bg-earth-card border-stone-100 dark:border-stone-800 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {copied ? 'check_circle' : 'share'}
                  </span> 
                  {copied ? '¡Copiado!' : 'Compartir'}
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4 opacity-50">
               <span className="material-symbols-outlined text-sm">security</span>
               <p className="text-[9px] font-black uppercase tracking-widest">Transacción Protegida por Blockchain Tarapacá</p>
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Sponsor Modal Integration (High Fidelity) */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-earth-card w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 relative">
            
            {success ? (
              <div className="p-16 text-center space-y-6 animate-fade-in">
                <div className="size-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/40">
                  <span className="material-symbols-outlined text-6xl">verified</span>
                </div>
                <h3 className="text-4xl font-black dark:text-white tracking-tighter">¡Patrocinio Exitoso!</h3>
                <p className="text-stone-500 dark:text-stone-400 font-medium">Gracias por impulsar la economía circular de nuestra región.</p>
              </div>
            ) : (
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-black dark:text-white tracking-tight text-stone-800">Patrocinar Proyecto</h3>
                  <button onClick={() => setShowSponsorModal(false)} className="text-stone-800 hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl font-bold">close</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-1">Selecciona el monto</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1000, 5000, 10000, 20000, 50000, 100000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => { setContributionAmount(amount); setIsCustomMode(false); }}
                        className={`py-4 rounded-2xl font-black text-sm transition-all border-2 flex items-center justify-center ${
                          !isCustomMode && contributionAmount === amount 
                          ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                          : 'bg-stone-50 dark:bg-stone-900 border-transparent text-stone-600 dark:text-stone-400 hover:border-primary/30'
                        }`}
                      >
                        ${amount.toLocaleString('es-CL')}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Amount Field */}
                  <div className="relative group">
                    <div className={`absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors ${isCustomMode ? 'text-primary' : 'text-stone-400'}`}>
                      <span className="font-black text-lg">$</span>
                    </div>
                    <input 
                      type="number"
                      placeholder="Monto Personalizado"
                      value={customAmount}
                      onFocus={() => setIsCustomMode(true)}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className={`w-full h-16 pl-12 pr-6 bg-stone-50 dark:bg-stone-900 border-2 rounded-2xl font-black text-sm transition-all outline-none ${
                        isCustomMode ? 'border-primary ring-4 ring-primary/10' : 'border-transparent text-stone-600 dark:text-stone-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="bg-stone-50 dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total a Contribuir</p>
                    <p className="text-3xl font-black text-primary tracking-tighter">
                      ${currentDisplayAmount.toLocaleString('es-CL')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-white dark:bg-earth-card p-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
                    <div className="size-8 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">info</span>
                    </div>
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-relaxed">
                      Esta acción generará un impacto de <span className="text-primary">{Math.round(currentDisplayAmount * 0.12)}kg CO2</span> evitados.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleSponsor}
                  disabled={isProcessing || (isCustomMode && !customAmount)}
                  className="w-full bg-primary h-20 rounded-[1.8rem] text-white font-black text-lg shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="material-symbols-outlined animate-spin text-3xl">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                  )}
                  {isProcessing ? 'Procesando Pago...' : 'Confirmar Patrocinio'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
