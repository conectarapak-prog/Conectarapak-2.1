
import { GoogleGenAI, Type, Modality } from "@google/genai";

const createAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Agente de Investigación para Educación de Calidad
 * Busca, concatena y estructura información para infografías.
 */
export const researchEducationalAgent = async (topic: string) => {
  const ai = createAI();
  try {
    const prompt = `Actúa como un Agente de Inteligencia Educativa para la Región de Tarapacá.
    INVESTIGA Y CONCATENA información real y actual sobre: "${topic}"
    
    OBJETIVO: Crear un blueprint técnico para una infografía educativa.
    
    DEBES RESPONDER SIGUIENDO ESTA ESTRUCTURA EXACTA (usa los encabezados tal cual):
    
    [CONTEXTO]
    Un párrafo breve con datos actuales y relevancia regional en Tarapacá.
    
    [LOGICA]
    Paso 1: Explicación corta.
    Paso 2: Explicación corta.
    Paso 3: Explicación corta.
    
    [VISUAL]
    - Idea 1 para gráfico.
    - Idea 2 para gráfico.
    - Idea 3 para gráfico.
    
    [IMPACTO]
    Un mensaje potente y corto sobre educación o sostenibilidad.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        temperature: 0.1 // Menor temperatura para mayor consistencia en el formato
      },
    });
    
    return {
      text: response.text || "No se pudo concatenar la información.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) { 
    return { text: "Error al invocar al agente de investigación.", sources: [] }; 
  }
};

// ... (Resto de funciones se mantienen iguales)
export const searchRegionalInsights = async (query: string, projectContext?: string) => {
  const ai = createAI();
  try {
    const prompt = projectContext 
      ? `Actúa como un Consultor Senior en Estrategia Circular para Tarapacá.
         ANALIZA: "${query}"
         PROYECTO OBJETIVO: "${projectContext}"

         ESTRUCTURA OBLIGATORIA DE RESPUESTA:
         [HECHOS]
         (Lista de 3-4 puntos clave sobre la realidad territorial encontrada)
         
         [ESTRATEGIA]
         (Análisis profundo de cómo esto potencia o impacta al proyecto mencionado)

         [INFOGRAFIA]
         (Crea una explicación simplificada para el ciudadano común que resuelva dudas típicas sobre este tema, uniendo la visión técnica con la comunitaria)
         
         [ACCIONES]
         (3 pasos concretos e inmediatos que el usuario debe tomar)`
      : `Analiza de forma técnica y actual: "${query}" en el contexto de la Región de Tarapacá. Estructura con encabezados claros.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        temperature: 0.1 
      },
    });
    
    return {
      text: response.text || "Sin resultados.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) { 
    return { text: "Error en la conexión con el motor de inteligencia.", sources: [] }; 
  }
};

export const generateSpeech = async (text: string, voice: 'Kore' | 'Puck' | 'Zephyr' = 'Zephyr') => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Dile esto con entusiasmo: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) { return null; }
};

export const summarizeNews = async (title: string, excerpt: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Resume este insight estratégico en 2 frases potentes: ${title}. ${excerpt}`,
    });
    return response.text;
  } catch (error) { return null; }
};

export const generateRegionalTrends = async () => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Analiza 3 tendencias actuales de economía circular en la zona norte de Chile.",
    });
    return response.text;
  } catch (error) { return null; }
};

export const deepAuditProject = async (projectData: any) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Auditoría técnica de: ${JSON.stringify(projectData)}`,
      config: { thinkingConfig: { thinkingBudget: 32768 } }
    });
    return response.text;
  } catch (error) { return "Error."; }
};

export const getChatbotResponse = async (userMessage: string, history: any[]) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMessage }] }],
      config: { thinkingConfig: { thinkingBudget: 16000 } }
    });
    return response.text;
  } catch (error) { return "Error."; }
};

export const generateImagePro = async (prompt: string, size: any, ratio: any) => {
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

export const analyzeImageWithPro = async (base64Image: string, prompt: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/png' } }, { text: prompt }] },
      config: { thinkingConfig: { thinkingBudget: 8000 } }
    });
    return response.text;
  } catch (error) { return "Error."; }
};

export const analyzeProjectRisk = async (t: string, d: string) => "Análisis de riesgo moderado basado en estándares regionales.";
export const generateProjectSuggestions = async (p: any) => "Sugerencias de optimización técnica.";
export const getCircularEconomyAdvice = async (p: any) => "Asesoría estratégica...";
export const getEducationalContent = async (p: any) => "Contenido educativo...";
export const generateProfileOptimization = async (r: string, d: any) => "Perfil optimizado.";
