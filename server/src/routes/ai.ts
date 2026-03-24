import { Router, Request, Response } from 'express';
import { extendWithAI } from '../services/claudeExtender';
import { Block } from '../../../shared/types';

const router = Router();

router.post('/extend', async (req: Request, res: Response) => {
  const { prompt, contextBlocks } = req.body as { prompt: string; contextBlocks: Block[] };
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });
  try {
    const block = await extendWithAI(prompt, contextBlocks || []);
    return res.json(block);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI extend failed' });
  }
});

export default router;
