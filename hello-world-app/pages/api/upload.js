import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer to store files in `public/uploads`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Disable Next.js's default bodyParser
export const config = {
  api: {
    bodyParser: false,
  }
};

// Handle file upload manually
export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('resume')(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      res.status(200).json({ resumeUrl: `/uploads/${req.file.filename}` });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
