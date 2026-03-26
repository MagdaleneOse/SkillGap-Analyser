// src/lib/analyseCV.ts

// Define the interface first
export type AnalysisResult = {
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
    categoryScores: {
      category: string;
      score: number;
    }[];
  }
  
  import { GoogleGenerativeAI } from '@google/generative-ai';
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
  
  if (!apiKey) {
    throw new Error(
      'Missing Gemini API key. Check VITE_GEMINI_API_KEY in your .env.local file.'
    );
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  function buildPrompt(cvText: string, jobDescription: string): string {
    return `
  You are an expert CV analyst and hiring specialist.
  
  Compare the CV below against the job description and return a JSON object only.
  Do not include any explanation, markdown, or code fences — return raw JSON only.
  
  The JSON must follow this exact structure:
  {
    "matchPercentage": <integer between 0 and 100>,
    "matchedSkills": [<list of skills present in both CV and job description>],
    "missingSkills": [<list of skills required by the job but absent from the CV>],
    "recommendations": [<list of 3 to 5 specific, actionable suggestions to close the skill gaps>],
    "categoryScores": [
      { "category": "Technical Skills", "score": <integer 0-100> },
      { "category": "Experience", "score": <integer 0-100> },
      { "category": "Education", "score": <integer 0-100> },
      { "category": "Soft Skills", "score": <integer 0-100> },
      { "category": "Tools & Platforms", "score": <integer 0-100> }
    ]
  }
  
  CV:
  ${cvText}
  
  Job Description:
  ${jobDescription}
    `.trim();
  }
  
  function parseResponse(rawText: string): AnalysisResult {
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
  
    let parsed: any;
  
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(
        'The AI returned a response that could not be parsed as JSON. Please try again.'
      );
    }
  
    if (
      typeof parsed.matchPercentage !== 'number' ||
      !Array.isArray(parsed.matchedSkills) ||
      !Array.isArray(parsed.missingSkills) ||
      !Array.isArray(parsed.recommendations) ||
      !Array.isArray(parsed.categoryScores)
    ) {
      throw new Error(
        'The AI response was missing required fields. Please try again.'
      );
    }
  
    parsed.matchPercentage = Math.min(100, Math.max(0, parsed.matchPercentage));
  
    return {
      matchPercentage: parsed.matchPercentage,
      matchedSkills: parsed.matchedSkills,
      missingSkills: parsed.missingSkills,
      recommendations: parsed.recommendations,
      categoryScores: parsed.categoryScores
    };
  }
  
  export async function analyseCV(
    cvText: string,
    jobDescription: string
  ): Promise<AnalysisResult> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
    const prompt = buildPrompt(cvText, jobDescription);
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
  
    return parseResponse(rawText);
  }