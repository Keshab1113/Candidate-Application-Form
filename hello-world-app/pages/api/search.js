import { matchJobDescription } from '../../utils/gemini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { jobDescription, candidateProfile } = req.body;

    // Match job description with candidate profile
    const matchResult = await matchJobDescription(jobDescription, candidateProfile);

    res.status(200).json({ matchResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}