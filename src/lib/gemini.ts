import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export type SummaryMode = "short" | "detailed" | "bullets" | "study";

export async function generateSummary(transcript: string, mode: SummaryMode) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompts: Record<SummaryMode, string> = {
    short: `Generate a concise summary (100–150 words) of the following YouTube transcript. Focus on the main message and key takeaways.
    Transcript: ${transcript}`,
    
    detailed: `Generate a structured and detailed summary of the following YouTube transcript. Use clear headings and sub-headings to organize the information.
    Transcript: ${transcript}`,
    
    bullets: `Generate clear, high-impact bullet point notes from the following YouTube transcript. Capture all the essential points.
    Transcript: ${transcript}`,
    
    study: `Generate structured study notes from the following YouTube transcript. Include the following sections:
    1. Key Concepts: Define the core ideas discussed.
    2. Explanations: Briefly explain each concept.
    3. Key Takeaways: Summary of what to remember.
    4. Revision Questions: 3 questions to test understanding based on the content.
    Transcript: ${transcript}`,
  };

  const result = await model.generateContent(prompts[mode]);
  const response = await result.response;
  return response.text();
}
