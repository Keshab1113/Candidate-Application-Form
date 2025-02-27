import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Summarizes a resume using Google Gemini API.
 * @param {string} resumeText - The text extracted from the resume.
 * @returns {Promise<string>} - The summarized resume text.
 */
export async function summarizeResume(resumeText) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Summarize the following resume:\n\n${resumeText}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error summarizing resume:', error);
    throw error;
  }
}

/**
 * Matches a job description with a candidate profile using Google Gemini API.
 * @param {string} jobDescription - The job description text.
 * @param {string} candidateProfile - The candidate profile text.
 * @returns {Promise<string>} - The matching result.
 */
export async function matchJobDescription(jobDescription, candidateProfile) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Match the following job description with the candidate profile:\n\nJob Description: ${jobDescription}\n\nCandidate Profile: ${candidateProfile}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error matching job description:', error);
    throw error;
  }
}