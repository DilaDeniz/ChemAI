import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (language: 'en' | 'tr'): string => {
    const langInstruction = language === 'tr' 
        ? 'Tüm yanıtların Türkçe olmalıdır. Bilimsel terim açıklamaları da Türkçe olmalıdır.' 
        : 'All responses must be in English. The definitions for scientific terms must also be in English.';

    return `You are ChemAI Nexus, an advanced AI assistant for chemical computation and drug discovery. Your task is to provide detailed information about a given chemical compound, drug, or element. ${langInstruction} You must return your response as a single, well-formed JSON object. This object must contain three keys: "generalInfo", "summary", and "interactionsAndOptimization".
- "generalInfo": This key should contain a comprehensive overview of the compound. Include details like its chemical formula, molecular weight, IUPAC name, physical description, history, and common uses.
- "summary": This key should contain a summary of the compound's effects, interactions, and key findings. For drugs, this should include mechanism of action, known side effects, and interactions with other substances. For chemicals, describe reactivity and safety information.
- "interactionsAndOptimization": This key must contain two sub-sections. First, predict potential interactions with at least 5 common drugs/chemicals. Second, based on a wide chemical library analysis, propose a new, optimized formula for the compound to minimize side effects and improve efficacy, explaining your reasoning.
- **IMPORTANT**: For any scientific term that might be unknown to a student (e.g., 'agonist', 'enantiomer', 'pharmacokinetics'), you MUST format it as: [term]-->(A brief, one-sentence definition here.). Do this for all three sections. All content for the keys must be markdown strings.`;
}

export const getCompoundInfo = async (
  compoundName: string,
  filters: string[],
  language: 'en' | 'tr'
): Promise<{ generalInfo: string; summary: string, interactionsAndOptimization: string }> => {
  const modelName = 'gemini-2.5-pro';
  
  const langPrompt = language === 'tr' ? 'Türkçe' : 'English';
  const prompt = `Analyze the following compound: "${compoundName}". 
  Consider these filters if applicable (e.g., for drug formulation): ${filters.join(', ') || 'none'}.
  Provide a detailed analysis in the specified JSON format. The entire response, including all text within the JSON values, must be in ${langPrompt}.`;

  const responseSchema = {
      type: Type.OBJECT,
      properties: {
        generalInfo: { type: Type.STRING, description: 'Comprehensive overview in Markdown.' },
        summary: { type: Type.STRING, description: 'Summary of effects and findings in Markdown.' },
        interactionsAndOptimization: { type: Type.STRING, description: 'Interaction predictions and formula optimization suggestions in Markdown.' },
      },
      required: ['generalInfo', 'summary', 'interactionsAndOptimization'],
    };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(language),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });
    
    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);

    if (typeof parsed.generalInfo === 'string' && typeof parsed.summary === 'string' && typeof parsed.interactionsAndOptimization === 'string') {
        return parsed;
    } else {
        throw new Error("Invalid JSON structure received from AI.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};


export const translateContent = async (
  content: { generalInfo: string; summary: string, interactionsAndOptimization: string },
  targetLanguage: 'en' | 'tr'
): Promise<{ generalInfo: string; summary: string, interactionsAndOptimization: string }> => {
  const modelName = 'gemini-2.5-flash'; // Flash is sufficient and faster for translation
  const langPrompt = targetLanguage === 'tr' ? 'Turkish' : 'English';

  const prompt = `Translate the content of the following JSON object's values into ${langPrompt}.
  **Crucially, you MUST preserve all original markdown formatting (like ###, *, etc.) and the custom tooltip syntax: [term]-->(definition).**
  Do not translate the keys ("generalInfo", "summary", "interactionsAndOptimization"). Only translate the string values.
  
  Input JSON:
  ${JSON.stringify(content, null, 2)}
  
  Return the translated content in the exact same JSON format.`;

  const responseSchema = {
      type: Type.OBJECT,
      properties: {
        generalInfo: { type: Type.STRING, description: `Content translated to ${langPrompt} with original markdown and tooltip formatting.` },
        summary: { type: Type.STRING, description: `Content translated to ${langPrompt} with original markdown and tooltip formatting.` },
        interactionsAndOptimization: { type: Type.STRING, description: `Content translated to ${langPrompt} with original markdown and tooltip formatting.` },
      },
      required: ['generalInfo', 'summary', 'interactionsAndOptimization'],
    };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);

    if (typeof parsed.generalInfo === 'string' && typeof parsed.summary === 'string' && typeof parsed.interactionsAndOptimization === 'string') {
        return parsed;
    } else {
        throw new Error("Invalid JSON structure received from AI during translation.");
    }

  } catch (error) {
    console.error("Error calling Gemini API for translation:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Translation Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API for translation.");
  }
};


export const getSearchSuggestions = async (query: string, language: 'en' | 'tr'): Promise<string[]> => {
    if (!query.trim()) {
        return [];
    }
    const modelName = 'gemini-2.5-flash';
    const langInstruction = language === 'tr' ? 'Turkish' : 'English';
    const prompt = `Given the following partial chemical or drug name "${query}", provide a list of up to 5 likely autocomplete suggestions in ${langInstruction}. Return the result as a simple JSON array of strings. For example, for "asp", if the language is English, return ["Aspirin", "Aspartame", "Aspartic acid"]. If the language is Turkish, return appropriate Turkish suggestions like ["Aspirin", "Aspartam", "Aspartik asit"].`;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const jsonString = response.text;
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
};