import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeFoodRisk = async (foodDescription: string): Promise<string> => {
  if (!apiKey) {
    return "API Key not configured. Unable to analyze.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful gut health assistant for users in Africa managing ulcers. 
      Analyze the following food item: "${foodDescription}". 
      Provide a very short, 2-sentence assessment. 
      1. Is it generally high, medium, or low risk for ulcer patients?
      2. Suggest a safer alternative if high risk.
      Keep it culturally relevant to West African cuisine if applicable.`,
    });

    return response.text || "Could not analyze this item at the moment.";
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return "Offline: Unable to reach AI service. Please check your connection.";
  }
};
