import { DocContent, PageJSON, Block } from '../../../shared/types';
import { v4 as uuidv4 } from 'uuid';

async function callClaude(system: string, userMsg: string, maxTokens = 8192): Promise<string> {
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

const SYSTEM_PROMPT = `You are a document-to-webpage converter. You receive structured document content and output ONLY a valid JSON object matching the PageJSON schema. No markdown, no explanation — raw JSON only.

Schema:
{
  "id": "string (uuid)",
  "title": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string",
  "sourceFilename": "string",
  "blocks": [Block]
}

Block schema:
{
  "id": "uuid",
  "type": one of: hero|section|problem|tip|table|code|checklist|exercise|timeline|divider,
  "data": { ... block-specific fields ... },
  "order": number (0-indexed)
}

Block data shapes:
- hero: { title: string, subtitle: string, badges: string[], metaChips: [{label, value}] }
- section: { title: string, content: string }
- problem: { number: number, title: string, timeMin: number, link: string, platform: string, steps: [{num, text}], dryRun: [{headers, rows}], insights: string[], warnings: string[], complexity: {time, space} }
- tip: { label: string, content: string }
- table: { headers: string[], rows: string[][], caption?: string }
- code: { title?: string, language?: string, lines: [{text, indent, type: 'keyword'|'var'|'comment'|'normal'}] }
- checklist: { title: string, items: string[] }
- exercise: { title: string, items: [{badge: string, text: string}] }
- timeline: { segments: [{time: string, label: string, active: boolean}] }
- divider: { style?: 'solid'|'dashed'|'gradient' }

Rules:
- Always start with a hero block using the document title
- Add a timeline block if the doc has time-based segments
- Generate UUIDs for all block ids
- Set order as sequential integers starting from 0
- Output ONLY raw JSON, absolutely no markdown fences or explanation`;

export async function convertDocToPage(
  docContent: DocContent,
  filename: string,
  pageId: string
): Promise<PageJSON> {
  const userPrompt = `Convert this document to a PageJSON:

Filename: ${filename}
Raw text (first 6000 chars): ${docContent.rawText.substring(0, 6000)}

Sections detected: ${JSON.stringify(docContent.sections.slice(0, 20), null, 2)}
Tables detected: ${JSON.stringify(docContent.tables.slice(0, 5), null, 2)}
Lists detected: ${JSON.stringify(docContent.lists.slice(0, 10), null, 2)}

Generate a complete PageJSON with the id "${pageId}".`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const text = await callClaude(SYSTEM_PROMPT, userPrompt);
      const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
      const parsed = JSON.parse(cleaned) as PageJSON;
      parsed.id = pageId;
      parsed.sourceFilename = filename;
      if (!parsed.createdAt) parsed.createdAt = new Date().toISOString();
      if (!parsed.updatedAt) parsed.updatedAt = new Date().toISOString();
      parsed.blocks = parsed.blocks.map((b: Block, i: number) => ({
        ...b,
        id: b.id || uuidv4(),
        order: i,
      }));
      return parsed;
    } catch (err) {
      lastError = err as Error;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastError || new Error('Failed to convert document');
}
