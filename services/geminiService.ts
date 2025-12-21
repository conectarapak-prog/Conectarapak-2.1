
import { GoogleGenAI, Type, Modality } from "@google/genai";

const createAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Genera un insight educativo o estratégico profundo basado en el rol del usuario.
 */
export const getPostInsight = async (postTitle: string, postContent: string, userRole: string = 'entrepreneur') => {
  const ai = createAI();
  
  const roleContexts: Record<string, string> = {
    'entrepreneur': 'Enfócate en consejos técnicos para escalar el negocio, mejorar la sostenibilidad y formalización.',
    'investor_natural': 'Enfócate en el impacto social, la transparencia del proyecto y el valor comunitario en Tarapacá.',
    'investor_legal': 'Enfócate en el análisis de riesgo, cumplimiento de políticas públicas y retorno de impacto ESG.',
    'advisor': 'Enfócate en identificar brechas de conocimiento y oportunidades para mentoría técnica o alianzas estratégicas.'
  };

  const context = roleContexts[userRole] || roleContexts['entrepreneur'];

  try {
    const prompt = `Actúa como un Asesor Senior de CONECTARAPAK especializado en el perfil: ${userRole}. 
    Analiza este post: "${postTitle}" - Contenido: "${postContent}"
    
    ${context}

    Genera un INSIGHT breve (3 párrafos cortos) con:
    1. Análisis del hito desde la perspectiva del rol ${userRole}.
    2. Cómo esto impulsa el desarrollo regional en Tarapacá.
    3. Una acción o lección clave recomendada para este usuario específico.
    
    Usa un tono profesional, técnico pero accesible.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) { 
    return "No se pudo generar el insight personalizado en este momento."; 
  }
};

export const researchEducationalAgent = async (topic: string) => {
  const ai = createAI();
  try {
    const prompt = `Actúa como un Agente de Inteligencia Educativa para la Región de Tarapacá.
    INVESTIGA Y CONCATENA información real y actual sobre: "${topic}"
    
    DEBES RESPONDER SIGUIENDO ESTA ESTRUCTURA EXACTA:
    [CONTEXTO] [LOGICA] [VISUAL] [IMPACTO]`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], temperature: 0.1 },
    });
    return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) { return { text: "Error.", sources: [] }; }
};

export const searchRegionalInsights = async (query: string, projectContext?: string) => {
  const ai = createAI();
  try {
    const prompt = `Analiza: "${query}" en el contexto de Tarapacá. Estructura: [HECHOS] [ESTRATEGIA] [INFOGRAFIA] [ACCIONES]`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], temperature: 0.1 },
    });
    return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) { return { text: "Error.", sources: [] }; }
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
      contents: `Resume: ${title}. ${excerpt}`,
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

export const analyzeProjectRisk = async (t: string, d: string) => "Análisis de riesgo moderado.";
export const generateProjectSuggestions = async (p: any) => "Sugerencias de optimización.";
export const generateProfileOptimization = async (role: string, data: any) => {
  const ai = createAI();
  try {
    const prompt = `Genera un reporte de optimización IA para un usuario de tipo ${role} que tiene los parámetros: ${JSON.stringify(data)}. 
    Enfócate en cómo mejorar su eficiencia en el ecosistema circular de Tarapacá.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) { return "Error al generar optimización."; }
};

// Fix: Add missing getEducationalContent export used in Education.tsx
export const getEducationalContent = async (topic: string) => {
  const ai = createAI();
  try {
    const prompt = `Actúa como un experto en educación sobre economía circular. 
    Explica en detalle el concepto de: "${topic}". 
    Resalta los puntos clave en negrita y proporciona ejemplos relevantes para la Región de Tarapacá, Chile.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) { return null; }
};

// Fix: Add missing getCircularEconomyAdvice export used in Recommendations.tsx
export const getCircularEconomyAdvice = async (context: string) => {
  const ai = createAI();
  try {
    const prompt = `Como consultor experto en sostenibilidad, analiza el siguiente contexto y ofrece consejos estratégicos de economía circular: "${context}". 
    Enfócate en la realidad económica y social de Tarapacá.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) { return null; }
};
