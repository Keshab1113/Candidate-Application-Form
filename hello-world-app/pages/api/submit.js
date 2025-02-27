import { summarizeResume } from '../../utils/gemini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { resumeText } = req.body;

    // Summarize the resume using Gemini
    const summary = await summarizeResume(resumeText);

    res.status(200).json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}