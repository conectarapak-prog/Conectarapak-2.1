
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProjectSuggestions = async (projectData: { title: string, goal: number, duration: number }) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Como experto en crowdfunding y economía circular, analiza este proyecto:
      Título: ${projectData.title}
      Meta: $${projectData.goal}
      Duración: ${projectData.duration} días.
      
      Dame 3 consejos específicos para mejorar las posibilidades de éxito. 
      REGLA CRÍTICA: Presenta cada consejo numerado (1., 2., 3.) y asegúrate de dejar un salto de línea doble entre cada punto para que sean visualmente independientes.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error en Gemini API:", error);
    return "No se pudieron generar sugerencias en este momento.";
  }
};

export const getCircularEconomyAdvice = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: "Eres un asesor experto en Economía Circular de la plataforma CONECTARAPAK. REGLA DE FORMATO: Siempre que des un listado de funciones, tareas o pasos, DEBES usar numeración clara (1., 2., 3.) y separar cada punto con dos saltos de línea (\n\n). Usa negritas para los títulos de cada punto.",
      }
    });
    return response.text;
  } catch (error) {
    return "Lo siento, tuve un problema conectando con mi base de conocimientos.";
  }
};

export const getEducationalContent = async (topic: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explica el concepto de '${topic}' en el contexto de la economía circular para un emprendedor. 
      Usa un lenguaje sencillo, da un ejemplo práctico y termina con una 'Tarea de Acción'. 
      Usa numeración para separar secciones.`,
      config: {
        systemInstruction: "Eres un profesor de sostenibilidad amable y experto. Tu misión es educar sobre economía circular de forma práctica y visual.",
      }
    });
    return response.text;
  } catch (error) {
    return "Error al obtener material educativo.";
  }
};

export const analyzeProjectRisk = async (projectTitle: string, description: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza riesgos de fraude o greenwashing para este proyecto:
      Título: ${projectTitle}
      Descripción: ${description}
      
      Devuelve un veredicto técnico y nivel de riesgo con una lista numerada de hallazgos.`,
    });
    return response.text;
  } catch (error) {
    return "Error en el análisis de riesgo.";
  }
};
