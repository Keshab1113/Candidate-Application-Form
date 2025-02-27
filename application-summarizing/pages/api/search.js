import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index('candidates');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    // Generate embeddings for the job description
    const embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });
    const embeddingResponse = await embeddingModel.embedContent(jobDescription);

    // Ensure embeddingResponse is valid
    if (!embeddingResponse || !embeddingResponse.embedding?.values) {
      throw new Error('Failed to generate embedding vector.');
    }

    const embedding = embeddingResponse.embedding.values;

    // Query Pinecone for matching candidates
    const results = await index.query({
      vector: embedding,
      topK: 5, // Retrieve top 5 candidates
      includeMetadata: true,
    });

    if (!results || !results.matches || results.matches.length === 0) {
      return res.status(404).json({ message: 'No matching candidates found' });
    }

    // Generate AI-powered feedback for each candidate
    const candidatesWithFeedback = await Promise.all(
      results.matches.map(async (match) => {
        const feedbackResponse = await genAI
          .getGenerativeModel({ model: 'gemini-2.0-flash' })
          .generateContent(
            `Evaluate the candidate based on the job description:\n\nJob Description: ${jobDescription}\n\nCandidate Profile: ${match.metadata?.resumeText || 'No resume text available'}`
          );

        return {
          ...match.metadata,
          score: match.score,
          feedback: feedbackResponse?.response?.text() || 'No feedback available',
        };
      })
    );

    res.status(200).json(candidatesWithFeedback);
  } catch (error) {
    console.error('Error in search API:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
