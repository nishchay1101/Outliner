/**
 * Seed script — inserts the Two Pointer Mastery lecture page.
 * Uses rawHtml blocks matching the reference lecture1_two_pointer.html.
 * Run with: node seed-page.mjs
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

let Database;
try {
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  Database = require('better-sqlite3');
} catch {}

const dataDir = process.env.DB_PATH
  ? dirname(process.env.DB_PATH)
  : join(__dirname, '../data');
const dbPath = process.env.DB_PATH || join(dataDir, 'pages.db');

if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const now = new Date().toISOString();
const pageId = 'two-pointer-mastery-lecture-1';

const raw = (html, order) => ({ id: randomUUID(), type: 'rawHtml', order, data: { html } });
let ord = 2;

const blocks = [
  // ── Hero ──────────────────────────────────────────────────────────────────
  {
    id: randomUUID(), type: 'hero', order: 0,
    data: {
      title: 'Lecture 1 — Two Pointer Mastery',
      subtitle: 'Master the art of pointer movement: turn O(n²) brute-force into elegant O(n) solutions using same-direction and opposite-direction patterns.',
      badges: ['2 Hours', '8 Problems', 'Two Pointer', 'In-Place Arrays', 'Pattern Recognition'],
      metaChips: [
        { label: 'Duration', value: '2 Hours' },
        { label: 'Problems', value: '8 Major Patterns' },
        { label: 'Focus', value: 'Same Dir · Opposite Dir · Advanced' },
      ],
    },
  },

  // ── Timeline ──────────────────────────────────────────────────────────────
  {
    id: randomUUID(), type: 'timeline', order: 1,
    data: {
      segments: [
        { time: '0–5 min',    label: 'Intro',        active: true  },
        { time: '5–35 min',   label: 'Same Dir',      active: false },
        { time: '35–75 min',  label: 'Opposite Dir',  active: false },
        { time: '75–105 min', label: 'Advanced',      active: false },
        { time: '105–120 min',label: 'Wrap-Up',       active: false },
      ],
    },
  },

  // ── Problem strip ─────────────────────────────────────────────────────────
  raw(`
  <div class="problem-strip">
    <div class="strip-label">All Problems Covered Today</div>
    <div class="problem-tags">
      <span class="ptag tp">Move Zeroes</span>
      <span class="ptag tp">Remove Duplicates</span>
      <span class="ptag tp">Sort Colors</span>
      <span class="ptag tp">Container With Most Water</span>
      <span class="ptag tp">Pair Sum Rotated</span>
      <span class="ptag tp">3Sum</span>
      <span class="ptag tp">Merge 3 Sorted Arrays</span>
      <span class="ptag kd">4Sum Count</span>
    </div>
  </div>`, ord++),

  // ── SEGMENT 0 — INTRO ─────────────────────────────────────────────────────
  raw(`
  <div class="segment" id="intro">
    <div class="segment-header">
      <div class="time-block blue">⏱ 0 – 5 min</div>
      <div class="segment-title">Introduction + Pattern Recognition</div>
      <div class="segment-line"></div>
    </div>

    <div class="two-col">
      <div class="intro-card">
        <div class="card-label">Open With This Question</div>
        <div class="question-bubble">"How do we turn O(n²) into O(n)?"</div>
        <p class="teach-note">
          Don't answer immediately. Let students think 30 seconds. Then say:<br><br>
          <em>"The trick is — instead of two nested loops each scanning the array independently, what if both loops move through the array at the same time? That's the Two Pointer idea."</em>
        </p>
      </div>
      <div class="intro-card">
        <div class="card-label">The Two Golden Rules — Drill These In</div>
        <ul class="rule-list">
          <li><span class="rule-arrow">→</span><span>If the array is <strong>sorted</strong> (or you can sort it), think Two Pointer. Sorting gives you predictable order — you can reason about whether to move left or right.</span></li>
          <li><span class="rule-arrow">→</span><span>If the problem says <strong>in-place</strong> or no extra space, think Two Pointer. One pointer reads, one pointer writes — no extra array needed.</span></li>
          <li><span class="rule-arrow">→</span><span>Draw the pattern on board: same-direction (slow + fast) vs opposite-direction (left + right from ends).</span></li>
        </ul>
      </div>
    </div>
  </div>`, ord++),

  { id: randomUUID(), type: 'divider', order: ord++, data: { style: 'gradient' } },

  // ── SEGMENT 1 — SAME DIRECTION ────────────────────────────────────────────
  raw(`
  <div class="segment" id="same-dir">
    <div class="segment-header">
      <div class="time-block blue">⏱ 5 – 35 min</div>
      <div class="segment-title">Two Pointer — Same Direction</div>
      <div class="segment-line"></div>
    </div>

    <div class="tip-card">
      <div class="tip-label">Teacher Framing Before This Block</div>
      <p>Tell students: <em>"In same-direction two pointers, we have a <strong>slow pointer</strong> that marks where to write, and a <strong>fast pointer</strong> that reads ahead. The fast one finds what we want; the slow one places it. They both start from the left and move right — but at different speeds."</em></p>
    </div>

    <!-- P1: Move Zeroes -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P1</span>
        <span class="pc-title">Move Zeroes</span>
        <span class="pc-time">15 min</span>
        <a href="https://leetcode.com/problems/move-zeroes/description/" target="_blank" class="pc-link">↗ LeetCode 283</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">How to Explain the Problem</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text">Write <code>[0,1,0,3,12]</code> on the board. Ask: <strong>"How do we push all zeros to the end while keeping the non-zeros in order?"</strong></div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Brute approach (say it out loud):</strong> For each zero, shift all elements after it one step left. This is O(n²). Show that it involves repeated scanning — wasteful.</div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Optimal insight:</strong> <em>"Can we do it in one pass? What if slow stays where we need to place the next non-zero, and fast scans ahead?"</em></div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text">When fast finds a non-zero: <strong>swap</strong> <code>arr[slow]</code> and <code>arr[fast]</code>, then move slow forward. Fast always moves forward.</div></div>
          <div class="complexity-row" style="margin-top:10px">
            <div class="cx-chip bad">O(n²) brute</div>
            <div class="cx-chip time">O(n) optimal</div>
            <div class="cx-chip space">O(1) space</div>
          </div>
        </div>

        <div class="pc-section">
          <div class="pc-section-label">Dry Run — [0, 1, 0, 3, 12]</div>
          <div class="pointer-visual">
            <div class="arr-label">Initial</div>
            <div class="arr-row">
              <span class="arr-label">val:</span>
              <div class="arr-cell zero">0</div><div class="arr-cell">1</div><div class="arr-cell zero">0</div><div class="arr-cell">3</div><div class="arr-cell">12</div>
            </div>
            <div style="margin:10px 0; font-size:11px; color:var(--muted);">── slow=0, fast scans →</div>
            <div class="dry-run">
              <table>
                <thead><tr><th>fast</th><th>arr[fast]</th><th>action</th><th>slow after</th><th>array</th></tr></thead>
                <tbody>
                  <tr><td>0</td><td class="hl2">0</td><td>skip</td><td>0</td><td>[<span style="color:var(--accent2)">0</span>,1,0,3,12]</td></tr>
                  <tr><td>1</td><td class="hl">1</td><td>swap s=0,f=1 → slow++</td><td>1</td><td>[<span style="color:var(--accent)">1</span>,0,0,3,12]</td></tr>
                  <tr><td>2</td><td class="hl2">0</td><td>skip</td><td>1</td><td>[1,0,0,3,12]</td></tr>
                  <tr><td>3</td><td class="hl">3</td><td>swap s=1,f=3 → slow++</td><td>2</td><td>[1,<span style="color:var(--accent)">3</span>,0,0,12]</td></tr>
                  <tr><td>4</td><td class="hl">12</td><td>swap s=2,f=4 → slow++</td><td>3</td><td>[1,3,<span style="color:var(--accent)">12</span>,0,0]</td></tr>
                </tbody>
              </table>
            </div>
            <div class="ptr-legend">
              <div class="ptr-item"><div class="ptr-dot" style="background:var(--accent)"></div>slow</div>
              <div class="ptr-item"><div class="ptr-dot" style="background:var(--accent3)"></div>fast</div>
              <div class="ptr-item"><div class="ptr-dot" style="background:var(--accent2)"></div>zero</div>
            </div>
          </div>
          <div class="insight-box">Key insight: slow always points to where the next non-zero should go. Fast does the searching.</div>
        </div>
      </div>
    </div>

    <!-- P2: Remove Duplicates -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P2</span>
        <span class="pc-title">Remove Duplicates from Sorted Array</span>
        <span class="pc-time">10 min</span>
        <a href="https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/" target="_blank" class="pc-link">↗ LeetCode 26</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">How to Relate It to Move Zeroes</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text">Say: <em>"This is the same slow/fast idea. But instead of zeroes, we're filtering duplicates. The array is already sorted — so duplicates are always adjacent."</em></div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Ask students:</strong> What should slow track? → <em>The last unique element placed.</em> What should fast check? → <em>Is arr[fast] different from arr[slow]?</em></div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text">If <code>arr[fast] != arr[slow]</code>: slow++, overwrite <code>arr[slow] = arr[fast]</code>. Otherwise skip (fast moves, slow stays).</div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Student attempt:</strong> Give them 3 minutes to code. Then walk through together.</div></div>

          <div class="algo-box" style="margin-top:10px">
            <div><span class="kw">slow</span> = 0</div>
            <div><span class="kw">for</span> <span class="var">fast</span> = 1 → n-1:</div>
            <div class="indent"><span class="kw">if</span> arr[<span class="var">fast</span>] ≠ arr[<span class="kw">slow</span>]:</div>
            <div class="indent2"><span class="kw">slow</span>++</div>
            <div class="indent2">arr[<span class="kw">slow</span>] = arr[<span class="var">fast</span>]</div>
            <div><span class="cm">// return slow + 1 (length of unique part)</span></div>
          </div>
        </div>

        <div class="pc-section">
          <div class="pc-section-label">Dry Run — [1, 1, 2, 3, 3]</div>
          <div class="dry-run" style="margin-top:8px">
            <table>
              <thead><tr><th>fast</th><th>arr[fast]</th><th>≠ arr[slow]?</th><th>action</th><th>slow</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>1</td><td>No (1=1)</td><td>skip</td><td>0</td></tr>
                <tr><td>2</td><td class="hl">2</td><td>Yes (2≠1)</td><td>slow++, arr[1]=2</td><td>1</td></tr>
                <tr><td>3</td><td class="hl">3</td><td>Yes (3≠2)</td><td>slow++, arr[2]=3</td><td>2</td></tr>
                <tr><td>4</td><td>3</td><td>No (3=3)</td><td>skip</td><td>2</td></tr>
              </tbody>
            </table>
          </div>
          <div class="insight-box">Result: arr = [1,2,3,_,_], return slow+1 = 3. The pattern is identical to Move Zeroes — slow writes, fast reads.</div>
          <div class="complexity-row" style="margin-top:8px">
            <div class="cx-chip time">O(n) time</div>
            <div class="cx-chip space">O(1) space</div>
          </div>
        </div>
      </div>
    </div>

    <!-- P3: Sort Colors -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P3</span>
        <span class="pc-title">Sort Colors (Dutch National Flag)</span>
        <span class="pc-time">15 min</span>
        <a href="https://leetcode.com/problems/sort-colors/description/" target="_blank" class="pc-link">↗ LeetCode 75</a>
      </div>
      <div class="pc-body-wide">
        <div class="cols">
          <div class="pc-section">
            <div class="pc-section-label">Build Up the Idea</div>
            <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Counting approach first:</strong> Count 0s, 1s, 2s → fill back. Works, but 2 passes. Can we do 1 pass?</div></div>
            <div class="step-row"><div class="step-num">2</div><div class="step-text">Introduce <strong>three pointers</strong>: <code>lo=0</code> (all 0s go left of lo), <code>mid=0</code> (current element), <code>hi=n-1</code> (all 2s go right of hi).</div></div>
            <div class="step-row"><div class="step-num">3</div><div class="step-text">Say: <em>"lo and hi are boundaries. mid is our explorer. We keep swapping until mid crosses hi."</em></div></div>
          </div>
          <div class="pc-section">
            <div class="pc-section-label">The Three Rules (write on board)</div>
            <div class="step-row"><div class="step-num">0</div><div class="step-text"><code>arr[mid]==0</code>: swap with arr[lo], lo++, mid++</div></div>
            <div class="step-row"><div class="step-num">1</div><div class="step-text"><code>arr[mid]==1</code>: just mid++ (it's in the right zone)</div></div>
            <div class="step-row"><div class="step-num">2</div><div class="step-text"><code>arr[mid]==2</code>: swap with arr[hi], hi-- (don't move mid — we haven't checked what came from hi yet)</div></div>
          </div>
          <div class="pc-section">
            <div class="pc-section-label">Edge Cases to Highlight</div>
            <div class="warn-box">⚠️ When arr[mid]==2 and we swap: <strong>don't increment mid</strong>. The value we got from hi is unknown — we need to check it next.</div>
            <div class="step-row" style="margin-top:8px"><div class="step-num">!</div><div class="step-text">All 0s: lo=hi=mid all move together safely.</div></div>
            <div class="step-row"><div class="step-num">!</div><div class="step-text">All same value: one pointer reaches the end quickly.</div></div>
          </div>
        </div>
        <div class="dry-run">
          <div class="pc-section-label">Dry Run — [2, 0, 2, 1, 1, 0]</div>
          <table>
            <thead><tr><th>lo</th><th>mid</th><th>hi</th><th>arr[mid]</th><th>action</th><th>array</th></tr></thead>
            <tbody>
              <tr><td>0</td><td>0</td><td>5</td><td class="hl2">2</td><td>swap(0,5), hi--</td><td>[0,0,2,1,1,<span style="color:var(--accent2)">2</span>]</td></tr>
              <tr><td>0</td><td>0</td><td>4</td><td class="hl">0</td><td>swap(0,0), lo++, mid++</td><td>[<span style="color:var(--accent)">0</span>,0,2,1,1,2]</td></tr>
              <tr><td>1</td><td>1</td><td>4</td><td class="hl">0</td><td>swap(1,1), lo++, mid++</td><td>[0,<span style="color:var(--accent)">0</span>,2,1,1,2]</td></tr>
              <tr><td>2</td><td>2</td><td>4</td><td class="hl2">2</td><td>swap(2,4), hi--</td><td>[0,0,1,1,<span style="color:var(--accent2)">2</span>,2]</td></tr>
              <tr><td>2</td><td>2</td><td>3</td><td>1</td><td>mid++</td><td>[0,0,1,1,2,2]</td></tr>
              <tr><td>2</td><td>3</td><td>3</td><td>1</td><td>mid++</td><td>[0,0,1,1,2,2] ✓</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`, ord++),

  { id: randomUUID(), type: 'divider', order: ord++, data: { style: 'gradient' } },

  // ── SEGMENT 2 — OPPOSITE DIRECTION ───────────────────────────────────────
  raw(`
  <div class="segment" id="opposite-dir">
    <div class="segment-header">
      <div class="time-block green">⏱ 35 – 75 min</div>
      <div class="segment-title">Two Pointer — Opposite Direction</div>
      <div class="segment-line"></div>
    </div>

    <div class="tip-card">
      <div class="tip-label">Teacher Framing Before This Block</div>
      <p>Say: <em>"Now we flip the pattern. Instead of both pointers starting from the left, one starts from the left and one from the right. When their sum is too big, we shrink from the right. When it's too small, we grow from the left. <strong>Sorted arrays make this work — you always know which direction is bigger.</strong>"</em></p>
    </div>

    <!-- P4: Container With Most Water -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P4</span>
        <span class="pc-title">Container With Most Water</span>
        <span class="pc-time">15 min</span>
        <a href="https://leetcode.com/problems/container-with-most-water/description/" target="_blank" class="pc-link">↗ LeetCode 11</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">Building the Intuition</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Draw on board:</strong> Vertical bars at positions. Water = width × min(left height, right height). Ask students to maximize this.</div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Brute O(n²):</strong> Try all pairs. Then ask: <em>"What information do we actually need at each step?"</em></div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>The greedy key:</strong> Start with maximum width (left=0, right=n-1). Now we must shrink width — is that worth it? <em>Only if we might gain a taller bar.</em></div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Why move the smaller side?</strong> If we move the taller side, min stays the same or gets smaller — area can only go down. So always move the smaller height pointer inward.</div></div>

          <div class="algo-box" style="margin-top:10px">
            <div><span class="var">L</span>=0, <span class="var">R</span>=n-1, <span class="var">maxW</span>=0</div>
            <div><span class="kw">while</span> L &lt; R:</div>
            <div class="indent"><span class="var">w</span> = (R-L) * min(h[L], h[R])</div>
            <div class="indent"><span class="var">maxW</span> = max(<span class="var">maxW</span>, <span class="var">w</span>)</div>
            <div class="indent"><span class="kw">if</span> h[L] &lt; h[R]: L++</div>
            <div class="indent"><span class="kw">else</span>: R--</div>
          </div>
        </div>

        <div class="pc-section">
          <div class="pc-section-label">Dry Run — [1, 8, 6, 2, 5, 4, 8, 3, 7]</div>
          <div class="insight-box" style="margin-bottom:10px">When we move left pointer inward, we're discarding all pairs (L, X) for X &lt; R. Are any of them better? No — because min(h[L], h[X]) ≤ h[L] already, and the width is smaller too.</div>
          <div class="dry-run">
            <table>
              <thead><tr><th>L</th><th>R</th><th>h[L]</th><th>h[R]</th><th>area</th><th>move</th></tr></thead>
              <tbody>
                <tr><td>0</td><td>8</td><td>1</td><td>7</td><td class="hl2">8</td><td>L++ (1&lt;7)</td></tr>
                <tr><td>1</td><td>8</td><td>8</td><td>7</td><td class="hl">49</td><td>R-- (7&lt;8)</td></tr>
                <tr><td>1</td><td>7</td><td>8</td><td>3</td><td>18</td><td>R--</td></tr>
                <tr><td>1</td><td>6</td><td>8</td><td>8</td><td class="hl">40</td><td>R--</td></tr>
                <tr colspan="6"><td colspan="6" style="color:var(--muted); font-style:italic;">… continues until L meets R. Max = 49</td></tr>
              </tbody>
            </table>
          </div>
          <div class="complexity-row" style="margin-top:8px">
            <div class="cx-chip time">O(n) time</div>
            <div class="cx-chip space">O(1) space</div>
          </div>
        </div>
      </div>
    </div>

    <!-- P5: Pair Sum Rotated -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P5</span>
        <span class="pc-title">Pair Sum in a Sorted and Rotated Array</span>
        <span class="pc-time">15 min</span>
        <a href="https://www.geeksforgeeks.org/problems/pair-sum-in-a-sorted-and-rotated-array/1" target="_blank" class="pc-link">↗ GFG</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">The Twist — Rotated Array</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Draw:</strong> <code>[4, 5, 6, 7, 0, 1, 2]</code>. Rotated sorted array. "Can we still use two pointers? The array isn't sorted from index 0 to n-1 anymore."</div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Key insight:</strong> Find the pivot (max element). The two pointers start at max (lo) and one after max (hi), moving circularly.</div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text">Movement is same as standard 2-pointer: sum too big → move hi to the left (circular). Sum too small → move lo to the right (circular). Use <code>% n</code> for wrap-around.</div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Relate:</strong> <em>"The logic is identical to standard pair sum — but the 'ends' are now the pivot boundaries of the rotation."</em></div></div>
        </div>
        <div class="pc-section">
          <div class="pc-section-label">Circular Pointer Movement</div>
          <div class="pointer-visual">
            <div class="arr-label">Array: [11, 15, 6, 8, 9, 10], target=16</div>
            <div class="arr-row" style="margin-top:8px">
              <div class="arr-cell">11</div><div class="arr-cell">15</div><div class="arr-cell slow">6</div><div class="arr-cell">8</div><div class="arr-cell">9</div><div class="arr-cell fast">10</div>
            </div>
            <div style="font-size:11px; color:var(--muted-color,#6b7280); margin-top:8px">
              Pivot = index of max (15, idx=1).<br>
              lo = idx after pivot = 2 → arr[2]=6<br>
              hi = pivot = 1 → arr[1]=15<br>
              sum=21 &gt; 16 → hi-- (circular: hi=(1-1+6)%6=0)<br>
              sum=17 &gt; 16 → hi-- (hi=5)<br>
              sum=16 == target → <span style="color:var(--accent3)">FOUND (lo=2, hi=5)</span>
            </div>
          </div>
          <div class="insight-box">Circular indexing: next of hi = (hi - 1 + n) % n. Stop when lo == hi (one element left).</div>
        </div>
      </div>
    </div>

    <!-- P6: 3Sum -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P6</span>
        <span class="pc-title">3Sum</span>
        <span class="pc-time">20 min</span>
        <a href="https://leetcode.com/problems/3sum/description/" target="_blank" class="pc-link">↗ LeetCode 15</a>
      </div>
      <div class="pc-body-wide">
        <div class="cols">
          <div class="pc-section">
            <div class="pc-section-label">Complexity Journey</div>
            <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>O(n³) brute:</strong> 3 nested loops. For each triple (i,j,k), check sum. Totally fine to mention, then immediately say "we want O(n²)."</div></div>
            <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Reduction idea:</strong> Sort first. Then fix one element (arr[i]) and run two-pointer on the rest. <em>"We just turned 3Sum into 2Sum!"</em></div></div>
            <div class="step-row"><div class="step-num">3</div><div class="step-text">Outer loop i: 0 → n-3. Inner: L=i+1, R=n-1. Want arr[L]+arr[R] = -arr[i].</div></div>
          </div>
          <div class="pc-section">
            <div class="pc-section-label">Duplicate Handling (critical!)</div>
            <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Skip duplicate i:</strong> If arr[i] == arr[i-1], skip. Same outer value would produce same results.</div></div>
            <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Skip duplicate L/R after finding a triplet:</strong> Move L right while arr[L]==arr[L-1]. Move R left while arr[R]==arr[R+1].</div></div>
            <div class="warn-box">⚠️ Most students miss this. Show the example [-2, 0, 0, 2, 2] and how without skipping you'd get duplicate triplets.</div>
          </div>
          <div class="pc-section">
            <div class="pc-section-label">Algorithm</div>
            <div class="algo-box">
              <div><span class="fn">sort</span>(arr)</div>
              <div><span class="kw">for</span> i=0 → n-3:</div>
              <div class="indent"><span class="kw">if</span> i&gt;0 <span class="kw">and</span> arr[i]==arr[i-1]: skip</div>
              <div class="indent"><span class="var">L</span>=i+1, <span class="var">R</span>=n-1</div>
              <div class="indent"><span class="kw">while</span> L &lt; R:</div>
              <div class="indent2">s = arr[i]+arr[L]+arr[R]</div>
              <div class="indent2"><span class="kw">if</span> s==0: add; skip dups</div>
              <div class="indent2"><span class="kw">elif</span> s&lt;0: L++</div>
              <div class="indent2"><span class="kw">else</span>: R--</div>
            </div>
          </div>
        </div>
        <div class="complexity-row">
          <div class="cx-chip bad">O(n³) brute</div>
          <div class="cx-chip time">O(n²) optimal</div>
          <div class="cx-chip space">O(1) extra space</div>
        </div>
      </div>
    </div>
  </div>`, ord++),

  { id: randomUUID(), type: 'divider', order: ord++, data: { style: 'gradient' } },

  // ── SEGMENT 3 — ADVANCED ─────────────────────────────────────────────────
  raw(`
  <div class="segment" id="advanced">
    <div class="segment-header">
      <div class="time-block purple">⏱ 75 – 105 min</div>
      <div class="segment-title">Advanced Two Pointer</div>
      <div class="segment-line"></div>
    </div>

    <div class="tip-card">
      <div class="tip-label">Teacher Framing Before This Block</div>
      <p>Say: <em>"Now we generalize. What if we have 3 arrays instead of 1? Or 4 elements instead of 3? The pattern stays the same — but we extend the idea. This is about seeing the abstraction, not memorizing cases."</em></p>
    </div>

    <!-- P7: Merge 3 Sorted Arrays -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P7</span>
        <span class="pc-title">Merge Three Sorted Arrays</span>
        <span class="pc-time">20 min</span>
        <a href="https://www.geeksforgeeks.org/problems/merge-three-sorted-arrays-1587115620/0" target="_blank" class="pc-link">↗ GFG</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">Build From Merge 2 First</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Start with merge 2 sorted arrays:</strong> Two pointers i and j, compare arr1[i] vs arr2[j], pick smaller, advance that pointer. Students should know this.</div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Extend to 3:</strong> Now three pointers i, j, k for arrays A, B, C. At each step, pick the minimum of A[i], B[j], C[k]. Advance that pointer.</div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Generalization:</strong> For k sorted arrays of total n elements, we'd use a min-heap of size k → O(n log k). But for 3 arrays, 3 direct pointers is O(n) and simpler.</div></div>

          <div class="algo-box" style="margin-top:10px">
            <div>i=0, j=0, k=0</div>
            <div><span class="kw">while</span> all pointers &lt; their array end:</div>
            <div class="indent"><span class="var">mn</span> = min(A[i], B[j], C[k])</div>
            <div class="indent">append <span class="var">mn</span> to result</div>
            <div class="indent"><span class="kw">if</span> mn==A[i]: i++</div>
            <div class="indent"><span class="kw">elif</span> mn==B[j]: j++</div>
            <div class="indent"><span class="kw">else</span>: k++</div>
            <div><span class="cm">// drain remaining arrays after one ends</span></div>
          </div>
        </div>

        <div class="pc-section">
          <div class="pc-section-label">Visual — Step-by-step</div>
          <div class="pointer-visual">
            <div style="font-size:11px; color:var(--muted-color,#6b7280); margin-bottom:8px">A=[1,5,9] &nbsp; B=[2,6] &nbsp; C=[3,7,10]</div>
            <div class="dry-run">
              <table>
                <thead><tr><th>i</th><th>j</th><th>k</th><th>min picked</th><th>result so far</th></tr></thead>
                <tbody>
                  <tr><td>0</td><td>0</td><td>0</td><td class="hl">A[0]=1</td><td>[1]</td></tr>
                  <tr><td>1</td><td>0</td><td>0</td><td class="hl">B[0]=2</td><td>[1,2]</td></tr>
                  <tr><td>1</td><td>1</td><td>0</td><td class="hl">C[0]=3</td><td>[1,2,3]</td></tr>
                  <tr><td>1</td><td>1</td><td>1</td><td class="hl">A[1]=5</td><td>[1,2,3,5]</td></tr>
                  <tr><td>2</td><td>1</td><td>1</td><td class="hl">B[1]=6</td><td>[1,2,3,5,6]</td></tr>
                  <tr><td>2</td><td>-</td><td>1</td><td class="hl">C[1]=7</td><td>[1,2,3,5,6,7]</td></tr>
                  <tr><td>2</td><td>-</td><td>2</td><td class="hl">A[2]=9</td><td>[1,2,3,5,6,7,9]</td></tr>
                  <tr><td>-</td><td>-</td><td>2</td><td class="hl">C[2]=10</td><td>[1,2,3,5,6,7,9,10] ✓</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="complexity-row" style="margin-top:8px">
            <div class="cx-chip time">O(n) time</div>
            <div class="cx-chip space">O(n) result array</div>
          </div>
          <div class="insight-box">Generalization: this is essentially priority queue / min-heap logic for k arrays. Good bridge to heap topic later!</div>
        </div>
      </div>
    </div>

    <!-- P8: 4Sum -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P8</span>
        <span class="pc-title">4Sum — Count Quadruplets with Given Sum</span>
        <span class="pc-time">10 min (idea only)</span>
        <a href="https://www.geeksforgeeks.org/problems/count-quadruplets-with-given-sum/1" target="_blank" class="pc-link">↗ GFG</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">Idea Discussion (No Full Code)</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Relate to 3Sum:</strong> <em>"We fixed 1 element for 3Sum → 2-pointer. What if we fix 2 elements for 4Sum → 2-pointer?"</em></div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text">Outer two loops fix i and j. Inner two-pointer L=j+1, R=n-1. Check if arr[i]+arr[j]+arr[L]+arr[R]==target.</div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Complexity:</strong> O(n³). For just counting (not finding distinct quads), the 2-pointer inner pass counts pairs in O(n).</div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Ask students:</strong> <em>"See the pattern? 2Sum: O(n). 3Sum: O(n²). 4Sum: O(n³). Each level of nesting adds one dimension. Two pointers always buy you one free level."</em></div></div>
        </div>
        <div class="pc-section">
          <div class="pc-section-label">The Big Picture</div>
          <div class="algo-box">
            <div><span class="cm">// Pattern: fix (n-2) elements, 2-pointer the rest</span></div>
            <div><span class="kw">sort</span>(arr)</div>
            <div><span class="kw">for</span> i=0 → n-4:</div>
            <div class="indent"><span class="kw">for</span> j=i+1 → n-3:</div>
            <div class="indent2">L=j+1, R=n-1</div>
            <div class="indent2"><span class="kw">while</span> L &lt; R:</div>
            <div class="indent2" style="padding-left:60px">check sum, move L/R</div>
          </div>
          <div class="insight-box">Homework extension: Can students solve LeetCode 18 (4Sum, distinct quadruplets) using this same pattern + duplicate skipping from 3Sum?</div>
        </div>
      </div>
    </div>
  </div>`, ord++),

  { id: randomUUID(), type: 'divider', order: ord++, data: { style: 'gradient' } },

  // ── SEGMENT 4 — WRAP-UP ───────────────────────────────────────────────────
  raw(`
  <div class="segment" id="wrap-up">
    <div class="segment-header">
      <div class="time-block blue">⏱ 105 – 120 min</div>
      <div class="segment-title">Wrap-Up + Practice</div>
      <div class="segment-line"></div>
    </div>

    <div class="wrapup-grid">
      <div class="wrapup-card">
        <div class="wc-title"><div class="wc-icon">?</div> Ask Students These</div>
        <ul class="check-list">
          <li><strong>When do you use two pointer?</strong> When array is sorted, or when you need in-place with O(1) space, or when brute force is O(n²) and you can gain by moving pointers with intent.</li>
          <li><strong>Why does sorting help?</strong> Because it gives you a direction — you know moving left means smaller, moving right means larger. Without that, you can't reason about which pointer to move.</li>
          <li><strong>Same-direction vs opposite-direction?</strong> Same = read/write (one pointer filters, one writes). Opposite = search (converging from both ends toward a target).</li>
          <li><strong>How do we handle duplicates?</strong> Skip identical values when we've already processed that value — to avoid duplicate answers in 3Sum-style problems.</li>
        </ul>
      </div>

      <div class="wrapup-card">
        <div class="wc-title"><div class="wc-icon">✓</div> Today's Key Takeaways</div>
        <ul class="check-list">
          <li>Two pointer converts O(n²) nested loops into O(n) single pass</li>
          <li>Same-direction: slow tracks write position, fast scans ahead</li>
          <li>Opposite-direction: converge from ends, move based on comparison</li>
          <li>Sorting first enables opposite-direction pointer logic</li>
          <li>3-pointer (Dutch Flag) handles 3-partition problems in one pass</li>
          <li>3Sum = sort + fix 1 element + 2-pointer. 4Sum = fix 2 elements + 2-pointer</li>
          <li>Multi-pointer merge extends the same "pick the minimum" idea to k arrays</li>
        </ul>
      </div>
    </div>

    <div class="exercise-card">
      <div class="ex-title">⚡ Mini Exercise — Transform What You Learned</div>
      <div class="ex-item"><div class="ex-badge">EX 1</div><span><strong>2Sum (sorted array):</strong> Simplify your 3Sum solution. Remove the outer loop. You now have pure opposite two-pointer. Can you do it without sort? (Hash map approach — compare trade-offs.)</span></div>
      <div class="ex-item"><div class="ex-badge">EX 2</div><span><strong>3Sum Closest (LC 16):</strong> Same as 3Sum but instead of sum == 0, track the triplet whose sum is closest to target. Only change: track <code>abs(sum - target)</code>. Same structure otherwise.</span></div>
      <div class="ex-item"><div class="ex-badge">EX 3</div><span><strong>4Sum (LC 18):</strong> Extend 3Sum with an extra outer loop. Add duplicate-skipping for both outer loops. This is the full O(n³) distinct quadruplets solution.</span></div>
      <div class="ex-item"><div class="ex-badge">HW</div><span><strong>Next lecture preview — Sliding Window:</strong> Move Zeroes was a hint — a window that grows. Problems: Max Sum Subarray of size K, Longest Substring Without Repeating Characters, Minimum Size Subarray Sum. Read problem statements before next class.</span></div>
    </div>
  </div>`, ord++),
];

const page = {
  id: pageId,
  title: 'Lecture 1 — Two Pointer Mastery',
  createdAt: now,
  updatedAt: now,
  sourceFilename: 'two_pointer_lecture.docx',
  blocks,
};

// ── Write to JSON store ───────────────────────────────────────────────────────
const pagesJsonPath = join(dataDir, 'pages.json');
let pages = [];
try {
  const raw2 = JSON.parse(readFileSync(pagesJsonPath, 'utf8'));
  pages = Array.isArray(raw2) ? raw2 : (raw2.pages || Object.values(raw2) || []);
} catch {}

const existingIdx = pages.findIndex(p => p.id === pageId);
if (existingIdx !== -1) pages[existingIdx] = page;
else pages.push(page);
writeFileSync(pagesJsonPath, JSON.stringify(pages, null, 2));
console.log(`✅ Seeded: "${page.title}"`);
console.log(`   ID     : ${pageId}`);
console.log(`   Blocks : ${page.blocks.length}`);
console.log(`   Path   : ${pagesJsonPath}`);

// ── SQLite sync ───────────────────────────────────────────────────────────────
try {
  if (!Database) throw new Error('better-sqlite3 not available');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source_filename TEXT,
    content_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);
  const contentJson = JSON.stringify(page);
  db.prepare(`
    INSERT INTO pages (id, title, source_filename, content_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title, source_filename=excluded.source_filename,
      content_json=excluded.content_json, updated_at=excluded.updated_at
  `).run(page.id, page.title, page.sourceFilename, contentJson, page.createdAt, page.updatedAt);
  db.close();
  console.log(`✅ Also seeded into SQLite: ${dbPath}`);
} catch (e) {
  console.warn('⚠ SQLite sync skipped:', e.message);
}

import('./seed-page-2.mjs').catch(e => console.error('Failed to run side seed', e));
