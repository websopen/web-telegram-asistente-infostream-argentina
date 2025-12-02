import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // In a real scenario, this comes from env

// Initialize the client only if the key exists to prevent immediate crashes in demo mode
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const summarizeText = async (text: string): Promise<string> => {
  if (!ai) {
    console.warn("API Key not found, returning mock response");
    return "Configura tu API Key para obtener resúmenes reales con IA.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Resume el siguiente texto en español, enfocándote en los puntos clave para una lectura rápida: ${text}`,
    });
    return response.text || "No se pudo generar el resumen.";
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Error al conectar con Gemini.";
  }
};
