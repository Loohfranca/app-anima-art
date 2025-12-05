import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePartyIdeas = async (theme: string, age: number): Promise<string> => {
  if (!apiKey) {
    return "Chave de API não configurada. Por favor, configure a API Key para usar a IA.";
  }

  try {
    const prompt = `
      Atue como um especialista em recreação infantil.
      Eu tenho uma festa com o tema: "${theme}" para crianças de ${age} anos.
      Sugira 3 brincadeiras criativas, seguras e originais que se encaixem nesse tema e idade.
      Para cada brincadeira, dê um nome e uma breve explicação de como funciona.
      Formate a resposta como uma lista simples e direta.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar ideias no momento.";
  } catch (error) {
    console.error("Erro ao gerar ideias:", error);
    return "Erro de conexão com a IA. Tente novamente mais tarde.";
  }
};