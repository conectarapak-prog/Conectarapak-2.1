
import React, { useState } from 'react';
import { getEducationalContent } from '../services/geminiService';

const PRESETS = [
  { term: 'Servitización', icon: 'room_service', color: 'text-blue-500' },
  { term: 'Upcycling', icon: 'auto_fix_high', color: 'text-purple-500' },
  { term: 'Ciclo Cerrado', icon: 'sync', color: 'text-green-500' },
  { term: 'Bio-materiales', icon: 'biotech', color: 'text-orange-500' },
];

export const Education: React.FC = () => {
  const [query, setQuery] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchContent = async (topic: string) => {
    setLoading(true);
    setContent(null);
    const result = await getEducationalContent(topic);
    setContent(result || 'No se encontró información.');
    setLoading(false);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const content = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-primary font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <div key={i} className="mb-2">{content}</div>;
    });
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-br from-primary/10 to-transparent p-10 rounded-[3rem] border border-primary/10">
        <div className="flex-1 space-y-4">
          <h2 className="text-5xl font-extrabold tracking-tighter dark:text-white leading-tight">
            Academia <span className="text-primary italic">Circular</span>
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg max-w-md">
            El conocimiento es la materia prima más valiosa. Aprende a diseñar sin generar residuos.
          </p>
        </div>
        <div className="flex-1 w-full">
          <div className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchContent(query)}
              placeholder="¿Qué quieres aprender hoy?"
              className="w-full bg-white dark:bg-earth-card border-2 border-stone-200 dark:border-stone-800 rounded-3xl py-6 px-8 text-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-2xl"
            />
            <button 
              onClick={() => fetchContent(query)}
              disabled={loading || !query.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white p-4 rounded-2xl hover:bg-primary-hover shadow-lg transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined font-bold">search</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PRESETS.map((p) => (
          <button
            key={p.term}
            onClick={() => fetchContent(p.term)}
            className="bg-white dark:bg-earth-card p-6 rounded-3xl border border-stone-100 dark:border-stone-800 hover:border-primary transition-all flex flex-col items-center gap-3 group"
          >
            <span className={`material-symbols-outlined text-4xl ${p.color} group-hover:scale-110 transition-transform`}>
              {p.icon}
            </span>
            <span className="font-bold text-sm dark:text-white">{p.term}</span>
          </button>
        ))}
      </div>

      {(loading || content) && (
        <div className="bg-white dark:bg-earth-card border border-stone-100 dark:border-stone-800 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-earth-card/80 backdrop-blur-md flex flex-col items-center justify-center z-10">
              <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-primary uppercase tracking-widest text-sm">Consultando a los expertos...</p>
            </div>
          )}
          {content && (
            <div className="prose dark:prose-invert max-w-none">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <h3 className="text-3xl font-extrabold m-0">Lección del Día</h3>
              </div>
              <div className="text-lg leading-relaxed text-stone-600 dark:text-stone-300">
                {renderFormattedText(content)}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-earth-surface p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10">
        <div className="size-40 shrink-0 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/50">
          <span className="material-symbols-outlined text-7xl text-primary">school</span>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">¿Necesitas una guía paso a paso?</h3>
          <p className="text-stone-400">Podemos generar una hoja de ruta específica para transformar tu negocio lineal en uno circular en menos de 10 segundos.</p>
          <button 
            onClick={() => fetchContent("Hoja de ruta para un negocio de moda sostenible")}
            className="bg-white text-earth-surface px-8 py-3 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all"
          >
            Generar Hoja de Ruta IA
          </button>
        </div>
      </div>
    </div>
  );
};
