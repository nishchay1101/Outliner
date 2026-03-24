import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import Database from 'better-sqlite3';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DB_PATH ? dirname(process.env.DB_PATH) : join(__dirname, '../data');
const dbPath  = process.env.DB_PATH || join(dataDir, 'pages.db');

if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const now    = new Date().toISOString();
const pageId = 'sliding-window-mastery-lecture-2';

// ─── Block helpers ─────────────────────────────────────────────────────────
const raw = (html, order) => ({ id: randomUUID(), type: 'rawHtml', order, data: { html } });

// ─── BLOCKS ────────────────────────────────────────────────────────────────
let ord = 0;
const blocks = [

  // HERO
  { id: randomUUID(), type: 'hero', order: ord++, data: {
    title:    'Lecture 2 — Sliding Window Mastery',
    subtitle: 'Master fixed and variable windows, deque patterns, the atMost(K) trick, and Kadane\'s Algorithm.',
    badges:   ['DSA Mastery Series'],
    metaChips: [
      { label: '⏱', value: '2 Hours' },
      { label: '📋', value: '7 Problems' },
      { label: '🎯', value: 'Fixed Window · Variable Window · Circular · Kadane\'s' }
    ]
  }},

  // TIMELINE
  { id: randomUUID(), type: 'timeline', order: ord++, data: {
    segments: [
      { time: '0–5 min',     label: 'Recap',           active: true  },
      { time: '5–35 min',    label: 'Fixed Window',     active: false },
      { time: '35–85 min',   label: 'Variable Window',  active: false },
      { time: '85–110 min',  label: 'Advanced',         active: false },
      { time: '110–120 min', label: 'Wrap-Up',          active: false },
    ]
  }},

  // PROBLEM STRIP
  raw(`
  <div class="problem-strip">
    <div class="strip-label">All Problems Covered Today</div>
    <div class="problem-tags">
      <span class="ptag fixed">Max Sum Subarray of K</span>
      <span class="ptag fixed">First Negative in Window K</span>
      <span class="ptag var">Longest Substring No Repeat</span>
      <span class="ptag var">Min Size Subarray Sum</span>
      <span class="ptag var">Subarrays K Different Integers</span>
      <span class="ptag adv">Min Swaps Group 1s (Circular)</span>
      <span class="ptag adv">Maximum Subarray (Kadane's)</span>
    </div>
  </div>`, ord++),

  // SEGMENT 0 — RECAP
  raw(`
  <div class="segment">
    <div class="segment-header">
      <div class="time-block blue">⏱ 0 – 5 min</div>
      <div class="segment-title">Recap — Two Pointer vs Sliding Window</div>
      <div class="segment-line"></div>
    </div>
    <div class="two-col">
      <div class="intro-card">
        <div class="card-label">Bridge From Last Lecture</div>
        <div class="question-bubble">"Last time we moved two pointers. What if they always stay a fixed distance apart?"</div>
        <p class="teach-note">
          That distance is the <em>window</em>. Instead of thinking "left pointer + right pointer", think "<em>a contiguous chunk of the array that slides forward</em>".<br><br>
          Sliding window = two pointer's specialized form — but we track a <em>window state</em> (sum, set, map) as we move.
        </p>
      </div>
      <div class="intro-card">
        <div class="card-label">Two Pointer vs Sliding Window — When to Use What</div>
        <table class="cmp-table">
          <thead><tr><th>Signal</th><th class="hl">Two Pointer</th><th class="hl3">Sliding Window</th></tr></thead>
          <tbody>
            <tr><td>Array shape</td><td>Sorted / in-place</td><td>Any (usually unsorted)</td></tr>
            <tr><td>Goal</td><td>Find a pair/triple</td><td>Subarray/substring</td></tr>
            <tr><td>Movement</td><td>Converge or same-dir</td><td>Always left → right</td></tr>
            <tr><td>State</td><td>Usually none</td><td>Sum / set / map</td></tr>
            <tr><td>Key question</td><td>Which pointer moves?</td><td>When to shrink window?</td></tr>
          </tbody>
        </table>
        <ul class="rule-list" style="margin-top:10px">
          <li><span class="rule-arrow">→</span><span><strong>Subarray / substring</strong> problem? → Sliding window.</span></li>
          <li><span class="rule-arrow">→</span><span>Says "of size K" or "at most K" or "longest"? → Window.</span></li>
        </ul>
      </div>
    </div>
  </div>`, ord++),

  // DIVIDER
  { id: randomUUID(), type: 'divider', order: ord++, data: { style: 'gradient' } },

  // SEGMENT 1 — FIXED SIZE
  raw(`
  <div class="segment">
    <div class="segment-header">
      <div class="time-block blue">⏱ 5 – 35 min</div>
      <div class="segment-title">Sliding Window — Fixed Size</div>
      <div class="segment-line"></div>
    </div>

    <div class="tip-card">
      <div class="tip-label">Teacher Framing</div>
      <p>Say: <em>"Fixed window problems give you K. The window is always exactly K elements wide. The trick: instead of recomputing the window from scratch each step, we <strong>subtract what leaves on the left and add what enters on the right</strong>. One operation per step instead of K."</em><br><br>Draw on board: [a b c | d e f] → slide → [b c d | e f g]. The | marks the window boundary moving forward.</p>
    </div>

    <!-- P1 -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P1</span>
        <span class="pc-title">Max Sum Subarray of Size K</span>
        <span class="pc-time">15 min</span>
        <a href="https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1" target="_blank" class="pc-link">↗ GFG</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">Brute → Optimal Journey</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Brute O(n·k):</strong> For every starting index i, sum from i to i+k-1. Show this re-sums overlapping elements every time — waste.</div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Key insight:</strong> When the window slides right by 1, only <em>one element leaves</em> (index i-1) and <em>one enters</em> (index i+k-1). The sum update is O(1).</div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Algorithm:</strong> Compute sum of first K elements as the initial window. Then loop from K to n-1: <code>windowSum += arr[i] - arr[i-K]</code>. Track max.</div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Ask students:</strong> <em>"What changes between any two consecutive windows?"</em> → Always exactly 1 element in, 1 element out.</div></div>
          <div class="algo-box" style="margin-top:10px">
            <span class="ln"><span class="cm">// Build first window</span></span>
            <span class="ln"><span class="var">wSum</span> = sum(arr[0..K-1])</span>
            <span class="ln"><span class="var">maxSum</span> = <span class="var">wSum</span></span>
            <span class="ln"><span class="kw">for</span> i = K → n-1:</span>
            <span class="i1"><span class="var">wSum</span> += arr[i] - arr[i-K]  <span class="cm">// slide</span></span>
            <span class="i1"><span class="var">maxSum</span> = max(<span class="var">maxSum</span>, <span class="var">wSum</span>)</span>
          </div>
          <div class="complexity-row" style="margin-top:8px">
            <div class="cx-chip bad">O(n·k) brute</div>
            <div class="cx-chip time">O(n) optimal</div>
            <div class="cx-chip space">O(1) space</div>
          </div>
        </div>
        <div class="pc-section">
          <div class="pc-section-label">Window Slide Visual — arr=[2,1,5,1,3,2], K=3</div>
          <div class="win-visual">
            <div class="arr-label">Step 1 — Initial window (sum=8)</div>
            <div class="arr-row">
              <div class="arr-cell winL">2</div><div class="arr-cell win">1</div><div class="arr-cell winR">5</div>
              <div class="arr-cell out">1</div><div class="arr-cell out">3</div><div class="arr-cell out">2</div>
            </div>
            <div class="arr-label">Step 2 — Slide: -arr[0]=2, +arr[3]=1 → sum=7</div>
            <div class="arr-row">
              <div class="arr-cell out">2</div><div class="arr-cell winL">1</div><div class="arr-cell win">5</div>
              <div class="arr-cell winR">1</div><div class="arr-cell out">3</div><div class="arr-cell out">2</div>
            </div>
            <div class="arr-label">Step 3 — Slide: -arr[1]=1, +arr[4]=3 → sum=9 ← MAX</div>
            <div class="arr-row">
              <div class="arr-cell out">2</div><div class="arr-cell out">1</div><div class="arr-cell winL">5</div>
              <div class="arr-cell win">1</div><div class="arr-cell winR max">3</div><div class="arr-cell out">2</div>
            </div>
            <div class="arr-label">Step 4 — Slide: -arr[2]=5, +arr[5]=2 → sum=6</div>
            <div class="arr-row">
              <div class="arr-cell out">2</div><div class="arr-cell out">1</div><div class="arr-cell out">5</div>
              <div class="arr-cell winL">1</div><div class="arr-cell win">3</div><div class="arr-cell winR">2</div>
            </div>
          </div>
          <div class="insight-box">Each step costs O(1). The window "remembers" the previous sum — no recomputation.</div>
        </div>
      </div>
    </div>

    <!-- P2 -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P2</span>
        <span class="pc-title">First Negative in Every Window of Size K</span>
        <span class="pc-time">20 min</span>
        <a href="https://www.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1" target="_blank" class="pc-link">↗ GFG</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">Why Sum Doesn't Work Here</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Problem reframe:</strong> For each window of size K, output the first negative number. If none, output 0.</div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Can't just track a sum:</strong> We need the <em>actual first negative element</em>, not a sum. The "first" part means order matters — we need a structure that respects insertion order.</div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Introduce Deque:</strong> A queue that only stores <em>indices of negative numbers</em> within the current window. Front of deque = first negative in current window.</div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Two operations as window slides:</strong><br/>
            (a) <strong>Add:</strong> If arr[r] &lt; 0, push index r to back of deque.<br/>
            (b) <strong>Remove:</strong> If deque front index ≤ r-K (out of window), pop front.
          </div></div>
          <div class="step-row"><div class="step-num">5</div><div class="step-text">Answer for each window: <code>deque.empty() ? 0 : arr[deque.front()]</code></div></div>
          <div class="algo-box" style="margin-top:8px">
            <span class="ln"><span class="var">dq</span> = empty deque  <span class="cm">// stores indices of negatives</span></span>
            <span class="ln"><span class="cm">// Fill first window</span></span>
            <span class="ln"><span class="kw">for</span> i=0 → K-1:</span>
            <span class="i1"><span class="kw">if</span> arr[i] &lt; 0: dq.push_back(i)</span>
            <span class="ln"><span class="cm">// Slide window</span></span>
            <span class="ln"><span class="kw">for</span> r=K → n-1:</span>
            <span class="i1">output: dq.empty() ? 0 : arr[dq.front()]</span>
            <span class="i1"><span class="kw">if</span> arr[r] &lt; 0: dq.push_back(r)</span>
            <span class="i1"><span class="kw">if</span> dq.front() ≤ r-K: dq.pop_front()</span>
            <span class="ln">output last window answer</span>
          </div>
        </div>
        <div class="pc-section">
          <div class="pc-section-label">Dry Run — [-8, 2, 3, -6, 10], K=2</div>
          <div class="dry-run">
            <table>
              <thead><tr><th>Window</th><th>Elements</th><th>Deque (indices)</th><th>Answer</th></tr></thead>
              <tbody>
                <tr><td>[0,1]</td><td class="hlr">-8</td><td class="hl">[0]</td><td class="hlr">-8</td></tr>
                <tr><td>[1,2]</td><td>2, 3</td><td class="hl">[0→evicted, empty]</td><td>0</td></tr>
                <tr><td>[2,3]</td><td class="hlr">3, -6</td><td class="hl">[3]</td><td class="hlr">-6</td></tr>
                <tr><td>[3,4]</td><td class="hlr">-6</td><td class="hl">[3]</td><td class="hlr">-6</td></tr>
              </tbody>
            </table>
          </div>
          <div class="warn-box" style="margin-top:8px">⚠️ The deque eviction check <code>front ≤ r-K</code> (not r-K+1) — double-check the boundary. Common off-by-one error here.</div>
          <div class="insight-box">The deque pattern is reused in harder problems: Sliding Window Maximum (LC 239). Learn the pattern here!</div>
          <div class="complexity-row" style="margin-top:8px">
            <div class="cx-chip time">O(n) time</div>
            <div class="cx-chip space">O(K) deque</div>
          </div>
        </div>
      </div>
    </div>
  </div>`, ord++),

  // DIVIDER
  { id: randomUUID(), type: 'divider', order: ord++, data: { style: 'gradient' } },

  // SEGMENT 2 — VARIABLE SIZE
  raw(`
  <div class="segment">
    <div class="segment-header">
      <div class="time-block green">⏱ 35 – 85 min</div>
      <div class="segment-title">Sliding Window — Variable Size</div>
      <div class="segment-line"></div>
    </div>

    <!-- TEMPLATE -->
    <div class="template-card">
      <div class="tpl-label">The Universal Variable Window Template — Memorize This</div>
      <div class="tpl-grid">
        <div class="algo-box" style="border-color: rgba(196,92,244,0.2); background: rgba(196,92,244,0.03);">
          <span class="ln"><span class="var">l</span> = 0, <span class="var">state</span> = {} <span class="cm">// track window</span></span>
          <span class="ln"><span class="kw">for</span> <span class="var">r</span> <span class="kw">in</span> range(n):</span>
          <span class="i1"><span class="cm">// 1. Expand: add arr[r] to state</span></span>
          <span class="i1"><span class="var">state</span>.add(arr[r])</span>
          <span class="i1"><span class="cm">// 2. Shrink: while constraint breaks</span></span>
          <span class="i1"><span class="kw">while</span> invalid(<span class="var">state</span>):</span>
          <span class="i2"><span class="var">state</span>.remove(arr[<span class="var">l</span>])</span>
          <span class="i2"><span class="var">l</span>++</span>
          <span class="i1"><span class="cm">// 3. Record: window [l..r] is valid</span></span>
          <span class="i1">update_answer(r - <span class="var">l</span> + 1)</span>
        </div>
        <div>
          <div class="pc-section-label" style="margin-bottom:8px">The Three Parts — Always Present</div>
          <ul class="rule-list">
            <li><span class="rule-arrow" style="color:var(--accent)">①</span><span><strong>Expand right:</strong> r always moves forward — we grow the window by including arr[r].</span></li>
            <li><span class="rule-arrow" style="color:var(--accent2)">②</span><span><strong>Shrink left:</strong> When the window violates the constraint, keep moving l forward until it's valid again.</span></li>
            <li><span class="rule-arrow" style="color:var(--accent3)">③</span><span><strong>Record:</strong> After shrinking, [l..r] is the largest valid window ending at r. Update your answer.</span></li>
          </ul>
        </div>
      </div>
      <p class="tpl-note">The only thing that changes problem-to-problem: <strong>what "state" you track</strong> (sum, set, hashmap) and <strong>what "invalid" means</strong> (sum ≥ target, duplicate found, more than K distinct). The loop structure never changes.</p>
    </div>

    <div class="tip-card">
      <div class="tip-label">Teacher Framing</div>
      <p>Say: <em>"Fixed window: you know the size. Variable window: you don't — you grow until you break a rule, then shrink from the left until you're valid again. The right pointer never goes backward. The left pointer only moves forward. Together they never exceed O(n) total moves — so the whole thing is O(n)."</em></p>
    </div>

    <!-- P3 -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P3</span>
        <span class="pc-title">Longest Substring Without Repeating Characters</span>
        <span class="pc-time">20 min</span>
        <a href="https://leetcode.com/problems/longest-substring-without-repeating-characters/description/" target="_blank" class="pc-link">↗ LeetCode 3</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">Mapping to the Template</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>State:</strong> A HashSet of characters currently in the window. "State" = which characters are inside.</div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Expand:</strong> Add <code>s[r]</code> to the set.</div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Invalid condition:</strong> <code>s[r]</code> is already in the set (duplicate found).</div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Shrink:</strong> Remove <code>s[l]</code> from set, l++. Repeat until the duplicate is gone.</div></div>
          <div class="step-row"><div class="step-num">5</div><div class="step-text"><strong>Record:</strong> <code>maxLen = max(maxLen, r-l+1)</code> after each valid expansion.</div></div>
          <div class="algo-box" style="margin-top:8px">
            <span class="ln"><span class="var">seen</span> = HashSet, <span class="var">l</span>=0, <span class="var">max</span>=0</span>
            <span class="ln"><span class="kw">for</span> <span class="var">r</span>=0 → n-1:</span>
            <span class="i1"><span class="kw">while</span> s[r] <span class="kw">in</span> <span class="var">seen</span>:</span>
            <span class="i2"><span class="var">seen</span>.remove(s[<span class="var">l</span>]); <span class="var">l</span>++</span>
            <span class="i1"><span class="var">seen</span>.add(s[<span class="var">r</span>])</span>
            <span class="i1"><span class="var">max</span> = max(<span class="var">max</span>, r-l+1)</span>
          </div>
          <div class="complexity-row" style="margin-top:8px">
            <div class="cx-chip time">O(n) time</div>
            <div class="cx-chip space">O(min(n,alphabet)) set</div>
          </div>
        </div>
        <div class="pc-section">
          <div class="pc-section-label">Dry Run — "abcabcbb"</div>
          <div class="win-visual">
            <div class="arr-label">r=3 (char='a') — duplicate! Shrink until 'a' removed</div>
            <div class="arr-row">
              <div class="arr-cell dup">a</div>
              <div class="arr-cell win">b</div>
              <div class="arr-cell win">c</div>
              <div class="arr-cell winR dup">a</div>
              <div class="arr-cell out">b</div><div class="arr-cell out">c</div><div class="arr-cell out">b</div><div class="arr-cell out">b</div>
            </div>
            <div class="arr-label">After shrink: l moves to 1, set={b,c,a}, window=3</div>
          </div>
          <div class="dry-run" style="margin-top:8px">
            <table>
              <thead><tr><th>r</th><th>s[r]</th><th>action</th><th>l</th><th>window</th><th>maxLen</th></tr></thead>
              <tbody>
                <tr><td>0</td><td>a</td><td>add</td><td>0</td><td>a</td><td class="hl3">1</td></tr>
                <tr><td>1</td><td>b</td><td>add</td><td>0</td><td>ab</td><td class="hl3">2</td></tr>
                <tr><td>2</td><td>c</td><td>add</td><td>0</td><td>abc</td><td class="hl3">3</td></tr>
                <tr><td>3</td><td class="hlr">a</td><td>dup! remove s[0]=a, l=1</td><td>1</td><td>bca</td><td class="hl3">3</td></tr>
                <tr><td>4</td><td class="hlr">b</td><td>dup! remove s[1]=b, l=2</td><td>2</td><td>cab</td><td class="hl3">3</td></tr>
                <tr><td>5</td><td class="hlr">c</td><td>dup! remove s[2]=c, l=3</td><td>3</td><td>abc</td><td class="hl3">3</td></tr>
                <tr><td>6</td><td class="hlr">b</td><td>dup! remove s[3]=a, l=4</td><td>4</td><td>cb</td><td class="hl3">3</td></tr>
                <tr><td>7</td><td class="hlr">b</td><td>dup! remove s[4]=b, l=6</td><td>6</td><td>b</td><td class="hl3">3</td></tr>
              </tbody>
            </table>
          </div>
          <div class="insight-box">Optimization: Use a HashMap{char → index} instead of HashSet. Jump l directly to duplicate's index + 1 instead of removing one-by-one.</div>
        </div>
      </div>
    </div>

    <!-- P4 -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P4</span>
        <span class="pc-title">Minimum Size Subarray Sum</span>
        <span class="pc-time">20 min</span>
        <a href="https://leetcode.com/problems/minimum-size-subarray-sum/description/" target="_blank" class="pc-link">↗ LeetCode 209</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">The Shrinking Window Pattern</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Contrast with P3:</strong> In P3 we tracked a <em>maximum</em> (longest valid window). Here we want a <em>minimum</em> (shortest window meeting the condition). The shrink/grow logic flips perspective.</div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>State:</strong> Running sum of the window. <strong>Condition met when:</strong> <code>sum ≥ target</code>.</div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Key twist:</strong> When the condition IS met (not broken), shrink aggressively from the left. Record answer, then keep shrinking to find an even smaller valid window.</div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Ask students:</strong> <em>"Why can we safely shrink when condition is met?"</em> — Because we've already recorded the current window length. Any smaller window that still satisfies is better.</div></div>
          <div class="algo-box" style="margin-top:8px">
            <span class="ln"><span class="var">l</span>=0, <span class="var">wSum</span>=0, <span class="var">minLen</span>=∞</span>
            <span class="ln"><span class="kw">for</span> <span class="var">r</span>=0 → n-1:</span>
            <span class="i1"><span class="var">wSum</span> += arr[r]  <span class="cm">// expand</span></span>
            <span class="i1"><span class="kw">while</span> <span class="var">wSum</span> ≥ target:  <span class="cm">// condition met → shrink</span></span>
            <span class="i2"><span class="var">minLen</span> = min(<span class="var">minLen</span>, r-l+1)</span>
            <span class="i2"><span class="var">wSum</span> -= arr[l]; <span class="var">l</span>++</span>
            <span class="ln"><span class="kw">return</span> minLen == ∞ ? 0 : minLen</span>
          </div>
          <div class="complexity-row" style="margin-top:8px">
            <div class="cx-chip time">O(n) time</div>
            <div class="cx-chip space">O(1) space</div>
          </div>
        </div>
        <div class="pc-section">
          <div class="pc-section-label">Dry Run — arr=[2,3,1,2,4,3], target=7</div>
          <div class="dry-run">
            <table>
              <thead><tr><th>r</th><th>arr[r]</th><th>wSum</th><th>≥7?</th><th>action</th><th>minLen</th></tr></thead>
              <tbody>
                <tr><td>0</td><td>2</td><td>2</td><td>—</td><td>expand</td><td>∞</td></tr>
                <tr><td>1</td><td>3</td><td>5</td><td>—</td><td>expand</td><td>∞</td></tr>
                <tr><td>2</td><td>1</td><td>6</td><td>—</td><td>expand</td><td>∞</td></tr>
                <tr><td>3</td><td>2</td><td>8</td><td class="hl3">Yes</td><td>record 4, shrink: -2→wSum=6, l=1</td><td class="hl3">4</td></tr>
                <tr><td>4</td><td>4</td><td>10</td><td class="hl3">Yes</td><td>record 4, shrink: -3→wSum=7 still≥7, record 3, shrink: -1→wSum=6, l=3</td><td class="hl3">3</td></tr>
                <tr><td>5</td><td>3</td><td>9</td><td class="hl3">Yes</td><td>record 3, shrink: -2→7 still≥7, record 2, shrink: -4→6, l=5</td><td class="hl3">2</td></tr>
              </tbody>
            </table>
          </div>
          <div class="insight-box">Answer = 2 (subarray [4,3]). Notice how we kept shrinking even after finding a valid window — that's what gives us the minimum.</div>
        </div>
      </div>
    </div>

    <!-- P5 -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P5</span>
        <span class="pc-title">Subarrays with K Different Integers</span>
        <span class="pc-time">20 min</span>
        <a href="https://leetcode.com/problems/subarrays-with-k-different-integers/description/" target="_blank" class="pc-link">↗ LeetCode 992</a>
      </div>
      <div class="pc-body-wide">
        <div class="pc-section-label">Why This Is Hard — And the Trick</div>
        <div class="cols">
          <div class="pc-section">
            <div class="pc-section-label">The Problem</div>
            <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Direct window doesn't work:</strong> We can't shrink easily because "exactly K distinct" means the window is valid at one size but invalid both when too large and too small. Our template only handles one invalid direction.</div></div>
            <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>The trick:</strong> Convert "exactly K" into two "at most K" problems.<br/><code>exactly(K) = atMost(K) − atMost(K−1)</code></div></div>
            <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Why this works:</strong> atMost(K) counts all subarrays with ≤ K distinct. Subtracting atMost(K-1) removes those with ≤ K-1 distinct. What remains: exactly K distinct.</div></div>
          </div>
          <div class="pc-section">
            <div class="pc-section-label">atMost(K) Function</div>
            <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>State:</strong> HashMap{element → count} tracking frequency in window.</div></div>
            <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Expand:</strong> Add arr[r] to map, increment count.</div></div>
            <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Invalid:</strong> map.size() &gt; K (more than K distinct). Shrink: decrement arr[l] count; if count reaches 0, delete from map. l++.</div></div>
            <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Count:</strong> Every valid window [l..r] contributes <code>(r - l + 1)</code> subarrays.</div></div>
          </div>
          <div class="pc-section">
            <div class="pc-section-label">Algorithm</div>
            <div class="algo-box">
              <span class="ln"><span class="fn">atMost</span>(K):</span>
              <span class="i1"><span class="var">freq</span>={}, <span class="var">l</span>=0, <span class="var">cnt</span>=0</span>
              <span class="i1"><span class="kw">for</span> r=0 → n-1:</span>
              <span class="i2">freq[arr[r]]++</span>
              <span class="i2"><span class="kw">while</span> freq.size() &gt; K:</span>
              <span class="i3">freq[arr[l]]--</span>
              <span class="i3"><span class="kw">if</span> freq[arr[l]]==0: del freq[arr[l]]</span>
              <span class="i3">l++</span>
              <span class="i2">cnt += (r - l + 1)</span>
              <span class="i1"><span class="kw">return</span> cnt</span>
              <span class="ln"> </span>
              <span class="ln"><span class="kw">return</span> <span class="fn">atMost</span>(K) - <span class="fn">atMost</span>(K-1)</span>
            </div>
            <div class="trick-badge">★ atMost(K) − atMost(K−1) trick</div>
            <div class="insight-box" style="margin-top:8px">This exact pattern appears in LC 904 (Fruit Into Baskets) and LC 1358. Once you see "exactly K", reach for this decomposition immediately.</div>
          </div>
        </div>
        <div class="complexity-row">
          <div class="cx-chip time">O(n) — two passes of atMost</div>
          <div class="cx-chip space">O(K) hashmap</div>
        </div>
      </div>
    </div>
  </div>`, ord++),

  // DIVIDER
  { id: randomUUID(), type: 'divider', order: ord++, data: { style: 'gradient' } },

  // SEGMENT 3 — ADVANCED
  raw(`
  <div class="segment">
    <div class="segment-header">
      <div class="time-block purple">⏱ 85 – 110 min</div>
      <div class="segment-title">Advanced Sliding Window</div>
      <div class="segment-line"></div>
    </div>

    <div class="tip-card" style="border-color:rgba(196,92,244,0.2); background:rgba(196,92,244,0.04);">
      <div class="tip-label" style="color:var(--accent4)">Teacher Framing</div>
      <p>Say: <em>"Two extensions now: circular arrays (the array wraps around) and Kadane's (which looks like sliding window but isn't quite). These test whether you truly understand the pattern or just memorized it."</em></p>
    </div>

    <!-- P6 -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P6</span>
        <span class="pc-title">Minimum Swaps to Group All 1's Together II</span>
        <span class="pc-time">15 min</span>
        <a href="https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/description/" target="_blank" class="pc-link">↗ LeetCode 2134</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">Circular Array + Fixed Window</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Key observation:</strong> Count total 1s = K. The answer is a window of size K that already has the most 1s — the 0s inside it must be swapped out.</div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Min swaps = K − (max 1s in any window of size K).</strong> Because each 0 inside the optimal window needs one swap.</div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text"><strong>Circular handling:</strong> Array wraps around — a window can start near the end and wrap to the front. Use <code>arr[i % n]</code> and iterate i from 0 to 2n-1 with a window of K.</div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Alternative:</strong> Duplicate the array: concat arr with itself → standard fixed window on the doubled array. Simpler to code.</div></div>
          <div class="algo-box" style="margin-top:8px">
            <span class="ln"><span class="var">K</span> = count of 1s in arr</span>
            <span class="ln"><span class="cm">// Count 1s in first window</span></span>
            <span class="ln"><span class="var">ones</span> = sum(arr[0..K-1])</span>
            <span class="ln"><span class="var">maxOnes</span> = <span class="var">ones</span></span>
            <span class="ln"><span class="kw">for</span> i=K → 2n-1:  <span class="cm">// circular via % n</span></span>
            <span class="i1"><span class="var">ones</span> += arr[i%n] - arr[(i-K)%n]</span>
            <span class="i1"><span class="var">maxOnes</span> = max(<span class="var">maxOnes</span>, <span class="var">ones</span>)</span>
            <span class="ln"><span class="kw">return</span> K - <span class="var">maxOnes</span></span>
          </div>
          <div class="complexity-row" style="margin-top:8px">
            <div class="cx-chip time">O(n) time</div>
            <div class="cx-chip space">O(1) space</div>
          </div>
        </div>
        <div class="pc-section">
          <div class="pc-section-label">Visual — [0,1,0,1,1,0,0], K=3</div>
          <div class="win-visual">
            <div class="arr-label">K=3 (three 1s total). Find window of size 3 with most 1s.</div>
            <div class="arr-row" style="margin-top:6px">
              <span class="arr-label">arr:</span>
              <div class="arr-cell">0</div><div class="arr-cell">1</div><div class="arr-cell">0</div>
              <div class="arr-cell">1</div><div class="arr-cell">1</div><div class="arr-cell">0</div><div class="arr-cell">0</div>
            </div>
            <div class="arr-row">
              <span class="arr-label">w1:</span>
              <div class="arr-cell winL">0</div><div class="arr-cell win">1</div><div class="arr-cell winR">0</div>
              <div class="arr-cell out">1</div><div class="arr-cell out">1</div><div class="arr-cell out">0</div><div class="arr-cell out">0</div>
            </div>
            <div style="font-size:11px; color:var(--muted); margin:4px 0">→ 1 one → 2 swaps needed</div>
            <div class="arr-row">
              <span class="arr-label">w3:</span>
              <div class="arr-cell out">0</div><div class="arr-cell out">1</div><div class="arr-cell out">0</div>
              <div class="arr-cell winL">1</div><div class="arr-cell win max">1</div><div class="arr-cell winR">0</div><div class="arr-cell out">0</div>
            </div>
            <div style="font-size:11px; color:var(--accent3); margin:4px 0">→ 2 ones → only 1 swap needed ← BEST</div>
          </div>
          <div class="insight-box">Answer = K − maxOnes = 3 − 2 = 1. The circular window never needs a new data structure — just modular indexing.</div>
        </div>
      </div>
    </div>

    <!-- P7 -->
    <div class="problem-card">
      <div class="pc-header">
        <span class="pc-num">P7</span>
        <span class="pc-title">Maximum Subarray — Kadane's Algorithm</span>
        <span class="pc-time">10 min</span>
        <a href="https://leetcode.com/problems/maximum-subarray/description/" target="_blank" class="pc-link">↗ LeetCode 53</a>
      </div>
      <div class="pc-body">
        <div class="pc-section">
          <div class="pc-section-label">Is This Sliding Window?</div>
          <div class="step-row"><div class="step-num">1</div><div class="step-text"><strong>Why sliding window fails:</strong> We want max subarray sum — but the array can have negatives. Sliding window needs a clear condition to shrink. Here there's no such rule because a negative might still be part of the optimal answer.</div></div>
          <div class="step-row"><div class="step-num">2</div><div class="step-text"><strong>Kadane's key insight:</strong> At each position, decide: <em>extend the current subarray or start fresh?</em> If the running sum goes negative, it's a dead weight — start over from the current element.</div></div>
          <div class="step-row"><div class="step-num">3</div><div class="step-text"><code>curr = max(arr[i], curr + arr[i])</code> — one line captures it all. If curr + arr[i] &lt; arr[i], the current subarray is a liability; reset.</div></div>
          <div class="step-row"><div class="step-num">4</div><div class="step-text"><strong>Relate to sliding window:</strong> Think of it as a variable window where l implicitly jumps to r whenever the running sum goes negative.</div></div>
          <div class="algo-box" style="margin-top:8px">
            <span class="ln"><span class="var">curr</span> = arr[0], <span class="var">maxSum</span> = arr[0]</span>
            <span class="ln"><span class="kw">for</span> i=1 → n-1:</span>
            <span class="i1"><span class="var">curr</span> = max(arr[i], <span class="var">curr</span> + arr[i])</span>
            <span class="i1"><span class="cm">// if curr+arr[i] &lt; arr[i] → reset to arr[i]</span></span>
            <span class="i1"><span class="var">maxSum</span> = max(<span class="var">maxSum</span>, <span class="var">curr</span>)</span>
          </div>
          <div class="complexity-row" style="margin-top:8px">
            <div class="cx-chip time">O(n) one pass</div>
            <div class="cx-chip space">O(1) space</div>
          </div>
        </div>
        <div class="pc-section">
          <div class="pc-section-label">Dry Run — [-2,1,-3,4,-1,2,1,-5,4]</div>
          <div class="dry-run">
            <table>
              <thead><tr><th>i</th><th>arr[i]</th><th>curr+arr[i]</th><th>max(arr[i],curr+arr[i])</th><th>maxSum</th></tr></thead>
              <tbody>
                <tr><td>0</td><td class="hlr">-2</td><td>—</td><td class="hlr">-2</td><td>-2</td></tr>
                <tr><td>1</td><td>1</td><td>-1</td><td class="hl3">1 ← reset</td><td>1</td></tr>
                <tr><td>2</td><td class="hlr">-3</td><td>-2</td><td class="hlr">-2</td><td>1</td></tr>
                <tr><td>3</td><td>4</td><td>2</td><td class="hl3">4 ← reset</td><td>4</td></tr>
                <tr><td>4</td><td class="hlr">-1</td><td>3</td><td>3</td><td>4</td></tr>
                <tr><td>5</td><td>2</td><td>5</td><td>5</td><td>5</td></tr>
                <tr><td>6</td><td>1</td><td>6</td><td class="hl">6</td><td class="hl3">6 ← final max</td></tr>
                <tr><td>7</td><td class="hlr">-5</td><td>1</td><td>1</td><td>6</td></tr>
                <tr><td>8</td><td>4</td><td>5</td><td>5</td><td>6</td></tr>
              </tbody>
            </table>
          </div>
          <div class="warn-box" style="margin-top:8px">⚠️ All-negative array edge case: answer is the least negative element (not 0). Never initialize maxSum=0 unless the problem guarantees positives.</div>
        </div>
      </div>
    </div>
  </div>`, ord++),

  // DIVIDER
  { id: randomUUID(), type: 'divider', order: ord++, data: { style: 'gradient' } },

  // SEGMENT 4 — WRAP-UP
  raw(`
  <div class="segment">
    <div class="segment-header">
      <div class="time-block blue">⏱ 110 – 120 min</div>
      <div class="segment-title">Final Wrap-Up</div>
      <div class="segment-line"></div>
    </div>

    <div class="wrapup-grid">
      <div class="wrapup-card">
        <div class="wc-title"><div class="wc-icon">?</div> Ask Students These</div>
        <ul class="check-list">
          <li><strong>Fixed vs variable window?</strong> Fixed: problem gives you K. Variable: window grows until it breaks a rule, then shrinks from left until valid.</li>
          <li><strong>When do we shrink?</strong> When the window state violates the constraint. For max problems: when condition is met. For min problems: when condition breaks.</li>
          <li><strong>How to identify the constraint?</strong> What property of the window are we checking? → That becomes the shrink condition.</li>
          <li><strong>Why is sliding window O(n) even with a while loop inside?</strong> Because l only ever moves forward. Total l increments ≤ n. r also moves at most n times. Total work = O(2n) = O(n).</li>
        </ul>
      </div>
      <div class="wrapup-card">
        <div class="wc-title"><div class="wc-icon">✓</div> Today's Key Takeaways</div>
        <ul class="check-list">
          <li>Fixed window: slide by removing left element, adding right — O(1) per step</li>
          <li>Deque pattern: store indices of relevant elements; evict when index falls outside window</li>
          <li>Variable window template: expand right always, shrink left when constraint breaks</li>
          <li>State tracking: HashSet for uniqueness, HashMap for counts, running sum for totals</li>
          <li>exactly(K) = atMost(K) − atMost(K−1) is a powerful decomposition trick</li>
          <li>Circular arrays: use i % n and extend loop to 2n to cover wrap-arounds</li>
          <li>Kadane's is conceptually related to sliding window — reset when running sum turns negative</li>
        </ul>
      </div>
    </div>

    <div class="exercise-card">
      <div class="ex-title">⚡ Mini Exercise + Homework</div>
      <div class="ex-item"><div class="ex-badge">EX 1</div><span><strong>Sliding Window Maximum (LC 239):</strong> Apply the deque pattern from P2 — but now keep a decreasing deque of indices. The deque front is always the maximum of the current window.</span></div>
      <div class="ex-item"><div class="ex-badge">EX 2</div><span><strong>Fruit Into Baskets (LC 904):</strong> Directly maps to atMost(2) from P5. "Two basket types" = "at most 2 distinct". Count the longest subarray with ≤ 2 distinct elements.</span></div>
      <div class="ex-item"><div class="ex-badge">EX 3</div><span><strong>Permutation in String (LC 567):</strong> Fixed window of size len(p). Use a frequency count comparison. At each step, add right char freq, remove left char freq, check if window freq matches target freq.</span></div>
      <div class="ex-item"><div class="ex-badge">EX 4</div><span><strong>Kadane's 2D (Max Sum Rectangle):</strong> Apply Kadane's to each row prefix-sum for a given pair of columns. Converts 2D max-subarray to O(n²·m). Advanced — try if time permits.</span></div>
      <div class="ex-item"><div class="ex-badge">HW</div><span><strong>Next lecture preview — Prefix Sums + Hashing:</strong> Subarray sum equals K (LC 560), longest subarray with equal 0s and 1s, range sum queries. A natural evolution from today's sliding window state.</span></div>
    </div>
  </div>`, ord++),

];

