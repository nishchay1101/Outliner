import { Block } from '../../../shared/types';
import { v4 as uuidv4 } from 'uuid';

async function callClaude(system: string, userMsg: string, maxTokens = 2048): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userMsg }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API error ${res.status}: ${await res.text()}`);
  const data: any = await res.json();
  return data.content?.[0]?.text || '';
}

const SYSTEM_PROMPT = `You are an AI block generator for a structured document editor. Given context blocks and a user prompt, generate ONE new block as a valid JSON object matching the Block schema. Output ONLY raw JSON, no markdown, no explanation.

Block schema:
{
  "id": "uuid",
  "type": one of: hero|section|problem|tip|table|code|checklist|exercise|timeline|divider,
  "data": { ... block-specific fields matching the type ... },
  "order": 0
}

Block data shapes:
- section: { title: string, content: string }
- tip: { label: string, content: string }
- checklist: { title: string, items: string[] }
- table: { headers: string[], rows: string[][], caption?: string }
- code: { title?: string, language?: string, lines: [{text, indent, type}] }
- exercise: { title: string, items: [{badge: string, text: string}] }
- problem: { number: number, title: string, timeMin: number, link: string, platform: string, steps: [{num, text}], dryRun: [{headers, rows}], insights: string[], warnings: string[], complexity: {time, space} }
- timeline: { segments: [{time: string, label: string, active: boolean}] }
- divider: { style: 'gradient' }`;

export async function extendWithAI(
  prompt: string,
  contextBlocks: Block[]
): Promise<Block> {
  const userPrompt = `Context blocks (surrounding content):
${JSON.stringify(contextBlocks, null, 2)}

User request: ${prompt}

Generate ONE new block that fits naturally into this content.`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const text = await callClaude(SYSTEM_PROMPT, userPrompt);
      const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
      const block = JSON.parse(cleaned) as Block;
      block.id = uuidv4();
      return block;
    } catch (err) {
      lastError = err as Error;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastError || new Error('Failed to generate block');
}
