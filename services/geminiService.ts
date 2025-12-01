import { GoogleGenAI, Type } from "@google/genai";
import { TranslationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const performOcrAndTranslate = async (
  imageBase64: string,
  targetLanguage: string
): Promise<TranslationResponse> => {
  try {
    const modelId = "gemini-2.5-flash"; // Efficient for multimodal tasks

    const prompt = `
      Perform three tasks:
      1. Analyze the image and provide a brief visual description (what do you see?).
      2. Extract all visible text from the provided image (OCR).
      3. Translate the extracted text into ${targetLanguage}.
      
      If no text is found, return empty strings for text fields.
      Detect the source language automatically.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalText: {
              type: Type.STRING,
              description: "The raw text extracted from the image.",
            },
            translatedText: {
              type: Type.STRING,
              description: `The text translated into ${targetLanguage}.`,
            },
            detectedLanguage: {
              type: Type.STRING,
              description: "The name of the language detected in the image.",
            },
            imageDescription: {
              type: Type.STRING,
              description: "A brief description of the visual content of the image.",
            },
          },
          required: ["originalText", "translatedText", "imageDescription"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(jsonText) as TranslationResponse;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};