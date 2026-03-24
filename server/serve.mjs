/**
 * DocToPage — Lean Zero-dependency Node.js server
 * Use to view, list, and export pages without a full frontend.
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../data', 'pages.json');
const PORT = 3001;

if (!existsSync(dirname(dbPath))) mkdirSync(dirname(dbPath), { recursive: true });

const loadDb = () => { try { return JSON.parse(readFileSync(dbPath, 'utf8')); } catch { return {}; } };
const esc = (s) => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const CSS = `
:root{--bg:#0a0a0f;--surface:#12121a;--border:#1e1e2e;--accent:#5c9ef4;--accent2:#e05c5c;--accent3:#5cf4b4;--text:#e8e8f0;--text-dim:#8080a0;--mono:'Space Mono',monospace;--sans:'Syne',sans-serif;--body:'Inter',sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:var(--body);line-height:1.6}
.container{max-width:880px;margin:0 auto;padding:2rem 1rem}
.card{background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:1.5rem;margin-bottom:1.5rem}
.toolbar{position:sticky;top:0;z-index:99;background:rgba(10,10,15,.8);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);padding:.75rem 1.5rem;display:flex;align-items:center;gap:1.5rem}
.toolbar-title{font-family:var(--sans);font-weight:700;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
a{color:var(--accent);text-decoration:none;font-family:var(--mono);font-size:.8rem}
h1,h2,h3{font-family:var(--sans);margin-bottom:1rem;color:var(--accent)}
.hero{text-align:center;padding:3rem 2rem}
.hero h1{font-size:2.5rem;margin-bottom:.5rem}
.hero p{color:var(--text-dim);max-width:600px;margin:0 auto 1.5rem}
.badges{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center}
.badge{padding:.2rem .6rem;background:rgba(92,158,244,.1);border:1px solid rgba(92,158,244,.2);border-radius:2px;font-size:.7rem;font-family:var(--mono)}
.timeline{display:flex;overflow-x:auto;border:1px solid var(--border);border-radius:4px}
.tl-seg{flex:1;padding:.75rem;border-right:1px solid var(--border);text-align:center;min-width:100px}
.tl-seg:last-child{border:none}
.tl-seg.active{background:rgba(92,158,244,.1);color:var(--accent)}
.tl-time{display:block;font-size:.65rem;font-family:var(--mono);margin-bottom:.2rem}
.tl-name{font-weight:700;font-size:.75rem}
table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:.85rem}
th,td{padding:.75rem;border:1px solid var(--border);text-align:left}
th{background:rgba(255,255,255,.05);font-family:var(--mono)}
.problem-header{display:flex;align-items:center;gap:1rem;border-bottom:1px solid var(--border);padding-bottom:1rem;margin-bottom:1rem}
.pb-num{background:var(--accent);color:var(--bg);padding:0 .4rem;border-radius:2px;font-family:var(--mono);font-weight:700}
.pb-title{font-size:1.2rem;font-weight:700;flex:1}
.complexity{display:flex;gap:1rem;font-family:var(--mono);font-size:.75rem;color:var(--accent3)}
.list-card{display:flex;align-items:center;gap:1rem;padding:1.25rem;text-decoration:none;color:inherit}
.list-card:hover{border-color:var(--accent)}
`;

const renderBlock = (b) => {
  const d = b.data;
  switch (b.type) {
    case 'hero': return `<div class="card hero"><h1>${esc(d.title)}</h1><p>${esc(d.subtitle)}</p><div class="badges">${(d.badges||[]).map(b=>`<span class="badge">${esc(b)}</span>`).join('')}</div></div>`;
    case 'timeline': return `<div class="card"><div class="timeline">${(d.segments||[]).map(s=>`<div class="tl-seg ${s.active?'active':''}"><span class="tl-time">${esc(s.time)}</span><span class="tl-name">${esc(s.label)}</span></div>`).join('')}</div></div>`;
    case 'section': return `<div class="card"><h2>${esc(d.title)}</h2><p style="white-space:pre-wrap">${esc(d.content)}</p></div>`;
    case 'problem': return `<div class="card"><div class="problem-header"><span class="pb-num">P${d.number}</span><span class="pb-title">${esc(d.title)}</span><a href="${esc(d.link)}" target="_blank">View ↗</a></div><div style="margin-bottom:1rem">${(d.steps||[]).map(s=>`<div style="display:flex;gap:.5rem;margin-bottom:.25rem"><b style="color:var(--accent);font-family:var(--mono)">${s.num}.</b><span>${esc(s.text)}</span></div>`).join('')}</div><div class="complexity"><span>${esc(d.complexity?.time)}</span> · <span>${esc(d.complexity?.space)}</span></div></div>`;
    case 'table': return `<div class="card"><h3>${esc(d.caption||'Table')}</h3><table><thead><tr>${(d.headers||[]).map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${(d.rows||[]).map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'divider': return `<hr style="border:none;height:1px;background:var(--border);margin:2rem 0"/>`;
    default: return '';
  }
};

const wrap = (title, body, nav='') => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${esc(title)}</title><style>${CSS}</style></head><body>${nav}<div class="container">${body}</div></body></html>`;

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.writeHead(204).end();

  const db = loadDb();
  if (path === '/' && req.method === 'GET') {
    const list = Object.values(db).map(p => `<a href="/page/${p.id}" class="card list-card"><span>📄</span><div style="flex:1"><b>${esc(p.title)}</b><div style="font-size:.7rem;color:var(--text-dim)">${new Date(p.updatedAt).toLocaleDateString()}</div></div><span>→</span></a>`).join('');
    return res.writeHead(200, {'Content-Type':'text/html'}).end(wrap('Outliner — All Pages', `<h1>Outliner</h1>${list || '<p>No pages found in data/pages.json.</p>'}`));
  }

  const match = path.match(/^\/page\/([^/]+)$/);
  if (match && req.method === 'GET') {
    const p = db[match[1]];
    if (!p) return res.writeHead(404).end('Not found');
    const html = p.blocks.sort((a,b)=>a.order-b.order).map(renderBlock).join('');
    const nav = `<div class="toolbar"><a href="/">← Back</a><div class="toolbar-title">${esc(p.title)}</div><a href="/api/pages/${p.id}/export">⬇ Export</a></div>`;
    return res.writeHead(200, {'Content-Type':'text/html'}).end(wrap(p.title, html, nav));
  }

  if (path.includes('/export') && req.method === 'GET') {
    const id = path.split('/')[3];
    const p = db[id];
    if (!p) return res.writeHead(404).end('Not found');
    const html = wrap(p.title, p.blocks.sort((a,b)=>a.order-b.order).map(renderBlock).join(''));
    res.setHeader('Content-Disposition', `attachment; filename="${id}.html"`);
    return res.writeHead(200, {'Content-Type':'text/html'}).end(html);
  }

  res.writeHead(404).end('Not found');
});

server.listen(PORT, () => console.log(`\n  Lean Viewer Running: http://localhost:${PORT}\n`));
