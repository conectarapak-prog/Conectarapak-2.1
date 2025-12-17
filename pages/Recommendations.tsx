
import React, { useState, useEffect, useRef } from 'react';
import { getCircularEconomyAdvice } from '../services/geminiService';

export const Recommendations: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: '¡Hola! Soy tu asesor de circularidad en **CONECTARAPAK**. Mi objetivo es ayudarte a transformar tus ideas en modelos de negocio regenerativos.\n\n¿En qué puedo apoyarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const aiResponse = await getCircularEconomyAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || 'No pude procesar tu solicitud.' }]);
    setLoading(false);
  };

  // Función simple para renderizar negritas y saltos de línea sin dependencias externas pesadas
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Procesar negritas **texto**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const content = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-bold text-primary-hover">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <React.Fragment key={i}>
          {content}
          <br />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[75vh] gap-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold dark:text-white tracking-tight flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-primary text-4xl">psychology_alt</span>
          Asesoría de Impacto IA
        </h2>
        <p className="text-stone-500 dark:text-stone-400">Optimiza la circularidad de tus ideas con inteligencia artificial especializada.</p>
      </div>

      <div className="flex-1 bg-white dark:bg-earth-card border border-stone-200 dark:border-stone-800 rounded-3xl flex flex-col overflow-hidden shadow-xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-stone-50/30 dark:bg-stone-900/10">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm transition-all ${
                m.role === 'user' 
                ? 'bg-primary text-white rounded-br-none border border-primary/20' 
                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-bl-none border border-stone-100 dark:border-stone-700'
              }`}>
                <div className="whitespace-pre-wrap">
                  {renderFormattedText(m.text)}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-stone-800 px-5 py-4 rounded-2xl rounded-bl-none border border-stone-100 dark:border-stone-700 animate-pulse flex gap-2 items-center">
                <div className="size-2 bg-primary rounded-full animate-bounce"></div>
                <div className="size-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="size-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs font-bold text-stone-400 ml-2">Pensando...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex gap-3 items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ej: ¿Cómo puedo aplicar las 9R a mi proyecto de textiles?"
            className="flex-1 bg-stone-50 dark:bg-earth-card border-stone-200 dark:border-stone-800 rounded-2xl text-sm px-5 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="size-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-30 disabled:grayscale"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
      
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
           <span className="material-symbols-outlined text-sm">verified_user</span> IA Verificada
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
           <span className="material-symbols-outlined text-sm">encrypted</span> Privacidad Protegida
        </div>
      </div>
    </div>
  );
};
