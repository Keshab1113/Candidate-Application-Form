import { promises as fs } from 'fs';
import pdfParse from 'pdf-parse';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IncomingForm } from 'formidable';

// Initialize Pinecone
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index('candidates'); // Ensure this matches your Pinecone index name

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle file uploads
  },
};

// Helper function to parse form data
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse form data
    const { fields, files } = await parseForm(req);


    // Convert fields from array to string
    const { 
      name, 
      email, 
      linkedin, 
      skills 
    } = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value[0]]) // Extract first value from array
    );

    const resumeFile = files.resume?.[0];

    if (!resumeFile || !resumeFile.filepath) {
      throw new Error('Resume file is missing or invalid.');
    }

    // Read and parse the PDF file
    const fileBuffer = await fs.readFile(resumeFile.filepath);
    const resumeText = await pdfParse(fileBuffer);

    // Generate embeddings using Google Generative AI
    const embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });
    const embeddingResponse = await embeddingModel.embedContent(resumeText.text);

    if (!embeddingResponse || !embeddingResponse.embedding?.values) {
      throw new Error('Failed to generate embedding vector.');
    }

    // Ensure embedding is a flat array
    const embedding = embeddingResponse.embedding.values.flat();

    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error('Invalid embedding format.');
    }


    // Store in Pinecone
    await index.upsert([
      {
        id: email.trim(), // Now email is correctly converted to a string
        values: embedding, // Ensure this is a flat array of numbers
        metadata: {
          name: name.trim(),
          email: email.trim(),
          linkedin: linkedin?.trim() || '',
          skills: skills?.trim() || '',
          resumeText: resumeText.text,
        },
      },
    ]);

    res.status(200).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error in submit API:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
