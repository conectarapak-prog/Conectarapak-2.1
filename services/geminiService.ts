
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProjectDescription = async (title: string, bulletPoints: string, tone: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escribe una descripción persuasiva para un proyecto de crowdfunding llamado "${title}" con tono "${tone}". 
      Puntos clave: ${bulletPoints}. 
      Responde en formato Markdown, resaltando beneficios y una llamada a la acción.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating AI content:", error);
    return "Error al generar la descripción. Por favor intente de nuevo.";
  }
};

export const analyzeProjectRisk = async (projectData: any) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Actúa como un experto en moderación de fraudes. Analiza el siguiente proyecto: ${JSON.stringify(projectData)}. 
      Detecta posibles riesgos de fraude, greenwashing o inconsistencias. Responde con un análisis estructurado.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing project:", error);
    return "Análisis no disponible actualmente.";
  }
};
