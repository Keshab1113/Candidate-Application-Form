import pdfParse from 'pdf-parse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const formData = await req.formData();
  const resumeFile = formData.get('resume');

  try {
    const dataBuffer = await resumeFile.arrayBuffer();
    const data = new Uint8Array(dataBuffer);
    const pdfText = await pdfParse(data);

    // Extract text from PDF
    const text = pdfText.text;

    // Here you can add logic to extract keywords, skills, etc.
    // For simplicity, we'll just return the extracted text
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
}