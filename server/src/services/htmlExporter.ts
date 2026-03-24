import { PageJSON, Block } from '../../../shared/types';

export function generateExportHtml(page: PageJSON): string {
  const blocksHtml = page.blocks
    .sort((a, b) => a.order - b.order)
    .map(renderBlockToHtml)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escHtml(page.title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
<style>
:root{--bg:#0a0a0f;--surface:#12121a;--border:#1e1e2e;--accent:#f4c542;--accent2:#e05c5c;--accent3:#5cf4b4;--muted:#4a4a6a;--text:#e8e8f0;--text-dim:#8080a0;--mono:'Space Mono',monospace;--sans:'Syne',sans-serif;--body:'Inter',sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:var(--body);min-height:100vh;padding:2rem 1rem}
body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(244,197,66,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(244,197,66,.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
.page{max-width:860px;margin:0 auto;position:relative;z-index:1}
.block{margin-bottom:1.5rem;animation:fadeUp .4s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.card{background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:1.5rem}
/* Hero */
.hero{background:linear-gradient(135deg,#0d0d18 0%,var(--surface) 100%);border:1px solid var(--border);border-radius:4px;padding:3rem 2rem;text-align:center}
.hero h1{font-family:var(--sans);font-size:2.5rem;font-weight:800;letter-spacing:-.02em;color:var(--accent);margin-bottom:.75rem}
.hero p{color:var(--text-dim);font-size:1.1rem;margin-bottom:1.5rem}
.badges{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-bottom:1rem}
.badge{font-family:var(--mono);font-size:.7rem;padding:.25rem .6rem;border-radius:2px;background:rgba(244,197,66,.1);color:var(--accent);border:1px solid rgba(244,197,66,.3)}
.meta-chips{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center}
.meta-chip{font-family:var(--mono);font-size:.7rem;color:var(--text-dim)}
.meta-chip span{color:var(--text)}
/* Section */
.section-block h2{font-family:var(--sans);font-size:1.5rem;font-weight:700;color:var(--accent);margin-bottom:.75rem;border-bottom:1px solid var(--border);padding-bottom:.5rem}
.section-block p{color:var(--text);line-height:1.7;white-space:pre-wrap}
/* Tip */
.tip-block{border-left:3px solid var(--accent3);padding-left:1rem}
.tip-label{font-family:var(--mono);font-size:.7rem;color:var(--accent3);margin-bottom:.5rem;text-transform:uppercase}
.tip-content{color:var(--text);line-height:1.7}
/* Table */
.table-block table{width:100%;border-collapse:collapse}
.table-block th{font-family:var(--mono);font-size:.75rem;text-align:left;padding:.5rem .75rem;background:rgba(244,197,66,.08);color:var(--accent);border-bottom:1px solid var(--border)}
.table-block td{padding:.5rem .75rem;color:var(--text);border-bottom:1px solid rgba(30,30,46,.5);font-size:.875rem}
/* Code */
.code-block{background:#0d0d16;border:1px solid var(--border);border-radius:4px;padding:1.25rem;overflow-x:auto}
.code-title{font-family:var(--mono);font-size:.7rem;color:var(--text-dim);margin-bottom:.75rem;text-transform:uppercase}
.code-line{font-family:var(--mono);font-size:.82rem;line-height:1.7;white-space:pre}
.kw{color:#c792ea}.cm{color:var(--muted)}.vr{color:var(--accent3)}.nm{color:var(--text)}
/* Checklist */
.checklist-block h3{font-family:var(--sans);font-size:1.1rem;font-weight:700;margin-bottom:.75rem;color:var(--accent)}
.checklist-block ul{list-style:none}
.checklist-block li{display:flex;gap:.6rem;align-items:flex-start;padding:.35rem 0;color:var(--text);font-size:.9rem;line-height:1.5}
.checklist-block li::before{content:'✓';color:var(--accent3);font-family:var(--mono);flex-shrink:0;margin-top:.1rem}
/* Exercise */
.exercise-block h3{font-family:var(--sans);font-size:1.1rem;font-weight:700;margin-bottom:.75rem;color:var(--accent2)}
.ex-item{display:flex;gap:.75rem;align-items:flex-start;padding:.4rem 0}
.ex-badge{font-family:var(--mono);font-size:.65rem;padding:.2rem .5rem;border-radius:2px;background:rgba(224,92,92,.15);color:var(--accent2);border:1px solid rgba(224,92,92,.3);flex-shrink:0;white-space:nowrap}
/* Timeline */
.timeline-block{display:flex;gap:0;overflow-x:auto}
.tl-seg{flex:1;min-width:80px;padding:.6rem .5rem;text-align:center;border:1px solid var(--border);font-size:.75rem}
.tl-seg.active{background:rgba(244,197,66,.1);border-color:var(--accent)}
.tl-time{font-family:var(--mono);color:var(--text-dim);font-size:.65rem;margin-bottom:.2rem}
.tl-label{color:var(--text);font-size:.75rem}
/* Problem */
.problem-block .pb-header{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.pb-num{font-family:var(--mono);font-size:.7rem;color:var(--accent);background:rgba(244,197,66,.1);padding:.2rem .5rem;border-radius:2px}
.pb-title{font-family:var(--sans);font-size:1.2rem;font-weight:700}
.pb-steps{margin:1rem 0}
.pb-step{display:flex;gap:.75rem;padding:.35rem 0;font-size:.875rem}
.pb-step-num{font-family:var(--mono);color:var(--accent);flex-shrink:0}
.insights-list,.warnings-list{list-style:none;margin:.5rem 0}
.insights-list li{color:var(--accent3);font-size:.85rem;padding:.2rem 0}
.insights-list li::before{content:'▸ '}
.warnings-list li{color:var(--accent2);font-size:.85rem;padding:.2rem 0}
.warnings-list li::before{content:'⚠ '}
.complexity{display:flex;gap:1rem;margin-top:.75rem}
.cx-chip{font-family:var(--mono);font-size:.7rem;padding:.2rem .6rem;background:rgba(92,244,180,.1);border:1px solid rgba(92,244,180,.3);color:var(--accent3);border-radius:2px}
/* Divider */
.divider-block hr{border:none;height:1px;background:var(--border);margin:1rem 0}
.divider-block.gradient hr{background:linear-gradient(90deg,transparent,var(--accent),transparent)}
</style>
</head>
<body>
<div class="page">
${blocksHtml}
</div>
</body>
</html>`;
}

function escHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderBlockToHtml(block: Block): string {
  const d = block.data;
  switch (block.type) {
    case 'hero':
      return `<div class="block hero">
  <h1>${escHtml(d.title || '')}</h1>
  <p>${escHtml(d.subtitle || '')}</p>
  ${d.badges?.length ? `<div class="badges">${d.badges.map((b: string) => `<span class="badge">${escHtml(b)}</span>`).join('')}</div>` : ''}
  ${d.metaChips?.length ? `<div class="meta-chips">${d.metaChips.map((c: any) => `<span class="meta-chip">${escHtml(c.label)}: <span>${escHtml(c.value)}</span></span>`).join('')}</div>` : ''}
</div>`;
    case 'section':
      return `<div class="block card section-block">
  <h2>${escHtml(d.title || '')}</h2>
  <p>${escHtml(d.content || '')}</p>
</div>`;
    case 'tip':
      return `<div class="block card tip-block">
  <div class="tip-label">${escHtml(d.label || 'Tip')}</div>
  <div class="tip-content">${escHtml(d.content || '')}</div>
</div>`;
    case 'table':
      return `<div class="block card table-block">
  ${d.caption ? `<p style="font-family:var(--mono);font-size:.75rem;color:var(--text-dim);margin-bottom:.5rem">${escHtml(d.caption)}</p>` : ''}
  <table><thead><tr>${(d.headers||[]).map((h: string) => `<th>${escHtml(h)}</th>`).join('')}</tr></thead>
  <tbody>${(d.rows||[]).map((row: string[]) => `<tr>${row.map((c: string) => `<td>${escHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
</div>`;
    case 'code':
      return `<div class="block code-block">
  ${d.title ? `<div class="code-title">${escHtml(d.title)}</div>` : ''}
  ${(d.lines||[]).map((l: any) => `<div class="code-line" style="padding-left:${l.indent*1.5}rem"><span class="${l.type==='keyword'?'kw':l.type==='comment'?'cm':l.type==='var'?'vr':'nm'}">${escHtml(l.text)}</span></div>`).join('')}
</div>`;
    case 'checklist':
      return `<div class="block card checklist-block">
  <h3>${escHtml(d.title || '')}</h3>
  <ul>${(d.items||[]).map((item: string) => `<li>${escHtml(item)}</li>`).join('')}</ul>
</div>`;
    case 'exercise':
      return `<div class="block card exercise-block">
  <h3>${escHtml(d.title || '')}</h3>
  ${(d.items||[]).map((item: any) => `<div class="ex-item"><span class="ex-badge">${escHtml(item.badge)}</span><span>${escHtml(item.text)}</span></div>`).join('')}
</div>`;
    case 'timeline':
      return `<div class="block card"><div class="timeline-block">
  ${(d.segments||[]).map((s: any) => `<div class="tl-seg${s.active?' active':''}"><div class="tl-time">${escHtml(s.time)}</div><div class="tl-label">${escHtml(s.label)}</div></div>`).join('')}
</div></div>`;
    case 'problem':
      return `<div class="block card problem-block">
  <div class="pb-header">
    <span class="pb-num">#${d.number||''}</span>
    <span class="pb-title">${escHtml(d.title||'')}</span>
    ${d.link ? `<a href="${escHtml(d.link)}" style="font-family:var(--mono);font-size:.7rem;color:var(--accent);margin-left:auto">${escHtml(d.platform||'Link')} ↗</a>` : ''}
  </div>
  <div class="pb-steps">${(d.steps||[]).map((s: any) => `<div class="pb-step"><span class="pb-step-num">${s.num}.</span><span>${escHtml(s.text)}</span></div>`).join('')}</div>
  ${d.insights?.length ? `<ul class="insights-list">${d.insights.map((i: string) => `<li>${escHtml(i)}</li>`).join('')}</ul>` : ''}
  ${d.warnings?.length ? `<ul class="warnings-list">${d.warnings.map((w: string) => `<li>${escHtml(w)}</li>`).join('')}</ul>` : ''}
  ${d.complexity ? `<div class="complexity"><span class="cx-chip">Time: ${escHtml(d.complexity.time||'')}</span><span class="cx-chip">Space: ${escHtml(d.complexity.space||'')}</span></div>` : ''}
</div>`;
    case 'divider':
      return `<div class="block divider-block${d.style==='gradient'?' gradient':''}"><hr /></div>`;
    default:
      return '';
  }
}