// ─── Persist ───────────────────────────────────────────────────────────────
const pagesJsonPath = join(dataDir, 'pages.json');
let pages = [];
try {
  const raw = JSON.parse(readFileSync(pagesJsonPath, 'utf8'));
  pages = Array.isArray(raw) ? raw : (raw.pages || Object.values(raw) || []);
} catch {}

const existing = pages.findIndex(p => p.id === pageId);
if (existing !== -1) {
  pages[existing] = { ...pages[existing], ...{ id: pageId, title: "Lecture 2 — Sliding Window Mastery",
    updatedAt: now, sourceFilename: "lecture2_sliding_window.html", blocks } };
} else {
  pages.push({ id: pageId, title: "Lecture 2 — Sliding Window Mastery",
    createdAt: now, updatedAt: now, sourceFilename: "lecture2_sliding_window.html", blocks });
}
writeFileSync(pagesJsonPath, JSON.stringify(pages, null, 2));
console.log('✅ Seeded: "Lecture 2 — Sliding Window Mastery"');

// ─── SQLite sync ───────────────────────────────────────────────────────────
try {
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
  const pageRow = pages.find(p => p.id === pageId);
  const contentJson = JSON.stringify(pageRow);
  db.prepare(`
    INSERT INTO pages (id, title, source_filename, content_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title, source_filename=excluded.source_filename,
      content_json=excluded.content_json, updated_at=excluded.updated_at
  `).run(pageRow.id, pageRow.title, pageRow.sourceFilename, contentJson, pageRow.createdAt, pageRow.updatedAt);
  db.close();
  console.log(`✅ Synced with SQLite: ${dbPath}`);
} catch (e) {
  console.warn('⚠ SQLite sync skipped:', e.message);
}
