
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartDiagnosis = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Eres un experto en soporte técnico TI de TechNova 360. 
      Analiza el siguiente problema del usuario y sugiere: 
      1. Diagnóstico probable de forma concisa.
      2. Nivel de urgencia (Baja, Normal, Alta, Crítica).
      3. Categoría del servicio de entre estas 6: computo, impresion, redes, seguridad, clima_energia, software.
      
      Problema: "${userPrompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            urgency: { type: Type.STRING, enum: ["Baja", "Normal", "Alta", "Crítica"] },
            category: { type: Type.STRING, enum: ["computo", "impresion", "redes", "seguridad", "clima_energia", "software"] }
          },
          required: ["diagnosis", "urgency", "category"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Diagnosis failed:", error);
    return null;
  }
};
