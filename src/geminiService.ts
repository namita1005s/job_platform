import { GoogleGenAI, Type } from "@google/genai";
import type { Job, Application, AIRecommendation } from "./types";

const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.API_KEY;

export const analyzeApplications = async (
  job: Job,
  applications: Application[]
): Promise<AIRecommendation[]> => {
  if (applications.length === 0) return [];
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert HR Recruiter. Your task is to analyze candidate compatibility for the following job:
    
    JOB TITLE: ${job.title}
    COMPANY: ${job.company}
    REQUIREMENTS: ${job.requirements.join(", ")}
    DESCRIPTION: ${job.description}
    
    Please evaluate the following candidates based on their expertise and skills:
    
    ${applications.map((app, index) => `
      Candidate (ID: ${app.id}):
      Name: ${app.candidateName}
      Skills Description: ${app.resumeText}
    `).join("\n---\n")}
    
    For each candidate, provide:
    1. A match score (0-100) based strictly on requirements.
    2. A professional feedback summary (max 2 sentences) explaining the score.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              applicationId: { type: Type.STRING },
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING },
            },
            required: ["applicationId", "score", "feedback"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("AI returned an empty response.");
    
    return JSON.parse(text.trim());
  } catch (error: any) {
    console.error("Gemini AI Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze applications. Check your internet connection and API key.");
  }
};