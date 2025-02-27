import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { resumeUrl } = req.body;
  const filePath = path.join(process.cwd(), 'public', resumeUrl);

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    res.status(200).json({ text: data.text });
  } catch (error) {
    res.status(500).json({ error: 'Error parsing resume' });
  }
}