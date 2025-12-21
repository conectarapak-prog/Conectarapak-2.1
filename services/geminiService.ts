
import { GoogleGenAI, Type, Modality } from "@google/genai";

const createAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Searches for regional insights using Google Search grounding.
 * Extracts URLs from groundingChunks for transparency.
 */
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

/**
 * Generates single-speaker audio from text using prebuilt voices.
 */
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

/**
 * Summarizes news items into punchy strategic insights.
 */
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

/**
 * Generates regional trends analysis for circular economy.
 */
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

/**
 * Performs a deep technical audit using reasoning models.
 */
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

/**
 * Handles chatbot interactions with memory using Gemini 3 Pro.
 */
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

/**
 * Generates AI images with standard 1K/16:9 config.
 */
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

/**
 * Analyzes visual data using vision-capable Gemini models.
 */
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

// --- FIXING MISSING EXPORTS ---

/**
 * Analyzes project risk for administrative moderation.
 * Fix for error in pages/AdminModeration.tsx
 */
export const analyzeProjectRisk = async (title: string, description: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Realiza un análisis de riesgo e integridad para el siguiente proyecto en la Región de Tarapacá:
                 Título: ${title}
                 Descripción: ${description}
                 Busca indicios de greenwashing, inconsistencias técnicas o riesgos de fraude.`,
      config: { thinkingConfig: { thinkingBudget: 8000 } }
    });
    return response.text;
  } catch (error) { return "Error al realizar el escaneo de riesgo."; }
};

/**
 * Generates project optimization suggestions for predictive analysis.
 * Fix for error in pages/PredictiveAnalysis.tsx
 */
export const generateProjectSuggestions = async (data: { title: string, goal: number, duration: number }) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Optimiza los parámetros de esta campaña: 
                 Proyecto: ${data.title}
                 Meta: ${data.goal} USD
                 Duración: ${data.duration} días.
                 Sugiere mejoras basadas en datos de éxito de crowdfunding circular.`,
    });
    return response.text;
  } catch (error) { return "No se pudieron generar sugerencias."; }
};

/**
 * Provides strategic advice on circular economy topics.
 * Fix for error in pages/Recommendations.tsx
 */
export const getCircularEconomyAdvice = async (query: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Brinda asesoría estratégica sobre economía circular aplicada a: ${query}`,
    });
    return response.text;
  } catch (error) { return "Error al obtener asesoría estratégica."; }
};

/**
 * Generates educational lessons about circular economy.
 * Fix for error in pages/Education.tsx
 */
export const getEducationalContent = async (topic: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explica detalladamente el concepto de "${topic}" en el marco de la economía circular para un público emprendedor.`,
    });
    return response.text;
  } catch (error) { return "Error al recuperar contenido educativo."; }
};

/**
 * Optimizes user profile parameters for AISimulator.
 * Fix for error in components/AISimulator.tsx
 */
export const generateProfileOptimization = async (role: string, data: { val1: number, val2: number }) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Optimiza el perfil de un "${role}" con estos parámetros actuales: 
                 Valor 1: ${data.val1}
                 Valor 2: ${data.val2}
                 Proporciona 3 recomendaciones accionables para maximizar el impacto regional.`,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text;
  } catch (error) { return "Error al generar optimización de perfil."; }
};
