// utils/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Generates a summary of the provided text using Google Gemini.
 * @param {string} text - The text to summarize.
 * @returns {string} - The summarized text.
 */
export async function generateSummary(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(`Summarize the following text: ${text}`);
  const response = await result.response;
  return response.text();
}