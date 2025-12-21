
import { GoogleGenAI, Type, Modality } from "@google/genai";

const createAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Genera un marco estratégico estructurado (VPC, Lean Canvas o PESTEL)
 */
export const generateStrategicFramework = async (frameworkType: string, projectContext: string) => {
  const ai = createAI();
  try {
    const prompt = `Actúa como un Consultor Senior de Estrategia y Economía Circular.
    
    HERRAMIENTA: ${frameworkType}
    CONTEXTO DEL PROYECTO: "${projectContext}"
    UBICACIÓN: Región de Tarapacá, Chile (Iquique, Alto Hospicio, Pozo Almonte).

    TAREA: Genera un informe estratégico profundo dividido en 4-5 secciones.
    
    REGLAS CRÍTICAS:
    1. Para cada concepto técnico difícil (ej: "Propuesta de Valor", "Pains", "Revenue Streams", "Escalabilidad", "PESTEL"), incluye una breve aclaración pedagógica entre paréntesis.
    2. Adapta los datos a la realidad local de Tarapacá: Menciona la ZOFRI, el Puerto, la Minería, el clima desértico o el borde costero según corresponda.
    3. Estructura usando títulos con "### ".
    4. Usa un tono que empodere al usuario pero que sea técnicamente riguroso.
    5. No uses introducciones vacías, ve directo al análisis.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) { 
    return "Error al generar el marco estratégico. Por favor, intenta de nuevo."; 
  }
};

/**
 * Analiza el impacto específico de un monto de inversión con un enfoque ultra-conciso.
 */
export const analyzeInvestmentImpact = async (projectName: string, amount: number, percentage: number) => {
  const ai = createAI();
  try {
    const prompt = `Actúa como un Analista de Riesgo ESG. 
    Proyecto: "${projectName}" | Inyección: $${amount.toLocaleString()} CLP.
    
    Genera un INSIGHT ESTRATÉGICO en 3 bloques exactos:
    1. [DESBLOQUEO TÉCNICO]: Qué hardware/software específico se adquiere (máx 15 palabras).
    2. [KPI PROYECTADO]: El impacto numérico inmediato en sostenibilidad.
    3. [DIVERSIFICACIÓN]: Un nodo regional complementario en Tarapacá.
    
    Usa un estilo minimalista, técnico y directo. Evita introducciones.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) { 
    return "Análisis no disponible."; 
  }
};

/**
 * Auditoría Profunda: Transforma el reporte en un conjunto de hitos técnicos.
 */
export const deepAuditProject = async (projectData: any) => {
  const ai = createAI();
  try {
    const prompt = `Realiza una AUDITORÍA TÉCNICA CRÍTICA para el proyecto: ${JSON.stringify(projectData)}.
    
    ESTRUCTURA OBLIGATORIA:
    ### 01. VIABILIDAD TÉCNICA
    Analiza la arquitectura del proyecto en 2 frases.
    
    ### 02. ANÁLISIS DE RIESGOS
    Identifica el "Punto de Falla" más probable.
    
    ### 03. IMPACTO TARAPACÁ
    Efecto directo en el PIB regional o empleabilidad local.
    
    Usa negritas para conceptos clave. Sé directo, casi telegráfico.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 16000 } }
    });
    return response.text;
  } catch (error) { return "Error en auditoría."; }
};

export const getPostInsight = async (postTitle: string, postContent: string, userRole: string = 'entrepreneur') => {
  const ai = createAI();
  try {
    const prompt = `Rol: ${userRole}. Analiza el post "${postTitle}". 
    Proporciona un "Micro-Insight" de 2 párrafos: 
    P1: Oportunidad de mercado para este rol. 
    P2: Riesgo detectado.
    Tono: Ejecutivo Senior.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) { return "Insight no disponible."; }
};

export const researchEducationalAgent = async (topic: string) => {
  const ai = createAI();
  try {
    const prompt = `Explica "${topic}" para Tarapacá. Formato: [DEFINICIÓN] [CASO DE USO] [IMPACTO LOCAL]`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) { return { text: "Error.", sources: [] }; }
};

export const searchRegionalInsights = async (query: string) => {
  const ai = createAI();
  try {
    const prompt = `Analiza "${query}" en Tarapacá. Resumen ejecutivo en 3 puntos: [DATA] [ESTRATEGIA] [RECOMENDACIÓN]`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) { return { text: "Error.", sources: [] }; }
};

export const generateSpeech = async (text: string, voice: 'Kore' | 'Puck' | 'Zephyr' = 'Zephyr') => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Conciso y profesional: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) { return null; }
};

export const getChatbotResponse = async (userMessage: string, history: any[]) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMessage }] }],
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
    });
    return response.text;
  } catch (error) { return "Error."; }
};

export const generateProfileOptimization = async (role: string, data: any) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Optimiza perfil ${role}: ${JSON.stringify(data)}. 3 tips cortos.`,
    });
    return response.text;
  } catch (error) { return "Error."; }
};

export const getEducationalContent = async (topic: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explica ${topic} en 100 palabras para el contexto de Iquique/Alto Hospicio.`,
    });
    return response.text;
  } catch (error) { return null; }
};

export const getCircularEconomyAdvice = async (context: string) => {
  const ai = createAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Consejo circular para: ${context}. 2 líneas.`,
    });
    return response.text;
  } catch (error) { return null; }
};

export const analyzeProjectRisk = async (t: string, d: string) => "Riesgo analizado.";
export const generateProjectSuggestions = async (p: any) => "Sugerencias listas.";
