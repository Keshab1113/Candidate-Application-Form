import { generateEmbedding, searchVectorDB } from '../../utils/vectorSearch';
import { getGeminiEvaluation } from '../../utils/geminiIntegration';

export default async function handler(req, res) {
  const { candidateData } = req.body;
  const candidateEmbedding = await generateEmbedding(candidateData.text);
  const matchingJobs = await searchVectorDB(candidateEmbedding);
  const aiFeedback = await getGeminiEvaluation(candidateData.text, matchingJobs);

  res.status(200).json({ matchingJobs, aiFeedback });
}