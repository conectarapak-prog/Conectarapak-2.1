
import { GoogleGenAI, Type, Modality } from "@google/genai";

const createAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- CREATIVE TOOLS ---

// Generación de Voz (TTS)
export const generateSpeech = async (text: string, voice: 'Kore' | 'Puck' | 'Zephyr' = 'Zephyr') => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Dile esto con entusiasmo y claridad: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// Edición de Imágenes (Nano Banana Flash Image)
export const editImageWithIA = async (base64Image: string, prompt: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/png' } },
          { text: `Modifica esta imagen de producto circular siguiendo estrictamente: ${prompt}` },
        ],
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });
    for (const part of response.candidates?.[0].content.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
};

// --- ANALYSIS TOOLS ---

// Auditoría Profunda con Thinking (Gemini 3 Pro)
export const deepAuditProject = async (projectData: any) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Realiza una auditoría técnica profunda del siguiente proyecto circular para la Región de Tarapacá: ${JSON.stringify(projectData)}. Evalúa integridad circular, viabilidad económica y riesgos de greenwashing.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: "Eres un auditor técnico de la ONU especializado en economía circular regenerativa. Sé crítico, preciso y constructivo."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Deep Audit Error:", error);
    return "Error en la auditoría profunda.";
  }
};

// Búsqueda en Google con Grounding
export const searchRegionalInsights = async (query: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Busca información real y actual sobre este tema en Iquique y la Región de Tarapacá: ${query}`,
      config: { tools: [{ googleSearch: {} }] },
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) { 
    return null; 
  }
};

// --- CHAT & REASONING ---

export const getChatbotResponse = async (userMessage: string, history: { role: 'user' | 'ai', text: string }[]) => {
  const ai = createAI();
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: userMessage }] });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: "Eres el experto circular de Tarapacá. Usa razonamiento profundo para estrategias de impacto.",
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text;
  } catch (error) { return "Error de conexión."; }
};

// Generación de Imagen Pro
export const generateImagePro = async (prompt: string, size: "1K" | "2K" | "4K", ratio: "1:1" | "16:9" | "9:16") => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { imageSize: size, aspectRatio: ratio } }
    });
    for (const part of response.candidates?.[0].content.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) { return null; }
};

// Análisis de Imagen Pro
export const analyzeImageWithPro = async (base64Image: string, prompt: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/png' } },
          { text: prompt }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 8000 }
      }
    });
    return response.text;
  } catch (error) { return "Error analizando."; }
};

export const decodeBase64Audio = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Otras exportaciones requeridas para compatibilidad
export const estimateCarbonImpact = async (title: string, description: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Estima impacto CO2 para: ${title} - ${description}`,
    });
    return response.text;
  } catch (error) { return "0kg CO2"; }
};

export const analyzeProjectRisk = async (title: string, description: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analiza riesgo para: ${title}`,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text;
  } catch (error) { return "Riesgo no evaluado."; }
};

export const generateProjectSuggestions = async (data: any) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Sugerencias para: ${JSON.stringify(data)}`,
    });
    return response.text;
  } catch (error) { return "Sin sugerencias."; }
};

export const getCircularEconomyAdvice = async (p: any) => "Consejo circular...";
export const getEducationalContent = async (p: any) => "Contenido educativo...";
export const summarizeNews = async (t: string, e: string) => "Resumen...";
export const generateRegionalTrends = async () => "Tendencias...";
export const generateProfileOptimization = async (r: string, d: any) => "Optimización...";
