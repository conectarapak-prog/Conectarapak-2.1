
import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: '¡Hola! Soy el asistente de CONECTARAPAK. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await getChatbotResponse(userMsg, messages);
    setMessages(prev => [...prev, { role: 'ai', text: response || 'No pude procesar tu mensaje.' }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] bg-white dark:bg-earth-card rounded-[2.5rem] shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden animate-fade-in">
          <div className="bg-primary p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined">smart_toy</span>
              <h3 className="font-bold text-sm tracking-widest uppercase">Asistente IA</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-stone-50 dark:bg-stone-900/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-bl-none shadow-sm border border-stone-100 dark:border-stone-700'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-stone-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-stone-100 dark:border-stone-700 animate-pulse flex gap-1">
                   <div className="size-1.5 bg-primary rounded-full animate-bounce"></div>
                   <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu duda..."
              className="flex-1 bg-stone-100 dark:bg-earth-card border-none rounded-xl text-xs px-4 py-3 focus:ring-1 focus:ring-primary dark:text-white"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="size-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-hover disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`size-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${isOpen ? 'bg-earth-surface rotate-90 scale-90' : 'bg-primary hover:scale-110'}`}
      >
        <span className="material-symbols-outlined text-3xl">
          {isOpen ? 'close' : 'chat_bubble'}
        </span>
      </button>
    </div>
  );
};
