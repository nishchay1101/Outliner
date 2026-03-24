/**
 * DocToPage — Zero-dependency Node.js server
 * Serves the rendered Two Pointer lecture page.
 * Run with: node serve.mjs
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../data');
const dbPath = join(dataDir, 'pages.json');
const PORT = 3001;

function loadDb() {
  try { return JSON.parse(readFileSync(dbPath, 'utf8')); } catch { return {}; }
}
function saveDb(db) {
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// ─── HTML RENDERER ───────────────────────────────────────────────────────────
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function renderBlock(b) {
  const d = b.data;
  switch (b.type) {
    case 'hero': return `
      <div class="block hero fade-up">
        <h1>${esc(d.title)}</h1>
        <p>${esc(d.subtitle)}</p>
        ${d.badges?.length ? `<div class="badges">${d.badges.map(b=>`<span class="badge">${esc(b)}</span>`).join('')}</div>` : ''}
        ${d.metaChips?.length ? `<div class="meta-chips">${d.metaChips.map(c=>`<span class="meta-chip">${esc(c.label)}: <span>${esc(c.value)}</span></span>`).join('')}</div>` : ''}
      </div>`;

    case 'timeline': return `
      <div class="block card fade-up">
        <div class="tl-label-top">Lecture Roadmap</div>
        <div class="timeline">
          ${(d.segments||[]).map(s=>`
            <div class="tl-seg${s.active?' active':''}">
              <div class="tl-time">${esc(s.time)}</div>
              <div class="tl-name">${esc(s.label)}</div>
            </div>`).join('')}
        </div>
      </div>`;

    case 'section': return `
      <div class="block card section-block fade-up">
        <h2>${esc(d.title)}</h2>
        <p>${esc(d.content)}</p>
      </div>`;

    case 'tip': {
      const lc = (d.label||'').toLowerCase();
      const color = lc.includes('warn')||lc.includes('danger') ? 'var(--accent2)' : lc.includes('note') ? 'var(--accent)' : 'var(--accent3)';
      return `
      <div class="block card tip-block fade-up" style="border-left-color:${color}">
        <div class="tip-label" style="color:${color}">${esc(d.label||'Tip')}</div>
        <div class="tip-content">${esc(d.content).replace(/\n/g,'<br/>')}</div>
      </div>`;
    }

    case 'table': return `
      <div class="block card table-block fade-up">
        ${d.caption ? `<div class="table-caption">${esc(d.caption)}</div>` : ''}
        <div style="overflow-x:auto">
        <table>
          <thead><tr>${(d.headers||[]).map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead>
          <tbody>${(d.rows||[]).map(row=>`<tr>${row.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
        </div>
      </div>`;

    case 'problem': return `
      <div class="block card problem-block fade-up">
        <div class="pb-header">
          <span class="pb-num">#${d.number}</span>
          <span class="pb-title">${esc(d.title)}</span>
          ${d.timeMin ? `<span class="pb-time">⏱ ${d.timeMin} min</span>` : ''}
          ${d.link ? `<a class="pb-link" href="${esc(d.link)}" target="_blank" rel="noopener">${esc(d.platform||'Link')} ↗</a>` : ''}
        </div>
        ${(d.steps||[]).length ? `
          <div class="pb-steps">
            ${d.steps.map(s=>`
              <div class="pb-step">
                <span class="pb-step-num">${s.num}.</span>
                <span>${esc(s.text)}</span>
              </div>`).join('')}
          </div>` : ''}
        ${(d.dryRun||[]).filter(dr=>dr.headers?.length).map(dr=>`
          <div class="dry-run">
            <div class="dry-run-title">Dry Run</div>
            <div style="overflow-x:auto"><table>
              <thead><tr>${dr.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead>
              <tbody>${dr.rows.map(row=>`<tr>${row.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
            </table></div>
          </div>`).join('')}
        ${d.insights?.length ? `<ul class="insights">${d.insights.map(i=>`<li>▸ ${esc(i)}</li>`).join('')}</ul>` : ''}
        ${d.warnings?.length ? `<ul class="warnings">${d.warnings.map(w=>`<li>⚠ ${esc(w)}</li>`).join('')}</ul>` : ''}
        ${d.complexity ? `
          <div class="complexity">
            <span class="cx-chip">Time: ${esc(d.complexity.time)}</span>
            <span class="cx-chip">Space: ${esc(d.complexity.space)}</span>
          </div>` : ''}
      </div>`;

    case 'checklist': return `
      <div class="block card checklist-block fade-up">
        <h3>${esc(d.title)}</h3>
        <ul>${(d.items||[]).map(item=>`<li><span class="check-mark">✓</span>${esc(item)}</li>`).join('')}</ul>
      </div>`;

    case 'exercise': return `
      <div class="block card exercise-block fade-up">
        <h3>${esc(d.title)}</h3>
        ${(d.items||[]).map(item=>`
          <div class="ex-item">
            <span class="ex-badge">${esc(item.badge)}</span>
            <span>${esc(item.text)}</span>
          </div>`).join('')}
      </div>`;

    case 'divider': {
      const isGrad = d.style === 'gradient';
      return `<div class="block divider-block fade-up"><hr style="background:${isGrad?'linear-gradient(90deg,transparent,var(--accent),transparent)':'var(--border)'}"/></div>`;
    }
    default: return '';
  }
}

function buildHTML(page) {
  const sorted = [...page.blocks].sort((a,b)=>a.order-b.order);
  const blocksHtml = sorted.map(renderBlock).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(page.title)} — DocToPage</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
:root{--bg:#0a0a0f;--surface:#12121a;--border:#1e1e2e;--accent:#f4c542;--accent2:#e05c5c;--accent3:#5cf4b4;--muted:#4a4a6a;--text:#e8e8f0;--text-dim:#8080a0;--mono:'Space Mono',monospace;--sans:'Syne',sans-serif;--body:'Inter',sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:var(--body);min-height:100vh}
body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(244,197,66,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(244,197,66,.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
/* Toolbar */
.toolbar{position:sticky;top:0;z-index:100;background:rgba(10,10,15,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:.6rem 1.5rem;display:flex;align-items:center;gap:1rem}
.toolbar-title{font-family:var(--sans);font-weight:700;font-size:.95rem;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.toolbar a{font-family:var(--mono);font-size:.7rem;color:var(--text-dim);text-decoration:none;border:1px solid var(--border);padding:.25rem .6rem;border-radius:2px;transition:all .15s}
.toolbar a:hover{color:var(--text);border-color:var(--muted)}
.live-dot{width:7px;height:7px;background:var(--accent3);border-radius:50%;animation:pulse 2s infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(92,244,180,.4)}50%{opacity:.7;box-shadow:0 0 0 5px rgba(92,244,180,0)}}
/* Page */
.page{max-width:880px;margin:0 auto;padding:2rem 1.5rem;position:relative;z-index:1}
/* Cards */
.card{background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:1.5rem}
/* Hero */
.hero{background:linear-gradient(135deg,#0d0d18 0%,var(--surface) 100%);border:1px solid var(--border);border-radius:4px;padding:3rem 2rem;text-align:center}
.hero h1{font-family:var(--sans);font-size:2.2rem;font-weight:800;letter-spacing:-.02em;color:var(--accent);margin-bottom:.75rem}
.hero p{color:var(--text-dim);font-size:1rem;line-height:1.65;margin-bottom:1.5rem;max-width:600px;margin-left:auto;margin-right:auto}
.badges{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-bottom:1rem}
.badge{font-family:var(--mono);font-size:.68rem;padding:.2rem .55rem;border-radius:2px;background:rgba(244,197,66,.1);color:var(--accent);border:1px solid rgba(244,197,66,.3)}
.meta-chips{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center}
.meta-chip{font-family:var(--mono);font-size:.68rem;color:var(--text-dim)}
.meta-chip span{color:var(--text)}
/* Timeline */
.tl-label-top{font-family:var(--mono);font-size:.68rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.75rem}
.timeline{display:flex;overflow-x:auto;gap:0}
.tl-seg{flex:1;min-width:110px;padding:.55rem .5rem;text-align:center;border:1px solid var(--border);border-left:none;transition:all .15s}
.tl-seg:first-child{border-left:1px solid var(--border);border-radius:2px 0 0 2px}
.tl-seg:last-child{border-radius:0 2px 2px 0}
.tl-seg.active{background:rgba(244,197,66,.1);border-color:var(--accent)}
.tl-time{font-family:var(--mono);font-size:.63rem;color:var(--text-dim);margin-bottom:.2rem}
.tl-name{font-size:.72rem;color:var(--text);line-height:1.3}
.tl-seg.active .tl-time{color:var(--accent)}
.tl-seg.active .tl-name{color:var(--accent);font-weight:600}
/* Section */
.section-block h2{font-family:var(--sans);font-size:1.35rem;font-weight:700;color:var(--accent);margin-bottom:.75rem;padding-bottom:.5rem;border-bottom:1px solid var(--border)}
.section-block p{color:var(--text);line-height:1.8;white-space:pre-wrap;font-size:.92rem}
/* Tip */
.tip-block{border-left:3px solid var(--accent3)}
.tip-label{font-family:var(--mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.5rem}
.tip-content{color:var(--text);line-height:1.75;font-size:.9rem}
/* Table */
.table-caption{font-family:var(--mono);font-size:.7rem;color:var(--text-dim);margin-bottom:.6rem}
table{width:100%;border-collapse:collapse;font-size:.85rem}
th{font-family:var(--mono);font-size:.72rem;text-align:left;padding:.5rem .75rem;background:rgba(244,197,66,.08);color:var(--accent);border-bottom:1px solid var(--border);white-space:nowrap}
td{padding:.45rem .75rem;color:var(--text);border-bottom:1px solid rgba(30,30,46,.5);vertical-align:top;line-height:1.5}
tr:last-child td{border-bottom:none}
/* Problem */
.problem-block{}
.pb-header{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;flex-wrap:wrap}
.pb-num{font-family:var(--mono);font-size:.7rem;padding:.2rem .5rem;border-radius:2px;background:rgba(244,197,66,.12);color:var(--accent);border:1px solid rgba(244,197,66,.25);flex-shrink:0}
.pb-title{font-family:var(--sans);font-weight:700;font-size:1.15rem;flex:1}
.pb-time{font-family:var(--mono);font-size:.68rem;color:var(--text-dim)}
.pb-link{font-family:var(--mono);font-size:.68rem;color:var(--accent);text-decoration:none;border:1px solid rgba(244,197,66,.25);padding:.15rem .4rem;border-radius:2px;transition:all .15s}
.pb-link:hover{background:rgba(244,197,66,.1)}
.pb-steps{display:flex;flex-direction:column;gap:.45rem;margin-bottom:1rem}
.pb-step{display:flex;gap:.75rem;font-size:.875rem;line-height:1.6}
.pb-step-num{font-family:var(--mono);color:var(--accent);flex-shrink:0;margin-top:.1rem;min-width:20px}
.dry-run{margin:.75rem 0;background:rgba(13,13,22,.5);border:1px solid var(--border);border-radius:2px;padding:.75rem}
.dry-run-title{font-family:var(--mono);font-size:.65rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.5rem}
.dry-run th{background:rgba(92,244,180,.06);color:var(--accent3);font-size:.65rem}
.dry-run td{font-family:var(--mono);font-size:.72rem;padding:.35rem .6rem}
.insights{list-style:none;margin:.5rem 0;display:flex;flex-direction:column;gap:.2rem}
.insights li{color:var(--accent3);font-size:.85rem;line-height:1.5}
.warnings{list-style:none;margin:.5rem 0;display:flex;flex-direction:column;gap:.2rem}
.warnings li{color:var(--accent2);font-size:.85rem;line-height:1.5}
.complexity{display:flex;gap:.6rem;margin-top:.75rem}
.cx-chip{font-family:var(--mono);font-size:.68rem;padding:.2rem .55rem;background:rgba(92,244,180,.1);border:1px solid rgba(92,244,180,.3);color:var(--accent3);border-radius:2px}
/* Checklist */
.checklist-block h3{font-family:var(--sans);font-weight:700;font-size:1.05rem;color:var(--accent);margin-bottom:.75rem}
.checklist-block ul{list-style:none;display:flex;flex-direction:column;gap:.4rem}
.checklist-block li{display:flex;gap:.6rem;align-items:flex-start;font-size:.875rem;line-height:1.6}
.check-mark{color:var(--accent3);font-family:var(--mono);flex-shrink:0;margin-top:.1rem}
/* Exercise */
.exercise-block h3{font-family:var(--sans);font-weight:700;font-size:1.05rem;color:var(--accent2);margin-bottom:.75rem}
.ex-item{display:flex;gap:.75rem;align-items:flex-start;padding:.4rem 0;border-bottom:1px solid rgba(30,30,46,.4)}
.ex-item:last-child{border-bottom:none}
.ex-badge{font-family:var(--mono);font-size:.63rem;padding:.18rem .45rem;border-radius:2px;background:rgba(224,92,92,.15);color:var(--accent2);border:1px solid rgba(224,92,92,.3);flex-shrink:0;white-space:nowrap;margin-top:.1rem}
.ex-item>span:last-child{font-size:.875rem;line-height:1.6}
/* Divider */
.divider-block{padding:.25rem 0}
.divider-block hr{border:none;height:1px;margin:.5rem 0}
/* Block */
.block{margin-bottom:1.35rem}
/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .4s ease both}
.fade-up:nth-child(1){animation-delay:.05s}
.fade-up:nth-child(2){animation-delay:.1s}
.fade-up:nth-child(3){animation-delay:.15s}
.fade-up:nth-child(4){animation-delay:.2s}
/* Scrollbar */
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:var(--muted)}
</style>
</head>
<body>
<div class="toolbar">
  <div class="live-dot"></div>
  <div class="toolbar-title">${esc(page.title)}</div>
  <a href="/">← All Pages</a>
  <a href="/api/pages/${esc(page.id)}/export" download="${esc(page.title.replace(/[^a-z0-9]/gi,'_'))}.html">⬇ Export HTML</a>
</div>
<div class="page">
${blocksHtml}
</div>
</body>
</html>`;
}

// ─── PAGE LIST HTML ────────────────────────────────────────────────────────────
function buildListHTML(pages) {
  const items = Object.values(pages);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>DocToPage</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
:root{--bg:#0a0a0f;--surface:#12121a;--border:#1e1e2e;--accent:#f4c542;--accent2:#e05c5c;--accent3:#5cf4b4;--text:#e8e8f0;--text-dim:#8080a0;--mono:'Space Mono',monospace;--sans:'Syne',sans-serif;--body:'Inter',sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:var(--body);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem}
body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(244,197,66,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(244,197,66,.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
.page{max-width:600px;width:100%;position:relative;z-index:1}
h1{font-family:var(--sans);font-size:2.5rem;font-weight:800;color:var(--accent);text-align:center;margin-bottom:.5rem;letter-spacing:-.02em}
.subtitle{font-family:var(--mono);font-size:.75rem;color:var(--text-dim);text-align:center;margin-bottom:2.5rem}
.card{background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:1.2rem 1.5rem;margin-bottom:.75rem;text-decoration:none;display:flex;align-items:center;gap:1rem;transition:border-color .15s;cursor:pointer}
.card:hover{border-color:var(--accent)}
.card-icon{font-size:1.5rem;flex-shrink:0}
.card-body{flex:1;min-width:0}
.card-title{font-family:var(--sans);font-weight:700;font-size:.95rem;margin-bottom:.2rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card-meta{font-family:var(--mono);font-size:.65rem;color:var(--text-dim)}
.card-arrow{font-family:var(--mono);font-size:.75rem;color:var(--accent);flex-shrink:0}
.empty{font-family:var(--mono);font-size:.75rem;color:var(--text-dim);text-align:center;padding:2rem}
</style>
</head>
<body>
<div class="page">
  <h1>DocToPage</h1>
  <p class="subtitle">AI-Powered Document → Interactive Webpage Converter</p>
  ${items.length === 0 ? '<div class="empty">No pages yet. POST to /api/upload to create one.</div>' : ''}
  ${items.map(p=>`
    <a class="card" href="/page/${p.id}">
      <span class="card-icon">📄</span>
      <div class="card-body">
        <div class="card-title">${esc(p.title)}</div>
        <div class="card-meta">${p.blocks?.length||0} blocks · ${new Date(p.updatedAt).toLocaleDateString()} · ${esc(p.sourceFilename||'')}</div>
      </div>
      <span class="card-arrow">Open →</span>
    </a>`).join('')}
</div>
</body>
</html>`;
}

// ─── EXPORT HTML ──────────────────────────────────────────────────────────────
function buildExportHTML(page) {
  // Reuse same renderer but with export-friendly tweaks
  return buildHTML(page).replace('← All Pages</a>', '← All Pages</a>').replace('href="/"', 'href="#"');
}

// ─── HTTP SERVER ──────────────────────────────────────────────────────────────
const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  const cors = () => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  };

  if (req.method === 'OPTIONS') { cors(); res.writeHead(204); res.end(); return; }
  cors();

  // ── GET / (list page) ──
  if (path === '/' && req.method === 'GET') {
    const db = loadDb();
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    res.end(buildListHTML(db));
    return;
  }

  // ── GET /page/:id ──
  const pageMatch = path.match(/^\/page\/([^/]+)$/);
  if (pageMatch && req.method === 'GET') {
    const db = loadDb();
    const page = db[pageMatch[1]];
    if (!page) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    res.end(buildHTML(page));
    return;
  }

  // ── GET /api/pages ──
  if (path === '/api/pages' && req.method === 'GET') {
    const db = loadDb();
    const summary = Object.values(db).map(p=>({
      id:p.id, title:p.title, createdAt:p.createdAt, updatedAt:p.updatedAt, sourceFilename:p.sourceFilename
    }));
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(summary));
    return;
  }

  // ── GET /api/pages/:id ──
  const apiPageMatch = path.match(/^\/api\/pages\/([^/]+)$/);
  if (apiPageMatch && req.method === 'GET') {
    const db = loadDb();
    const page = db[apiPageMatch[1]];
    if (!page) { res.writeHead(404,'Not Found',{'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Not found'})); return; }
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(page));
    return;
  }

  // ── PATCH /api/pages/:id ──
  if (apiPageMatch && req.method === 'PATCH') {
    let body = '';
    req.on('data', c=>body+=c);
    req.on('end', ()=>{
      try {
        const db = loadDb();
        const page = db[apiPageMatch[1]];
        if (!page) { res.writeHead(404); res.end(JSON.stringify({error:'Not found'})); return; }
        const updates = JSON.parse(body);
        const updated = { ...page, ...updates, updatedAt: new Date().toISOString() };
        db[apiPageMatch[1]] = updated;
        saveDb(db);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(updated));
      } catch(e) { res.writeHead(400); res.end(JSON.stringify({error:e.message})); }
    });
    return;
  }

  // ── DELETE /api/pages/:id ──
  if (apiPageMatch && req.method === 'DELETE') {
    const db = loadDb();
    if (!db[apiPageMatch[1]]) { res.writeHead(404); res.end(JSON.stringify({error:'Not found'})); return; }
    delete db[apiPageMatch[1]];
    saveDb(db);
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({success:true}));
    return;
  }

  // ── POST /api/pages/:id/export ──
  const exportMatch = path.match(/^\/api\/pages\/([^/]+)\/export$/);
  if (exportMatch && req.method === 'POST') {
    const db = loadDb();
    const page = db[exportMatch[1]];
    if (!page) { res.writeHead(404); res.end(JSON.stringify({error:'Not found'})); return; }
    const html = buildExportHTML(page);
    const filename = (page.title||'page').replace(/[^a-z0-9]/gi,'_') + '.html';
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    res.end(html);
    return;
  }

  // ── GET /api/pages/:id/export (also support GET for direct download) ──
  if (exportMatch && req.method === 'GET') {
    const db = loadDb();
    const page = db[exportMatch[1]];
    if (!page) { res.writeHead(404); res.end('Not found'); return; }
    const html = buildExportHTML(page);
    const filename = (page.title||'page').replace(/[^a-z0-9]/gi,'_') + '.html';
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    res.end(html);
    return;
  }

  // ── POST /api/pages (create blank) ──
  if (path === '/api/pages' && req.method === 'POST') {
    let body = '';
    req.on('data', c=>body+=c);
    req.on('end', ()=>{
      const db = loadDb();
      const input = JSON.parse(body||'{}');
      const now = new Date().toISOString();
      const page = { id: randomUUID(), title: input.title||'Untitled', createdAt:now, updatedAt:now, sourceFilename:'', blocks:[] };
      db[page.id] = page;
      saveDb(db);
      res.writeHead(201, {'Content-Type':'application/json'});
      res.end(JSON.stringify(page));
    });
    return;
  }

  // ── 404 ──
  res.writeHead(404, {'Content-Type':'application/json'});
  res.end(JSON.stringify({error:'Not found', path}));
});

server.listen(PORT, ()=>{
  console.log('');
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║      DocToPage Server — Running       ║');
  console.log('  ╠═══════════════════════════════════════╣');
  console.log(`  ║  http://localhost:${PORT}                 ║`);
  console.log(`  ║  http://localhost:${PORT}/page/two-pointer-mastery-lecture-1  ║`);
  console.log('  ╚═══════════════════════════════════════╝');
  console.log('');
  const db = loadDb();
  const count = Object.keys(db).length;
  console.log(`  📄 ${count} page(s) loaded`);
  Object.values(db).forEach(p=>console.log(`     → ${p.id}: "${p.title}"`));
  console.log('');
});
