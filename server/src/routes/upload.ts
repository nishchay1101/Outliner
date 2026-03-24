import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { parseDocx } from '../services/docParser';
import { convertDocToPage } from '../services/claudeConverter';
import { createPage } from '../db/pageRepo';

const router = Router();
const upload = multer({
  dest: '/tmp/doctopage-uploads/',
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.originalname.endsWith('.docx')) {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files are accepted'));
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = req.file.path;
  const filename = req.file.originalname;
  try {
    const pageId = uuidv4();
    const docContent = await parseDocx(filePath);
    const page = await convertDocToPage(docContent, filename, pageId);
    createPage(page);
    fs.unlinkSync(filePath);
    return res.json({ pageId: page.id });
  } catch (err: any) {
    try { fs.unlinkSync(filePath); } catch {}
    return res.status(500).json({ error: err.message || 'Conversion failed' });
  }
});

export default router;
