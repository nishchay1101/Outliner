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

const SYSTEM_PROMPT = `You are a document-to-lecture-page converter. You receive document content and output ONLY a valid JSON object matching the PageJSON schema. No markdown, no explanation — raw JSON only.

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
  "type": one of: hero|timeline|rawHtml|divider,
  "data": { ... },
  "order": number (0-indexed)
}

Block data shapes:
- hero: { title: string, subtitle: string, badges: string[], metaChips: [{label, value}] }
- timeline: { segments: [{time: string, label: string, active: boolean}] }
- rawHtml: { html: string }
- divider: { style: "gradient" }

CRITICAL RULES for rawHtml blocks:
Each major section of the document becomes ONE rawHtml block. The html must use ONLY these CSS classes (already defined in the design system):

SEGMENT WRAPPER (required, add id for anchor links matching timeline slugs):
<div class="segment" id="section-slug">
  <div class="segment-header">
    <div class="time-block blue|green|purple">⏱ TIME RANGE</div>
    <div class="segment-title">SECTION TITLE</div>
    <div class="segment-line"></div>
  </div>
  CONTENT...
</div>

PROBLEM CARD (for any numbered problem/exercise):
<div class="problem-card">
  <div class="pc-header">
    <span class="pc-num">P1</span>
    <span class="pc-title">TITLE</span>
    <span class="pc-time">15 min</span>
    <a href="URL" target="_blank" class="pc-link">↗ Platform</a>
  </div>
  <div class="pc-body">
    <div class="pc-section">
      <div class="pc-section-label">LABEL</div>
      STEPS, ALGO-BOX, DRY-RUN etc.
    </div>
  </div>
</div>

STEP ROWS:
<div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>KEY:</strong> explanation</div></div>

ALGO BOX (for pseudocode):
<div class="algo-box">
  <span class="ln"><span class="kw">for</span> i in range(n):</span>
  <span class="i1"><span class="var">x</span> += arr[i] <span class="cm">// comment</span></span>
  <span class="i2">nested code</span>
</div>
Syntax tokens: kw=keywords, var=variables, fn=function names, cm=comments

COMPLEXITY:
<div class="complexity-row">
  <div class="cx-chip time">O(n) time</div>
  <div class="cx-chip space">O(1) space</div>
</div>

DRY-RUN TABLE:
<div class="dry-run">
  <table><thead><tr><th>col1</th><th>col2</th></tr></thead>
  <tbody><tr><td>val</td><td class="hl3">highlighted</td></tr></tbody></table>
</div>
Table highlight classes: hl=blue, hl3=green, hlr=red

INSIGHT / WARNING BOXES:
<div class="insight-box">💡 insight text</div>
<div class="warn-box">⚠️ warning text</div>

TIP CARD:
<div class="tip-card">
  <div class="tip-label">Teacher Note / Key Insight</div>
  <p>content</p>
</div>

MULTI-COLUMN LAYOUT:
<div class="cols"> (or class="two-col")
  <div class="pc-section">...</div>
  <div class="pc-section">...</div>
</div>

CHECKLIST:
<ul class="check-list">
  <li><strong>Term:</strong> description</li>
</ul>

EXERCISE CARD:
<div class="exercise-card">
  <div class="ex-title">⚡ Exercises</div>
  <div class="ex-item"><div class="ex-badge">EX 1</div><span>description</span></div>
</div>

WRAPUP GRID (for final summary):
<div class="wrapup-grid">
  <div class="wrapup-card">
    <div class="wc-title"><div class="wc-icon">✓</div> Takeaways</div>
    <ul class="check-list"><li>point</li></ul>
  </div>
</div>

GENERATION RULES:
1. Block order: hero → timeline → [rawHtml segment blocks with dividers between them]
2. hero block: extract title, subtitle, key badges
3. timeline: one segment per major section. First segment active:true. Use slugified label as the section id (e.g. "Introduction" → id="introduction")
4. For each section: wrap in <div class="segment" id="SLUG">
5. Use time-block colors: first section=blue, middle sections=green, advanced=purple, last=blue
6. Convert ANY code snippets to algo-box format using the span tokens
7. Convert ANY tables to dry-run format 
8. If document has no time ranges, invent reasonable ones based on content depth
9. Add a "Final Wrap-Up" section summarizing key takeaways using wrapup-grid
10. Add exercise-card at the end with 2-3 practice problems
11. Every section MUST end with at least one insight-box or tip-card
12. Output ONLY raw JSON, absolutely no markdown fences or explanation`;

export async function convertDocToPage(
  docContent: DocContent,
  filename: string,
  pageId: string
): Promise<PageJSON> {
  const userPrompt = `Convert this document into a lecture-style PageJSON using rawHtml blocks.

Filename: ${filename}
Raw text (first 8000 chars): ${docContent.rawText.substring(0, 8000)}

Sections detected: ${JSON.stringify(docContent.sections.slice(0, 30), null, 2)}
Tables detected: ${JSON.stringify(docContent.tables.slice(0, 8), null, 2)}
Lists detected: ${JSON.stringify(docContent.lists.slice(0, 15), null, 2)}

Generate a complete PageJSON with id "${pageId}". Use the lecture-canvas CSS format with rawHtml blocks. Include hero + timeline + one rawHtml segment per major section (with id matching timeline slug) + dividers between sections.`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const text = await callClaude(SYSTEM_PROMPT, userPrompt, 16000);
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
