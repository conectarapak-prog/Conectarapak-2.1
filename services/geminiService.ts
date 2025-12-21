
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Genera un Informe de Convergencia Total. 
 * Se fuerza al modelo a no usar markdown excesivo en los títulos para evitar errores de renderizado.
 */
export const generateFullConvergenceReport = async (projectContext: string) => {
  const ai = getAI();
  try {
    const prompt = `Actúa como un Consultor Senior de Estrategia Circular en Iquique.
    
    CONTEXTO: "${projectContext}"
    UBICACIÓN: Región de Tarapacá.

    TAREA: Genera un INFORME ESTRATÉGICO UNIFICADO (VPC, Perfil, Lean, PESTEL).
    
    ESTRUCTURA TÉCNICA REQUERIDA:
    ### 01. PROPUESTA DE VALOR Y CLIENTE (VPC)
    ### 02. ESTRUCTURA DE NEGOCIO LEAN
    ### 03. DIAGNÓSTICO PESTEL REGIONAL
    ### 04. HOJA DE RUTA DE CONVERGENCIA

    REGLAS ESTRICTAS DE FORMATO:
    - NO uses negritas (**) en los títulos de sección (###).
    - Incluye términos técnicos entre paréntesis para glosario dinámico.
    - Integra datos de ZOFRI y el puerto de Iquique de forma natural.
    - Sé directo, técnico y evita introducciones de cortesía.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    
    return response.text;
  } catch (error) { 
    return "### ERROR DE SISTEMA\nNo se pudo sincronizar con los nodos de inteligencia. Por favor, intente nuevamente."; 
  }
};

export const generateStrategicFramework = async (frameworkType: string, projectContext: string) => {
  const ai = getAI();
  try {
    const prompt = `Genera un análisis técnico de ${frameworkType} para: ${projectContext} en Tarapacá. Usa títulos con ###.`;
    const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
    return response.text;
  } catch (error) { return "Error."; }
};

export const analyzeInvestmentImpact = async (projectName: string, amount: number, percentage: number) => {
  const ai = getAI();
  try {
    const prompt = `Analiza inversión de $${amount} CLP en ${projectName}. Sé telegráfico.`;
    const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
    return response.text;
  } catch (error) { return "Error."; }
};

export const deepAuditProject = async (projectData: any) => {
  const ai = getAI();
  try {
    const prompt = `Auditoría técnica: ${JSON.stringify(projectData)}`;
    const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
    return response.text;
  } catch (error) { return "Error."; }
};

export const getPostInsight = async (title: string, content: string, role: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: `Insight para ${role}: ${title}` });
  return response.text;
};

export const getChatbotResponse = async (msg: string, history: any[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: msg });
  return response.text;
};

export const generateProfileOptimization = async (role: string, data: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Optimiza ${role} con estos parámetros: ${JSON.stringify(data)}` });
  return response.text;
};

export const getEducationalContent = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: `Explica el concepto de ${topic} en el contexto de economía circular.` });
  return response.text;
};

// Fixed: implemented searchRegionalInsights with googleSearch tool and source extraction
export const searchRegionalInsights = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview", 
      contents: query, 
      config: { 
        tools: [{ googleSearch: {} }],
        systemInstruction: "Genera el análisis en el siguiente formato: [HECHOS]... [ESTRATEGIA]... [INFOGRAFIA]... [ACCIONES]..."
      } 
    });
    // Extract website URLs from groundingChunks as required by guidelines
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text: response.text, sources };
  } catch (error) {
    return { text: "Error en la búsqueda regional.", sources: [] };
  }
};

// Fixed: implemented analyzeProjectRisk
export const analyzeProjectRisk = async (title: string, description: string) => {
  const ai = getAI();
  try {
    const prompt = `Analiza el riesgo del proyecto: ${title}. Descripción: ${description}`;
    const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
    return response.text;
  } catch (error) {
    return "Error al analizar el riesgo.";
  }
};

// Fixed: implemented generateProjectSuggestions
export const generateProjectSuggestions = async (p: any) => {
  const ai = getAI();
  try {
    const prompt = `Sugerencias para proyecto: ${JSON.stringify(p)}`;
    const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
    return response.text;
  } catch (error) {
    return "Error al generar sugerencias.";
  }
};

// Fixed: updated signature to accept prompt, imageSize and aspectRatio to fix error in AIPowerLab.tsx
export const generateImagePro = async (prompt: string, imageSize: string = "1K", aspectRatio: string = "1:1") => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any,
        }
      },
    });
    // Iterate through candidates and parts to find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fixed: implemented analyzeImageWithPro using flash model
export const analyzeImageWithPro = async (base64Data: string, prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          },
          { text: prompt },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error(error);
    return "Error en el análisis visual.";
  }
};
