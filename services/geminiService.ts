
import { GoogleGenAI, Type } from "@google/genai";

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

export const estimateCarbonImpact = async (projectTitle: string, description: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza el impacto ambiental del siguiente proyecto de economía circular:
      Título: ${projectTitle}
      Descripción: ${description}
      
      Calcula estimaciones aproximadas de:
      1. CO2 evitado (kg/año)
      2. Agua ahorrada (litros/año)
      3. Residuos desviados de vertederos (kg/año)
      
      Proporciona un veredicto de "Nivel de Impacto" (Bajo, Medio, Alto) y una breve explicación de por qué es importante este ahorro en el contexto de la región de Tarapacá.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            co2: { type: Type.NUMBER, description: "KG de CO2 evitado" },
            water: { type: Type.NUMBER, description: "Litros de agua ahorrados" },
            waste: { type: Type.NUMBER, description: "KG de residuos reducidos" },
            level: { type: Type.STRING, description: "Bajo, Medio o Alto" },
            summary: { type: Type.STRING, description: "Resumen del impacto" }
          },
          required: ["co2", "water", "waste", "level", "summary"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error estimando huella:", error);
    return null;
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

export const getChatbotResponse = async (userMessage: string, history: { role: 'user' | 'ai', text: string }[]) => {
  const ai = getAI();
  
  // Mapear historial al formato de Gemini (user/model)
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  
  // Agregar el mensaje actual del usuario
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: "Eres el Asistente IA oficial de CONECTARAPAK. Tu misión es ayudar a los usuarios a navegar por la plataforma, entender qué es la economía circular y cómo pueden participar en los proyectos de Tarapacá. Eres amable, profesional, conciso y eficiente. Responde siempre en español. Si te preguntan por vistas específicas, menciona: 'Explorar' para buscar proyectos, 'Panel' para CTAs rápidos o 'Academia' para aprender.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Chatbot error:", error);
    return "Lo siento, estoy teniendo dificultades técnicas. ¿Podrías intentar de nuevo?";
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
