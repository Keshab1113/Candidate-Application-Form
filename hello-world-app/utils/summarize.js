// pages/api/summarize.js
import { generateSummary } from '../../utils/gemini'; // Import the utility function

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  // Extract the text from the request body
  const { text } = req.body;

  // Check if the text is provided
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Generate a summary using the Google Gemini API
    const summary = await generateSummary(text);

    // Return the summary in the response
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
}