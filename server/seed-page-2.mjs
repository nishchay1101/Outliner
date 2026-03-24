import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DB_PATH ? dirname(process.env.DB_PATH) : join(__dirname, '../data');

if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const now = new Date().toISOString();
const pageId = 'sliding-window-mastery-lecture-2';

const page = {
  id: pageId,
  title: "Lecture 2 — Sliding Window Mastery",
  createdAt: now,
  updatedAt: now,
  sourceFilename: "sliding_window_lecture.docx",
  blocks: [
    {
      id: randomUUID(), type: "hero", order: 0,
      data: {
        title: "Lecture 2 — Sliding Window Mastery",
        subtitle: "Master fixed and variable windows, deque patterns, the atMost(K) trick, and Kadane's Algorithm.",
        badges: ["2 Hours", "7 Problems", "Fixed Size", "Variable Size", "Kadane's Algorithm"],
        metaChips: [
          { label: "Duration", value: "2 Hours" },
          { label: "Focus", value: "Fixed Window · Variable Window · Circular · Kadane's" },
          { label: "Problems", value: "LeetCode + GFG" }
        ]
      }
    },
    {
      id: randomUUID(), type: "timeline", order: 1,
      data: {
        segments: [
          { time: "0–5 min",    label: "Recap",                     active: true  },
          { time: "5–35 min",   label: "Fixed Window",              active: false },
          { time: "35–85 min",  label: "Variable Window",           active: false },
          { time: "85–110 min", label: "Advanced",                  active: false },
          { time: "110–120 min",label: "Wrap-Up",                   active: false }
        ]
      }
    },
    {
      id: randomUUID(), type: "table", order: 2,
      data: {
        caption: "All Problems Covered Today",
        headers: ["Problem", "Platform", "Type"],
        rows: [
          ["Max Sum Subarray of K", "GFG", "Fixed"],
          ["First Negative in Window K", "GFG", "Fixed"],
          ["Longest Substring No Repeat", "LeetCode #3", "Variable"],
          ["Min Size Subarray Sum", "LeetCode #209", "Variable"],
          ["Subarrays K Different Integers", "LeetCode #992", "Variable"],
          ["Min Swaps Group 1s (Circular)", "LeetCode #2134", "Advanced"],
          ["Maximum Subarray (Kadane's)", "LeetCode #53", "Advanced"]
        ]
      }
    },
    { id: randomUUID(), type: "divider", order: 3, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 4,
      data: {
        title: "⏱ 0–5 min | Recap — Two Pointer vs Sliding Window",
        content: "Bridge From Last Lecture:\n\"Last time we moved two pointers. What if they always stay a fixed distance apart?\"\nThat distance is the window. Instead of thinking 'left pointer + right pointer', think 'a contiguous chunk of the array that slides forward'.\n\nSliding window = two pointer's specialized form — but we track a window state (sum, set, map) as we move.\n\nTwo Pointer vs Sliding Window:\n→ Subarray / substring problem? → Sliding window.\n→ Says 'of size K' or 'at most K' or 'longest'? → Window.\n→ Array shape: Sorted/in-place (Two Pointer) vs Any/usually unsorted (Sliding Window)\n→ Goal: Find a pair/triple (Two Pointer) vs Subarray/substring (Sliding Window)"
      }
    },
    { id: randomUUID(), type: "divider", order: 5, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 6,
      data: {
        title: "⏱ 5–35 min | Sliding Window — Fixed Size",
        content: "Fixed window problems give you K. The window is always exactly K elements wide. The trick: instead of recomputing the window from scratch each step, we subtract what leaves on the left and add what enters on the right. One operation per step instead of K."
      }
    },
    {
      id: randomUUID(), type: "problem", order: 7,
      data: {
        number: 1,
        title: "Max Sum Subarray of Size K",
        timeMin: 15,
        link: "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1",
        platform: "GFG",
        steps: [
          { num: 1, text: "Brute O(n·k): For every starting index i, sum from i to i+k-1. Show this re-sums overlapping elements every time — waste." },
          { num: 2, text: "Key insight: When the window slides right by 1, only one element leaves (index i-1) and one enters (index i+k-1). The sum update is O(1)." },
          { num: 3, text: "Algorithm: Compute sum of first K elements as the initial window. Then loop from K to n-1: windowSum += arr[i] - arr[i-K]. Track max." },
          { num: 4, text: "Ask students: 'What changes between any two consecutive windows?' → Always exactly 1 element in, 1 element out." }
        ],
        dryRun: [
          {
            headers: ["Step", "Action", "Sum"],
            rows: [
              ["1", "Initial window [2,1,5]", "8"],
              ["2", "Slide: -2, +1", "7"],
              ["3", "Slide: -1, +3", "9 (MAX)"],
              ["4", "Slide: -5, +2", "6"]
            ]
          }
        ],
        insights: ["Each step costs O(1). The window 'remembers' the previous sum — no recomputation."],
        warnings: [],
        complexity: { time: "O(n) optimal", space: "O(1) space" }
      }
    },
    {
      id: randomUUID(), type: "problem", order: 8,
      data: {
        number: 2,
        title: "First Negative in Every Window of Size K",
        timeMin: 20,
        link: "https://www.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1",
        platform: "GFG",
        steps: [
          { num: 1, text: "Problem reframe: For each window of size K, output the first negative number. If none, output 0." },
          { num: 2, text: "Can't just track a sum: We need the actual first negative element, not a sum. The 'first' part means order matters — we need a structure that respects insertion order." },
          { num: 3, text: "Introduce Deque: A queue that only stores indices of negative numbers within the current window. Front of deque = first negative in current window." },
          { num: 4, text: "Two operations as window slides: (a) Add: If arr[r] < 0, push index r to back of deque. (b) Remove: If deque front index ≤ r-K (out of window), pop front." },
          { num: 5, text: "Answer for each window: deque.empty() ? 0 : arr[deque.front()]" }
        ],
        dryRun: [
          {
            headers: ["Window", "Elements", "Deque (indices)", "Answer"],
            rows: [
              ["[0,1]", "-8", "[0]", "-8"],
              ["[1,2]", "2, 3", "[0→evicted, empty]", "0"],
              ["[2,3]", "3, -6", "[3]", "-6"],
              ["[3,4]", "-6", "[3]", "-6"]
            ]
          }
        ],
        insights: ["The deque pattern is reused in harder problems: Sliding Window Maximum (LC 239). Learn the pattern here!"],
        warnings: ["The deque eviction check front ≤ r-K (not r-K+1) — double-check the boundary. Common off-by-one error here."],
        complexity: { time: "O(n) time", space: "O(K) deque space" }
      }
    },
    { id: randomUUID(), type: "divider", order: 9, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 10,
      data: {
        title: "⏱ 35–85 min | Sliding Window — Variable Size",
        content: "The Universal Variable Window Template:\nl = 0, state = {}  // track window\nfor r in range(n):\n    state.add(arr[r])      // Expand\n    while invalid(state):  // Shrink\n        state.remove(arr[l])\n        l++\n    update_answer(r - l + 1)\n\nThe Three Parts:\n1. Expand right: r always moves forward.\n2. Shrink left: When the window violates the constraint, keep moving l forward until it's valid again.\n3. Record: After shrinking, [l..r] is the largest valid window ending at r. Update your answer."
      }
    },
    {
      id: randomUUID(), type: "problem", order: 11,
      data: {
        number: 3,
        title: "Longest Substring Without Repeating Characters",
        timeMin: 20,
        link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/description/",
        platform: "LeetCode 3",
        steps: [
          { num: 1, text: "State: A HashSet of characters currently in the window." },
          { num: 2, text: "Expand: Add s[r] to the set." },
          { num: 3, text: "Invalid condition: s[r] is already in the set (duplicate found)." },
          { num: 4, text: "Shrink: Remove s[l] from set, l++. Repeat until the duplicate is gone." },
          { num: 5, text: "Record: maxLen = max(maxLen, r-l+1) after each valid expansion." }
        ],
        dryRun: [
          {
            headers: ["r", "s[r]", "action", "l", "window", "maxLen"],
            rows: [
              ["0", "a", "add", "0", "a", "1"],
              ["1", "b", "add", "0", "ab", "2"],
              ["2", "c", "add", "0", "abc", "3"],
              ["3", "a", "dup! remove a, l=1", "1", "bca", "3"],
              ["4", "b", "dup! remove b, l=2", "2", "cab", "3"]
            ]
          }
        ],
        insights: ["Optimization: Use a HashMap{char → index} instead of HashSet. Jump l directly to duplicate's index + 1."],
        warnings: [],
        complexity: { time: "O(n) time", space: "O(min(n,charset)) space" }
      }
    },
    {
      id: randomUUID(), type: "problem", order: 12,
      data: {
        number: 4,
        title: "Minimum Size Subarray Sum",
        timeMin: 20,
        link: "https://leetcode.com/problems/minimum-size-subarray-sum/description/",
        platform: "LeetCode 209",
        steps: [
          { num: 1, text: "Contrast with P3: In P3 we tracked a maximum. Here we want a minimum. The shrink/grow logic flips perspective." },
          { num: 2, text: "State: Running sum of the window. Condition met when: sum ≥ target." },
          { num: 3, text: "Key twist: When condition IS met, shrink aggressively from the left. Record answer, then shrink to find smaller valid window." },
          { num: 4, text: "Why can we safely shrink when condition is met? Because any smaller window that still satisfies is better." }
        ],
        dryRun: [],
        insights: ["Keep shrinking even after finding a valid window — that's what gives us the minimum."],
        warnings: [],
        complexity: { time: "O(n) time", space: "O(1) space" }
      }
    },
    {
      id: randomUUID(), type: "problem", order: 13,
      data: {
        number: 5,
        title: "Subarrays with K Different Integers",
        timeMin: 20,
        link: "https://leetcode.com/problems/subarrays-with-k-different-integers/description/",
        platform: "LeetCode 992",
        steps: [
          { num: 1, text: "Direct window doesn't work: 'exactly K distinct' means the window is valid at one size but invalid both when too large and too small." },
          { num: 2, text: "The trick: Convert 'exactly K' into two 'at most K' problems. exactly(K) = atMost(K) − atMost(K−1)" },
          { num: 3, text: "atMost(K) Function: State is HashMap. Invalid is map.size() > K. Count is every valid window [l..r] contributes (r - l + 1)." }
        ],
        dryRun: [],
        insights: ["This exact pattern appears in LC 904 (Fruit Into Baskets). Once you see 'exactly K', reach for this decomposition immediately."],
        warnings: [],
        complexity: { time: "O(n) time", space: "O(K) hashmap" }
      }
    },
    { id: randomUUID(), type: "divider", order: 14, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 15,
      data: {
        title: "⏱ 85–110 min | Advanced Sliding Window",
        content: "Two extensions now: circular arrays (the array wraps around) and Kadane's (which looks like sliding window but isn't quite). These test whether you truly understand the pattern or just memorized it."
      }
    },
    {
      id: randomUUID(), type: "problem", order: 16,
      data: {
        number: 6,
        title: "Minimum Swaps to Group All 1's Together II",
        timeMin: 15,
        link: "https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/description/",
        platform: "LeetCode 2134",
        steps: [
          { num: 1, text: "Key observation: Count total 1s = K. The answer is a window of size K that already has the most 1s — the 0s inside it must be swapped out." },
          { num: 2, text: "Min swaps = K − (max 1s in any window of size K)." },
          { num: 3, text: "Circular handling: Array wraps around. Use arr[i % n] and iterate i from 0 to 2n-1 with a window of K." }
        ],
        dryRun: [],
        insights: ["Circular window never needs a new data structure — just modular indexing."],
        warnings: [],
        complexity: { time: "O(n) time", space: "O(1) space" }
      }
    },
    {
      id: randomUUID(), type: "problem", order: 17,
      data: {
        number: 7,
        title: "Maximum Subarray — Kadane's Algorithm",
        timeMin: 10,
        link: "https://leetcode.com/problems/maximum-subarray/description/",
        platform: "LeetCode 53",
        steps: [
          { num: 1, text: "Why sliding window fails: We want max subarray sum — but the array can have negatives. There's no rule to shrink." },
          { num: 2, text: "Kadane's key insight: At each position, decide: extend the current subarray or start fresh? If sum goes negative, it's a dead weight." },
          { num: 3, text: "curr = max(arr[i], curr + arr[i]) — if curr + arr[i] < arr[i], the current subarray is a liability; reset." },
          { num: 4, text: "Relate to window: Think of it as a variable window where l implicitly jumps to r whenever the running sum goes negative." }
        ],
        dryRun: [
          {
            headers: ["i", "arr[i]", "curr+arr[i]", "maxSum"],
            rows: [
              ["0", "-2", "—", "-2"],
              ["1", "1", "-1 (reset)", "1"],
              ["2", "-3", "-2", "1"],
              ["3", "4", "2 (reset)", "4"]
            ]
          }
        ],
        insights: [],
        warnings: ["All-negative array edge case: answer is the least negative element. Never initialize maxSum=0 unless guaranteed positives."],
        complexity: { time: "O(n) one pass", space: "O(1) space" }
      }
    },
    { id: randomUUID(), type: "divider", order: 18, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 19,
      data: {
        title: "⏱ 110–120 min | Final Wrap-Up",
        content: "Ask Students These:\n- Fixed vs variable window? Fixed: window size is always K. Variable: grows until rule breaks, shrinks from left.\n- When do we shrink? When state violates constraint (or meets it depending on problem).\n- How to identify constraint? What property of the window are we checking?\n- Why is sliding window O(n)? l only ever moves forward. Total work = O(2n) = O(n).\n\nKey Takeaways:\n- Deque pattern: store indices; evict when index falls outside window.\n- exactly(K) = atMost(K) − atMost(K−1) trick.\n- Circular arrays: use i % n."
      }
    }
  ]
};

