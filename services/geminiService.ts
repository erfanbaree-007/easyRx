import { GoogleGenAI, Type, Modality } from "@google/genai";
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

export const generateSpeech = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) throw new Error("No audio generated");
        return audioData;
    } catch (error) {
        console.error("Gemini Speech Error:", error);
        throw error;
    }
};