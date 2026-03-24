import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllPages, getPageById, createPage, updatePage, deletePage } from '../db/pageRepo';
import { PageJSON } from '../../../shared/types';
import { generateExportHtml } from '../services/htmlExporter';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json(getAllPages());
});

router.get('/:id', (req: Request, res: Response) => {
  const page = getPageById(req.params.id);
  if (!page) return res.status(404).json({ error: 'Page not found' });
  return res.json(page);
});

router.post('/', (req: Request, res: Response) => {
  const now = new Date().toISOString();
  const page: PageJSON = {
    id: uuidv4(),
    title: req.body.title || 'Untitled Page',
    createdAt: now,
    updatedAt: now,
    sourceFilename: '',
    blocks: [],
  };
  createPage(page);
  return res.status(201).json(page);
});

router.patch('/:id', (req: Request, res: Response) => {
  const updated = updatePage(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Page not found' });
  return res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const ok = deletePage(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Page not found' });
  return res.json({ success: true });
});

router.post('/:id/export', (req: Request, res: Response) => {
  const page = getPageById(req.params.id);
  if (!page) return res.status(404).json({ error: 'Page not found' });
  const html = generateExportHtml(page);
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Disposition', `attachment; filename="${page.title.replace(/[^a-z0-9]/gi, '_')}.html"`);
  return res.send(html);
});

export default router;