const jsonPath = join(dataDir, 'pages.json');
let db = {};
try { db = JSON.parse(readFileSync(jsonPath, 'utf8')); } catch {}

db[pageId] = page;
writeFileSync(jsonPath, JSON.stringify(db, null, 2));
console.log(`✅ Seeded: "${page.title}"`);
console.log(`   ID     : ${pageId}`);

try {
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const Database = require('better-sqlite3');
  const dbFilePath = process.env.DB_PATH || join(dataDir, 'pages.db');
  const sqlDb = new Database(dbFilePath);
  sqlDb.pragma('journal_mode = WAL');
  sqlDb.exec(`CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, source_filename TEXT,
    content_json TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`);
  const exists = sqlDb.prepare('SELECT id FROM pages WHERE id=?').get(pageId);
  if (!exists) {
    sqlDb.prepare(`INSERT INTO pages (id,title,source_filename,content_json,created_at,updated_at)
      VALUES (?,?,?,?,?,?)`
    ).run(pageId, page.title, page.sourceFilename, JSON.stringify(page), page.createdAt, page.updatedAt);
    console.log(`✅ Also seeded into SQLite: ${dbFilePath}`);
  } else {
    sqlDb.prepare(`UPDATE pages SET content_json=?, updated_at=? WHERE id=?`).run(JSON.stringify(page), page.updatedAt, pageId);
    console.log(`✅ Updated existing SQLite entry: ${dbFilePath}`);
  }
  sqlDb.close();
} catch (e) {
  // better-sqlite3 not available locally, will work in Docker
}
