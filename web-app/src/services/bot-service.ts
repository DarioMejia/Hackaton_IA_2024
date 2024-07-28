import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from "@google/generative-ai";
import { history } from "@/utils/const";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("Please set the GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model: GenerativeModel = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: "Te llamas Sam, eres un asistente virtual para la empresa ProcessOptima. Mantén un tono profesional e informativo, pero accesible y amigable.",
});

const generationConfig: GenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export const getChatbotResponse = async (userMessage: string): Promise<string> => {
    const chatSession = model.startChat({
        generationConfig,
        history,
    });

    const result = await chatSession.sendMessage(userMessage);
    return result.response.text();
};
