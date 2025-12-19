
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Nueva función para resumir noticias y dar contexto regional
export const summarizeNews = async (title: string, excerpt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza esta noticia de economía circular:
      Título: ${title}
      Resumen: ${excerpt}
      
      Dame 3 puntos clave sobre cómo esto impacta específicamente a la Región de Tarapacá y un "Veredicto de Circularidad" (porcentaje de 0 a 100).`,
      config: {
        systemInstruction: "Eres un analista senior de CONECTARAPAK. Tu objetivo es desglosar noticias complejas en beneficios simples para la comunidad del norte de Chile."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error resumiendo noticia:", error);
    return "Análisis IA no disponible en este momento.";
  }
};

// Generar reporte de tendencias regional
export const generateRegionalTrends = async () => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Genera un reporte de las 3 tendencias más importantes de economía circular en la Región de Tarapacá (Iquique, Alto Hospicio, El Tamarugal) para el mes actual.",
      config: {
        systemInstruction: "Eres Gemini Smart, el motor de inteligencia de CONECTARAPAK. Responde con 3 puntos breves, accionables y con un tono optimista. Usa emojis de sostenibilidad."
      }
    });
    return response.text;
  } catch (error) {
    return "No se pudo conectar con el monitor de tendencias.";
  }
};

// Generic AI Optimization for different roles
export const generateProfileOptimization = async (role: string, params: { val1: number, val2: number, extra?: string }) => {
  const ai = getAI();
  let contextPrompt = "";

  switch (role) {
    case 'entrepreneur':
      contextPrompt = `Como experto en crowdfunding y economía circular, analiza esta propuesta de emprendedor: Meta de $${params.val1.toLocaleString()} en ${params.val2} días.`;
      break;
    case 'investor_natural':
    case 'investor_legal':
      contextPrompt = `Como consultor financiero de impacto, analiza esta estrategia de inversión: Capital de $${params.val1.toLocaleString()} distribuido en ${params.val2} proyectos circulares.`;
      break;
    case 'advisor':
      contextPrompt = `Como experto en gestión de mentorías, analiza esta carga de trabajo: ${params.val1} proyectos para auditar con una dedicación de ${params.val2} horas semanales.`;
      break;
    default:
      contextPrompt = `Analiza los siguientes parámetros de sostenibilidad: Valor A: ${params.val1}, Valor B: ${params.val2}.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${contextPrompt}
      Dame un análisis conciso y 3 consejos accionables para maximizar el éxito y el impacto en la región de Tarapacá. 
      Usa un tono profesional y motivador.`,
      config: {
        systemInstruction: "Eres Gemini, el motor de inteligencia de CONECTARAPAK. Tu objetivo es optimizar la economía circular en Tarapacá ayudando a los usuarios según su rol específico."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error en Gemini Optimization:", error);
    return "No se pudo generar la optimización en este momento.";
  }
};

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
    return JSON.parse(response.text || '{}');
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
        systemInstruction: "Eres el Asistente IA oficial de CONECTARAPAK. Tu misión es ayudar a los usuarios a navegar por la plataforma, entender qué es la economía circular y cómo pueden participar en los proyectos de Tarapacá. Eres amable, profesional, conciso y eficiente. Responde siempre en español.",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Chatbot error:", error);
    return "Lo siento, estoy teniendo dificultades técnicas. ¿Podrías intentar de nuevo?";
  }
};

export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K", aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: aspectRatio
        }
      }
    });
    for (const part of response.candidates?.[0].content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};

export const generateVideoWithVeo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
  const ai = getAI();
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      return `${downloadLink}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (error) {
    console.error("Video generation error:", error);
    return null;
  }
};

export const editImageWithFlash = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });
    for (const part of response.candidates?.[0].content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image editing error:", error);
    return null;
  }
};

export const analyzeImageWithPro = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Image analysis error:", error);
    return "Error analizando la imagen.";
  }
};

export const getMapsInfo = async (query: string, lat: number, lng: number) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      }
    });
    const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text: response.text, links: urls };
  } catch (error) {
    console.error("Maps error:", error);
    return null;
  }
};

export const analyzeProjectRisk = async (title: string, description: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Realiza una auditoría de integridad y riesgo para el siguiente incidente reportado en la plataforma CONECTARAPAK:
      Título: ${title}
      Descripción: ${description}
      
      Analiza posibles fraudes, greenwashing o inconsistencias. Proporciona un reporte detallado con recomendaciones de moderación.`,
      config: {
        systemInstruction: "Eres un auditor experto en integridad de plataformas de crowdfunding y sostenibilidad. Tu tono es profesional, analítico y directo.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error analizando riesgo:", error);
    return "Error al generar el reporte de auditoría.";
  }
};

export const getEducationalContent = async (topic: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explica el siguiente concepto de economía circular de forma educativa y práctica: ${topic}. 
      Asegúrate de incluir ejemplos relevantes para la región de Tarapacá, Chile.`,
      config: {
        systemInstruction: "Eres un profesor experto de la Academia Circular de CONECTARAPAK. Explicas conceptos complejos de forma sencilla, motivadora y territorializada.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error obteniendo contenido educativo:", error);
    return "No se pudo encontrar información educativa sobre este tema.";
  }
};
