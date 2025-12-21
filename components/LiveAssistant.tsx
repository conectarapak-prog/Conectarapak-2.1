
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

export const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState<{user: string, ai: string}>({user: '', ai: ''});
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Manejo de Audio
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              const binary = atob(audioData);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = audioContextRef.current!.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
              
              const source = audioContextRef.current!.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current!.destination);
              source.onended = () => setIsSpeaking(false);
              source.start();
            }

            // Manejo de Transcripciones
            if (message.serverContent?.inputTranscription) {
              setTranscription(prev => ({ ...prev, user: message.serverContent?.inputTranscription?.text || '' }));
            }
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => ({ ...prev, ai: prev.ai + message.serverContent?.outputTranscription?.text }));
            }
            if (message.serverContent?.turnComplete) {
              // Limpiar después de unos segundos
              setTimeout(() => setTranscription({user: '', ai: ''}), 5000);
            }
          },
          onerror: (e) => console.error(e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'Eres un asistente experto en economía circular de Iquique. Responde siempre de forma breve y amena.'
        }
      });
      sessionRef.current = sessionPromise;
    } catch (e) {
      console.error(e);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  return (
    <div className="fixed bottom-24 right-6 z-[110] flex flex-col items-end gap-4">
      {isActive && (transcription.user || transcription.ai) && (
        <div className="max-w-[300px] bg-white dark:bg-earth-card p-6 rounded-[2.5rem] shadow-2xl border border-primary/20 animate-fade-in space-y-4">
           {transcription.user && (
             <p className="text-[10px] font-medium text-stone-500 italic">Tú: {transcription.user}</p>
           )}
           {transcription.ai && (
             <p className="text-xs font-black text-primary leading-tight">Gemini: {transcription.ai}</p>
           )}
        </div>
      )}

      <div className="flex items-center gap-4">
        {isActive && (
          <div className="bg-white/90 dark:bg-earth-card/90 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20 flex items-center gap-3 animate-fade-in">
             <div className={`size-2 rounded-full ${isSpeaking ? 'bg-primary animate-ping' : 'bg-stone-300'}`}></div>
             <p className="text-[9px] font-black uppercase tracking-widest text-stone-500">Live Assistant</p>
          </div>
        )}
        <button
          onClick={isActive ? stopSession : startSession}
          className={`size-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 group relative ${
            isActive ? 'bg-red-500' : 'bg-stone-900 hover:bg-stone-800'
          }`}
        >
          {isActive && <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>}
          <span className="material-symbols-outlined text-3xl">
            {isActive ? 'mic' : 'settings_voice'}
          </span>
          <div className="absolute right-full mr-4 px-4 py-2 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
             {isActive ? 'Detener Asesor' : 'Consultar por Voz'}
          </div>
        </button>
      </div>
    </div>
  );
};
