
import { GoogleGenAI, Type } from "@google/genai";
import { Visitor } from "../types";

export const extractVisitorFromDocument = async (base64: string, mimeType: string): Promise<Partial<Visitor>> => {
  // Fix: The API key must be obtained exclusively from process.env.API_KEY without fallback strings.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // Fix: Follow the recommended object-based structure for contents.
      contents: {
        parts: [
          { text: "Extract visitor details from this document. Return ONLY a JSON object with name, address, phone (if present), idNumber, gender (Male, Female, or Other), and dob (YYYY-MM-DD)." },
          { inlineData: { mimeType: mimeType, data: base64 } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            address: { type: Type.STRING },
            phone: { type: Type.STRING },
            idNumber: { type: Type.STRING },
            gender: { type: Type.STRING, enum: ["Male", "Female", "Other"] },
            dob: { type: Type.STRING, description: "Date of birth in YYYY-MM-DD format" },
          },
          required: ["name", "address", "idNumber"]
        }
      }
    });

    // Correct: Use .text property as per guidelines (not a method).
    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (error) {
    console.error("Error extracting document info:", error);
  }
  return {};
};
