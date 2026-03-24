/**
 * Seed script — inserts the Two Pointer Mastery lecture page.
 * Works with both SQLite (production) and JSON fallback (dev without deps).
 * Run with: node seed-page.mjs
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DB_PATH
  ? dirname(process.env.DB_PATH)
  : join(__dirname, '../data');

if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const now = new Date().toISOString();
const pageId = 'two-pointer-mastery-lecture-1';

const page = {
  id: pageId,
  title: "Lecture 1 — Two Pointer & Sliding Window Mastery",
  createdAt: now,
  updatedAt: now,
  sourceFilename: "two_pointer_lecture.docx",
  blocks: [
    {
      id: randomUUID(), type: "hero", order: 0,
      data: {
        title: "Lecture 1 — Two Pointer & Sliding Window",
        subtitle: "Master the art of pointer movement, pattern recognition, and turning O(n²) brute-force into elegant O(n) solutions",
        badges: ["2 Hours", "15 Problems", "Two Pointer", "Sliding Window", "Kadane's Algorithm"],
        metaChips: [
          { label: "Difficulty", value: "Beginner → Advanced" },
          { label: "Focus", value: "Intuition + Pattern Recognition" },
          { label: "Problems", value: "LeetCode + GFG" }
        ]
      }
    },
    {
      id: randomUUID(), type: "timeline", order: 1,
      data: {
        segments: [
          { time: "0–5 min",    label: "Intro + Pattern Recognition",   active: true  },
          { time: "5–35 min",   label: "Same Direction (Slow/Fast)",     active: false },
          { time: "35–75 min",  label: "Opposite Direction",             active: false },
          { time: "75–105 min", label: "Advanced Two Pointer",           active: false },
          { time: "105–120 min",label: "Wrap-Up + Practice",             active: false }
        ]
      }
    },
    {
      id: randomUUID(), type: "table", order: 2,
      data: {
        caption: "All 15 Problems Covered in This Lecture",
        headers: ["#", "Problem", "Platform", "Technique", "Slot"],
        rows: [
          ["1",  "Move Zeroes",                               "LeetCode #283", "Slow/fast same-direction pointer",    "5–35 min"],
          ["2",  "Remove Duplicates from Sorted Array",       "LeetCode #26",  "In-place overwrite pointer",          "5–35 min"],
          ["3",  "Sort Colors",                               "LeetCode #75",  "Dutch National Flag (3-pointer)",     "5–35 min"],
          ["4",  "Container With Most Water",                 "LeetCode #11",  "Opposite direction, greedy shrink",   "35–75 min"],
          ["5",  "Pair Sum in Sorted & Rotated Array",        "GFG",           "Pivot + circular two pointer",        "35–75 min"],
          ["6",  "3Sum",                                      "LeetCode #15",  "Sort + fix one + two pointer",        "35–75 min"],
          ["7",  "Merge Three Sorted Arrays",                 "GFG",           "Multi-pointer merging",               "75–105 min"],
          ["8",  "4Sum – Count Quadruplets",                  "GFG",           "Concept discussion O(n³)",            "75–105 min"],
          ["9",  "Max Sum Subarray of Size K",                "GFG",           "Fixed sliding window",                "Next Lecture"],
          ["10", "Longest Substring Without Repeating Chars", "LeetCode #3",   "Variable window + hashmap",           "Next Lecture"],
          ["11", "Minimum Size Subarray Sum",                 "LeetCode #209", "Variable window — shrink on target",  "Next Lecture"],
          ["12", "First Negative in Every Window of K",       "GFG",           "Queue-based fixed window",            "Next Lecture"],
          ["13", "Min Swaps to Group All 1s Together II",     "LeetCode #2134","Circular sliding window",             "Next Lecture"],
          ["14", "Maximum Subarray (Kadane's)",               "LeetCode #53",  "Kadane's — reset on negative sum",    "Next Lecture"],
          ["15", "Subarrays with K Different Integers",       "LeetCode #992", "atMost(K) − atMost(K−1) trick",      "Next Lecture"]
        ]
      }
    },
    { id: randomUUID(), type: "divider", order: 3, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 4,
      data: {
        title: "⏱ 0–5 min | Introduction + Pattern Recognition",
        content: "Every great technique starts with recognizing WHEN to use it. The Two Pointer pattern exists because many array problems that look O(n²) — checking every pair — can be reduced to O(n) if we use two indices instead of nested loops.\n\nOpen with this question to the class:\n  → \"Given a sorted array, find if two numbers sum to a target. How would you do it?\"\n  Let students suggest: brute force O(n²) → binary search O(n log n) → two pointer O(n).\n\nThis builds intuition: the sorted property gives us information we can exploit with pointer direction logic.\n\nCORE MENTAL MODEL — write these three triggers on the board:\n  • Sorted array + need pairs/triplets                → Opposite direction two pointer\n  • In-place rearrangement (compact, partition array)  → Same direction slow/fast pointer\n  • Contiguous subarray/substring with a condition     → Sliding window\n\nStudents will refer back to these triggers for every problem in this lecture."
      }
    },
    {
      id: randomUUID(), type: "tip", order: 5,
      data: {
        label: "The Two Pointer Decision Tree",
        content: "Ask yourself these 4 questions before coding:\n\n1. Is the array sorted (or can I sort it first)?           → Likely opposite-direction two pointer\n2. Do I need to rearrange/compact elements in-place?       → Slow/fast same-direction pointer\n3. Am I scanning a contiguous window of elements?          → Sliding window\n4. Am I looking for pairs/triplets summing to a value?     → Sort first, then two pointer\n\nIf none fit → Probably hashmap or prefix sum instead."
      }
    },
    { id: randomUUID(), type: "divider", order: 6, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 7,
      data: {
        title: "⏱ 5–35 min | Two Pointer — Same Direction (Slow/Fast Pointer)",
        content: "Shift to the 'write pointer + read pointer' mental model.\n\n  FAST pointer → scans every element (always moves forward)\n  SLOW pointer → only advances when we find something worth keeping\n\nHow to introduce it:\n  → Ask: \"How would you remove all zeros from an array without extra space?\"\n  → Let students think about shifting elements leftward (brute force is O(n²) — nested shift)\n  → Reveal: slow pointer marks the 'next write position', fast pointer scans ahead — one pass, O(n)\n\nThis pattern appears in 3 problems in this segment. Make students see the CONNECTION between all three — same pattern, different condition for advancing slow."
      }
    },
    {
      id: randomUUID(), type: "problem", order: 8,
      data: {
        number: 1,
        title: "Move Zeroes",
        timeMin: 15,
        link: "https://leetcode.com/problems/move-zeroes/description/",
        platform: "LeetCode #283",
        steps: [
          { num: 1, text: "RELATE: 'Move all zeros to end, keep non-zeros in original relative order, in-place.' Brute force O(n²): for each zero, shift all elements left. That's a nested loop — awful." },
          { num: 2, text: "INTRODUCE SLOW/FAST: slow=0 (write head), fast=0 (scan head). Rule: when fast finds a non-zero, copy it to arr[slow] and advance both. Otherwise only fast moves." },
          { num: 3, text: "DRY RUN on [0,1,0,3,12]: Step through the table below. After the first loop, positions [0..slow-1] hold all non-zeros. Then fill [slow..n-1] with zeros." },
          { num: 4, text: "COMPLEXITY DISCUSSION: One full scan → O(n). No extra array → O(1) space. Two-pass solution is fine; one-pass swap variant also exists." },
          { num: 5, text: "CONNECT THE PATTERN: 'slow=next write, fast=scanner' appears verbatim in Remove Duplicates and Remove Element. Make students state the pattern aloud before moving on." }
        ],
        dryRun: [{
          headers: ["Step", "fast", "arr[fast]", "slow", "Action", "Array after"],
          rows: [
            ["1", "0", "0",  "0", "Zero — fast++ only",              "[0, 1, 0, 3, 12]"],
            ["2", "1", "1",  "0", "Non-zero — arr[0]=1, slow++",     "[1, 1, 0, 3, 12]"],
            ["3", "2", "0",  "1", "Zero — fast++ only",              "[1, 1, 0, 3, 12]"],
            ["4", "3", "3",  "1", "Non-zero — arr[1]=3, slow++",     "[1, 3, 0, 3, 12]"],
            ["5", "4", "12", "2", "Non-zero — arr[2]=12, slow++",    "[1, 3, 12, 3, 12]"],
            ["Fill","—","—", "3", "Fill [3..4] with 0",              "[1, 3, 12, 0, 0] ✓"]
          ]
        }],
        insights: [
          "slow is always ≤ fast — they never cross",
          "After the scan, positions [0, slow) are all non-zeros in original order",
          "This is a stable move — relative order of non-zero elements is preserved"
        ],
        warnings: [
          "Don't swap instead of overwrite if you need stable order — swapping can reorder non-zeros",
          "Edge case: no zeros in array → slow ends at n, fill loop does nothing"
        ],
        complexity: { time: "O(n)", space: "O(1)" }
      }
    },
    {
      id: randomUUID(), type: "problem", order: 9,
      data: {
        number: 2,
        title: "Remove Duplicates from Sorted Array",
        timeMin: 10,
        link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/",
        platform: "LeetCode #26",
        steps: [
          { num: 1, text: "RELATE: Sorted array — so duplicates are always adjacent. We need to compact unique values in-place and return the count. We don't need to clear the tail." },
          { num: 2, text: "STUDENT ATTEMPT: Give 2 minutes to code solo. Most discover: slow=0 (points to last unique written), fast=1 (scanner)." },
          { num: 3, text: "CONDITION FOR WRITE: if arr[fast] != arr[slow] → found a new unique value. Do slow++, then arr[slow] = arr[fast]. If equal → just fast++." },
          { num: 4, text: "RETURN slow+1 — slow is 0-indexed position of last unique, so length is slow+1." },
          { num: 5, text: "CONNECT: Same slow/fast skeleton as Move Zeroes. Only the 'write condition' changed: was 'non-zero', now 'different from last written'. Make students write both conditions side by side." }
        ],
        dryRun: [{
          headers: ["fast", "arr[fast]", "slow", "arr[slow]", "Action"],
          rows: [
            ["1", "1", "0", "1", "Equal → fast++ only"],
            ["2", "2", "0", "1", "Diff → slow=1, arr[1]=2"],
            ["3", "3", "1", "2", "Diff → slow=2, arr[2]=3"],
            ["4", "3", "2", "3", "Equal → fast++ only"],
            ["—", "—", "2", "3", "Return slow+1 = 3 ✓"]
          ]
        }],
        insights: [
          "Because array is sorted, duplicates cluster — we only compare arr[fast] with arr[slow], not a hashset",
          "The tail of the array after position slow is irrelevant — LeetCode only checks up to slow+1"
        ],
        warnings: [
          "Don't try to shrink or delete — just overwrite and return the count"
        ],
        complexity: { time: "O(n)", space: "O(1)" }
      }
    },
    {
      id: randomUUID(), type: "problem", order: 10,
      data: {
        number: 3,
        title: "Sort Colors (Dutch National Flag)",
        timeMin: 15,
        link: "https://leetcode.com/problems/sort-colors/description/",
        platform: "LeetCode #75",
        steps: [
          { num: 1, text: "RELATE: Array has only 0s, 1s, 2s. Sort it in one pass without counting. Naive: 2-pass counting sort. Can we do 1 pass with 3 pointers?" },
          { num: 2, text: "INTRODUCE Dutch National Flag — 3 pointers: low=0, mid=0, high=n-1. Invariant at all times: [0..low-1] = all 0s | [low..mid-1] = all 1s | [mid..high] = unsorted | [high+1..n-1] = all 2s" },
          { num: 3, text: "LOOP while mid <= high. Three cases: arr[mid]==0 → swap(arr[low],arr[mid]), low++, mid++ | arr[mid]==1 → mid++ only | arr[mid]==2 → swap(arr[mid],arr[high]), high-- (DON'T mid++!)" },
          { num: 4, text: "WHY NOT mid++ when swapping with high? Because the element that came from high is UNKNOWN — we haven't examined it yet. We must let mid re-examine it next iteration." },
          { num: 5, text: "TRACE through [2,0,2,1,1,0] using the dry run table. Emphasize the case where arr[mid]=2: mid stays, high shrinks." }
        ],
        dryRun: [{
          headers: ["low", "mid", "high", "arr[mid]", "Action", "Array after"],
          rows: [
            ["0","0","5","2","swap(arr[0],arr[5]), high=4", "[0,0,2,1,1,2]"],
            ["0","0","4","0","swap(arr[0],arr[0]), low=1,mid=1","[0,0,2,1,1,2]"],
            ["1","1","4","0","swap(arr[1],arr[1]), low=2,mid=2","[0,0,2,1,1,2]"],
            ["2","2","4","2","swap(arr[2],arr[4]), high=3","[0,0,1,1,2,2]"],
            ["2","2","3","1","mid=3","[0,0,1,1,2,2]"],
            ["2","3","3","1","mid=4","[0,0,1,1,2,2]"],
            ["2","4","3","—","mid>high → DONE ✓","[0,0,1,1,2,2]"]
          ]
        }],
        insights: [
          "One pass, 3 pointers — O(n) time, O(1) space",
          "When arr[mid]=0 and we swap with low: the element at low is always a 1 (already processed), so after swap mid is safe to advance",
          "This generalizes: Dutch National Flag works for any 3-way partition problem"
        ],
        warnings: [
          "The most common mistake: incrementing mid after swapping with high. Don't do it — the incoming element is unexamined."
        ],
        complexity: { time: "O(n)", space: "O(1)" }
      }
    },
    { id: randomUUID(), type: "divider", order: 11, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 12,
      data: {
        title: "⏱ 35–75 min | Two Pointer — Opposite Direction",
        content: "New mental model: L starts at index 0, R starts at n-1. They move toward each other.\n\nThis works when the sorted structure (or problem structure) gives us a CLEAR greedy decision at every step:\n  'If the current pair is too small → move L right (increase value)'\n  'If the current pair is too large → move R left (decrease value)'\n\nKey question to ask before using this:\n  → 'Can I always decide which pointer to move based on current values alone?'\n  → If YES → opposite direction two pointer works. If not → probably need a hashmap.\n\nCritical insight: we never miss the optimal answer. If the best pair is (i, j) where i < j, both pointers will eventually sit at i and j without skipping it."
      }
    },
    {
      id: randomUUID(), type: "problem", order: 13,
      data: {
        number: 4,
        title: "Container With Most Water",
        timeMin: 15,
        link: "https://leetcode.com/problems/container-with-most-water/description/",
        platform: "LeetCode #11",
        steps: [
          { num: 1, text: "RELATE: Array of bar heights. Two bars at positions L and R form a container. Water held = min(height[L], height[R]) × (R - L). Find the maximum water." },
          { num: 2, text: "BRUTE FORCE: O(n²) — try every (L, R) pair. Ask students: can the two pointer always find the best without trying all pairs?" },
          { num: 3, text: "GREEDY INSIGHT: Start L=0, R=n-1 (widest container). At each step, move the pointer with the SHORTER height inward. Reason: the bottleneck is the shorter side. Moving the taller side can only make things worse (width shrinks, height can't improve since min is already capped by the shorter side). Moving the shorter gives us a CHANCE at a taller wall." },
          { num: 4, text: "PROOF SKETCH: Suppose optimal is at (i, j). If h[i] ≤ h[j], our algorithm will eventually reach a state where L=i. At that point R is at or to the right of j. We'll keep moving R until it reaches j (since we move shorter pointer, and h[R]≥h[i]). So we never skip (i,j)." },
          { num: 5, text: "TRACE [1,8,6,2,5,4,8,3,7] and track max area. Emphasize that each step we compute area, update max, then move the shorter pointer." }
        ],
        dryRun: [{
          headers: ["L (h)", "R (h)", "Width", "Area", "Move", "Max so far"],
          rows: [
            ["0 (1)","8 (7)","8","8","L++ (h[L]<h[R])","8"],
            ["1 (8)","8 (7)","7","49","R-- (h[R]<h[L])","49"],
            ["1 (8)","7 (3)","6","18","R--","49"],
            ["1 (8)","6 (4)","5","20","R--","49"],
            ["1 (8)","5 (5)","4","20","R--","49"],
            ["1 (8)","4 (4)","3","12","R--","49"],
            ["1 (8)","3 (2)","2","4","R--","49"],
            ["1 (8)","2 (6)","1","6","R--","49"],
            ["—","—","—","—","L>=R → DONE","49 ✓"]
          ]
        }],
        insights: [
          "Always move the SHORTER pointer — it's the only side that has a chance to improve the min",
          "When heights are equal, it doesn't matter which you move — either is correct"
        ],
        warnings: [
          "Don't move the taller pointer — you provably cannot improve by shrinking from the taller side"
        ],
        complexity: { time: "O(n)", space: "O(1)" }
      }
    },
    {
      id: randomUUID(), type: "problem", order: 14,
      data: {
        number: 5,
        title: "Pair Sum in Sorted and Rotated Array",
        timeMin: 15,
        link: "https://www.geeksforgeeks.org/problems/pair-sum-in-a-sorted-and-rotated-array/1",
        platform: "GFG",
        steps: [
          { num: 1, text: "RELATE: Classic two-pointer for pair sum works on sorted arrays with L=0, R=n-1. But this array is sorted AND rotated — e.g. [4,5,6,7,0,1,2]. L=0 is NOT the minimum, R=n-1 is NOT the maximum." },
          { num: 2, text: "FIND THE PIVOT: The minimum element is where arr[i] > arr[i+1] (the 'drop'). L starts there (minimum), R = (L-1+n)%n (just before L = maximum element). This restores the 'L=min, R=max' invariant." },
          { num: 3, text: "CIRCULAR MOVEMENT: Same opposite-direction logic, but pointer moves wrap around using modulo. sum=arr[L]+arr[R]. If ==target → found. If <target → L=(L+1)%n. If >target → R=(R-1+n)%n. Stop when L==R (no pair)." },
          { num: 4, text: "EXAMPLE: Array=[11,15,6,8,9,10], target=16. Pivot is at index 1 (15→6 drop). So L=2 (value 6, min), R=1 (value 15, max). sum=6+15=21 > 16 → R=(1-1+6)%6=0. sum=6+11=17>16 → R=5. sum=6+10=16==target → FOUND!" },
          { num: 5, text: "CONNECT: This problem shows that two-pointer's 'sorted structure' requirement is flexible — you just need to know where min and max live, then apply the same greedy logic." }
        ],
        dryRun: [],
        insights: [
          "Find pivot first — that's your minimum element = start of L",
          "R = (pivot-1+n)%n gives the maximum element",
          "Modulo arithmetic replaces the standard L++/R-- with circular equivalents"
        ],
        warnings: [
          "Don't use L=0, R=n-1 directly — the array isn't sorted from index 0 after rotation"
        ],
        complexity: { time: "O(n)", space: "O(1)" }
      }
    },
    {
      id: randomUUID(), type: "problem", order: 15,
      data: {
        number: 6,
        title: "3Sum",
        timeMin: 20,
        link: "https://leetcode.com/problems/3sum/description/",
        platform: "LeetCode #15",
        steps: [
          { num: 1, text: "RELATE: Find all UNIQUE triplets summing to 0. Brute force O(n³). First reduction: sort → O(n log n), then FIX one number (loop i from 0 to n-3) and find a pair in the remaining sorted subarray that sums to -nums[i]. Each pair search is O(n) two pointer → total O(n²)." },
          { num: 2, text: "SORT FIRST — this enables two things: (a) opposite-direction two pointer for the inner search, (b) easy duplicate skipping by checking if current == previous." },
          { num: 3, text: "SKIP DUPLICATES at every level: for i: if i>0 && nums[i]==nums[i-1] → continue. After finding a triplet: while L<R && nums[L]==nums[L+1]: L++. while L<R && nums[R]==nums[R-1]: R--. Then L++, R--." },
          { num: 4, text: "EARLY TERMINATION: if nums[i] > 0 → all elements from i onward are positive → no triplet can sum to 0 → break. This is a big speedup for large positive-heavy arrays." },
          { num: 5, text: "TRACE [-4,-1,-1,0,1,2] with the dry run. Show how duplicates are skipped in the fixed i loop and after finding a triplet." }
        ],
        dryRun: [{
          headers: ["i (val)", "L", "R", "Sum", "Action"],
          rows: [
            ["0 (−4)","1 (−1)","5 (2)","−3","<0 → L++"],
            ["0 (−4)","2 (−1)","5 (2)","−3","<0 → L++"],
            ["0 (−4)","3 (0)","5 (2)","−2","<0 → L++"],
            ["0 (−4)","4 (1)","5 (2)","−1","<0 → L++"],
            ["0 (−4)","5 (2)","5 (2)","—","L>=R → next i"],
            ["1 (−1)","2 (−1)","5 (2)","0","Found [−1,−1,2]! skip dupes, L++,R--"],
            ["1 (−1)","3 (0)","4 (1)","0","Found [−1,0,1]! skip dupes, L++,R--"],
            ["1 (−1)","4","4","—","L>=R → next i"],
            ["2 (−1)","—","—","—","nums[2]==nums[1] → skip (continue)"],
            ["3 (0)","4 (1)","5 (2)","3",">0 → R--"],
            ["3 (0)","4 (1)","4 (1)","—","L>=R → next i"],
            ["4 (1)","—","—","—","nums[4]>0 → break early ✓"]
          ]
        }],
        insights: [
          "Sort is the enabler — it makes both the two pointer and duplicate skipping possible",
          "Early termination (nums[i]>0 → break) is important for interview: shows you think about performance",
          "Result: [[-1,-1,2],[-1,0,1]] — only 2 unique triplets despite duplicates in input"
        ],
        warnings: [
          "Skip duplicates AFTER recording a triplet, not before",
          "Don't use a set to deduplicate the output — the in-place skip is O(1) space and cleaner"
        ],
        complexity: { time: "O(n²)", space: "O(1) ignoring output" }
      }
    },
    { id: randomUUID(), type: "divider", order: 16, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 17,
      data: {
        title: "⏱ 75–105 min | Advanced Two Pointer",
        content: "Now we generalize the two-pointer idea beyond just two pointers.\n\nMENTAL MODEL: More fixed pointers → more factors of O(n) in complexity.\n  • 2Sum with two pointer    → O(n)\n  • 3Sum (fix 1 + TP inner) → O(n²)\n  • 4Sum (fix 2 + TP inner) → O(n³)\n  • KSum → O(n^(K-1))       (sort once, recurse)\n\nMerging multiple sorted arrays → K pointers simultaneously (or min-heap for K > 3).\n\nGoal for this segment: students see that Two Pointer is a FAMILY of techniques, not a single trick."
      }
    },
    {
      id: randomUUID(), type: "problem", order: 18,
      data: {
        number: 7,
        title: "Merge Three Sorted Arrays",
        timeMin: 20,
        link: "https://www.geeksforgeeks.org/problems/merge-three-sorted-arrays-1587115620/0",
        platform: "GFG",
        steps: [
          { num: 1, text: "RELATE: Three sorted arrays arr1, arr2, arr3. Merge into one sorted output array. Build intuition: merge 2 arrays first (students know this from merge sort). Now extend to 3." },
          { num: 2, text: "THREE POINTERS: i=0 (arr1), j=0 (arr2), k=0 (arr3). At each step: pick the minimum of arr1[i], arr2[j], arr3[k]. Append it to output. Advance that pointer." },
          { num: 3, text: "HANDLE EXHAUSTION: Use large sentinel values (∞) when an array is exhausted, so comparisons still work. Or: check bounds explicitly and treat exhausted arrays as non-candidates." },
          { num: 4, text: "COMPLEXITY: O(n1+n2+n3) — each element processed once. Output array size = n1+n2+n3 — allocate upfront." },
          { num: 5, text: "GENERALIZE: For K sorted arrays with total N elements: 3-pointer → O(K×N) using comparisons. For large K, use a min-heap of size K → O(N log K). This leads directly to LeetCode Hard: Merge K Sorted Lists." }
        ],
        dryRun: [{
          headers: ["i (arr1)", "j (arr2)", "k (arr3)", "Min picked", "Output so far"],
          rows: [
            ["0→1 (1)","0 (4)","0 (5)","arr1[0]=1","[1]"],
            ["1→2 (2)","0 (4)","0 (5)","arr1[1]=2","[1,2]"],
            ["2→end (3)","0 (4)","0 (5)","arr1[2]=3","[1,2,3]"],
            ["end","0→1 (4)","0 (5)","arr2[0]=4","[1,2,3,4]"],
            ["end","1→2 (7)","0→1 (5)","arr3[0]=5","[1,2,3,4,5]"],
            ["end","1→2 (7)","1→2 (8)","arr2[1]=7","[1,2,3,4,5,7]"],
            ["end","2→end (9)","1→2 (8)","arr3[1]=8","[1,2,3,4,5,7,8]"],
            ["end","2→end (9)","2→end","arr2[2]=9","[1,2,3,4,5,7,8,9] ✓"]
          ]
        }],
        insights: [
          "This is the merge step of merge sort — generalized to K arrays",
          "With K arrays, naive comparison is O(K) per element → use min-heap for O(log K) per element",
          "Output array size is always n1+n2+n3 — allocate it before the loop"
        ],
        warnings: [
          "Don't forget to drain any remaining non-exhausted arrays after one runs out"
        ],
        complexity: { time: "O(n₁+n₂+n₃)", space: "O(n₁+n₂+n₃) for output" }
      }
    },
    {
      id: randomUUID(), type: "problem", order: 19,
      data: {
        number: 8,
        title: "4Sum – Count Quadruplets with Given Sum",
        timeMin: 10,
        link: "https://www.geeksforgeeks.org/problems/count-quadruplets-with-given-sum/1",
        platform: "GFG",
        steps: [
          { num: 1, text: "CONCEPT ONLY (don't code fully — time): Apply the 3Sum template. Sort array. Fix TWO outer indices i and j (nested loops). For the remaining subarray [j+1..n-1], use two pointer to find pairs summing to target-arr[i]-arr[j]." },
          { num: 2, text: "COMPLEXITY: Two fixed loops × O(n) two pointer = O(n³). This is the optimal time for 4Sum (you can't do better without additional constraints)." },
          { num: 3, text: "THE KSUM PATTERN: Make students write this table: 2Sum→O(n) | 3Sum→O(n²) | 4Sum→O(n³) | KSum→O(n^(K-1)). Each extra fixed pointer adds one O(n) factor. Sorting once = O(n log n) amortized." },
          { num: 4, text: "INTERVIEW TIP: In interviews, if asked 'KSum', say: sort once, write a recursive helper that fixes one element and recurses, base case is 2Sum with two pointer. This impresses interviewers." }
        ],
        dryRun: [],
        insights: [
          "4Sum template = sort + outer i loop + outer j loop + inner two pointer",
          "Duplicate skipping: skip for i, j, L, and R — four levels of deduplication",
          "KSum generalizes to O(n^(K-1)) with K-2 nested fixed loops + one two pointer"
        ],
        warnings: [],
        complexity: { time: "O(n³)", space: "O(1) ignoring output" }
      }
    },
    { id: randomUUID(), type: "divider", order: 20, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 21,
      data: {
        title: "⏱ 105–120 min | Wrap-Up + Sliding Window Bridge",
        content: "Final 15 minutes: consolidate understanding and bridge to the Sliding Window pattern.\n\nASK THE CLASS:\n  → 'When do we use same-direction two pointer vs opposite direction?'\n  → 'What's the critical difference between two pointer and sliding window?'\n\nKEY DISTINCTION:\n  Two Pointer: L and R are independent — they can be at ANY two positions based on the problem logic.\n  Sliding Window: always maintains a CONTIGUOUS subarray [L..R]. Both pointers only move right. The window expands or shrinks as a unit.\n\nBRIDGE QUESTION:\n  → 'Find the maximum sum subarray of size K'\n  This is a FIXED sliding window — both pointers move right together, never independently.\n  Students who think it's two pointer will be confused — use this to cement the distinction.\n\nPREVIEW on the board — problems for Lecture 2:\n  Fixed window:    Max Sum Subarray of K | First Negative in Every Window of K\n  Variable window: Longest Substring Without Repeating | Min Size Subarray Sum\n  Kadane's:        Maximum Subarray — 'reset window when sum goes negative'\n  Advanced:        Subarrays with K Different Integers — atMost(K) − atMost(K−1) trick"
      }
    },
    {
      id: randomUUID(), type: "checklist", order: 22,
      data: {
        title: "Key Takeaways — Two Pointer Complete Reference",
        items: [
          "SAME DIRECTION: slow=write head, fast=scan head. Condition for advancing slow determines what you're filtering (non-zeros, unique elements, target value, etc.)",
          "DUTCH NATIONAL FLAG: 3 pointers for 3-way partition. Invariant: [0..low-1]=group1, [low..mid-1]=group2, [mid..high]=unknown, [high+1..n-1]=group3. Key: don't mid++ when swapping with high",
          "OPPOSITE DIRECTION: L=0, R=n-1, move TOWARD each other. Works when sorted structure gives a clear greedy decision (too small → move L, too large → move R)",
          "CONTAINER / GREEDY: Always move the pointer with the WORSE value (shorter height, smaller element). Moving the better side can never help — width decreases and the bottleneck doesn't change",
          "3SUM TEMPLATE: Sort + fix one (i) + two pointer inner (L=i+1, R=n-1). Skip duplicates at i level AND after finding a triplet at L/R level. Early exit when nums[i]>0",
          "CIRCULAR TWO POINTER: Find min/max positions (pivot for rotated array), use modulo arithmetic for pointer movement",
          "MULTI-POINTER MERGE: K pointers for K sorted arrays, always pick minimum. For K>3, use min-heap for O(log K) per pick instead of O(K)",
          "KSUM PATTERN: Each additional fixed pointer adds O(n) → KSum = O(n^(K-1)). Sort once, recurse with fixed element, base = 2Sum two pointer",
          "TWO POINTER vs SLIDING WINDOW: Two pointer positions are independent and can move in either direction. Sliding window always maintains [L..R] contiguous and both pointers only move rightward"
        ]
      }
    },
    {
      id: randomUUID(), type: "exercise", order: 23,
      data: {
        title: "Mini Exercises — Extend Your Understanding",
        items: [
          { badge: "Warm-up", text: "Solve 2Sum on a sorted array using two pointer. Write it in under 5 lines. How does it differ from the hashmap approach in time and space?" },
          { badge: "Modify", text: "Take your 3Sum solution and extend it to 4Sum. Identify exactly which 2 lines change and what you add." },
          { badge: "Think", text: "Can you solve Move Zeroes using opposite-direction two pointer? Try it — what breaks? Why does same-direction work but opposite-direction doesn't?" },
          { badge: "Code", text: "Remove Element (LeetCode #27): given array and val, remove all occurrences of val in-place. Apply the slow/fast pattern — write it in 6 minutes." },
          { badge: "Challenge", text: "Subarrays with K Different Integers (LeetCode #992): exactly(K) = atMost(K) − atMost(K−1). Implement atMost(K) as a sliding window. This bridges two pointer → sliding window thinking." }
        ]
      }
    },
    { id: randomUUID(), type: "divider", order: 24, data: { style: "gradient" } },
    {
      id: randomUUID(), type: "section", order: 25,
      data: {
        title: "Lecture 2 Preview — Sliding Window Problems",
        content: "These problems are assigned for self-practice before Lecture 2. For each, try to identify the window type (fixed vs variable) BEFORE looking at solutions.\n\nFixed Window (size K given — slide one element at a time):\n  → Max Sum Subarray of Size K (GFG)\n  → First Negative in Every Window of K (GFG) — hint: think about which indices to store\n  → Min Swaps to Group All 1s Together II (LeetCode #2134) — circular array variation\n\nVariable Window (expand right freely, shrink left when condition violated):\n  → Longest Substring Without Repeating Characters (LeetCode #3) — expand until repeat, shrink past old position\n  → Minimum Size Subarray Sum (LeetCode #209) — expand until sum≥target, then shrink to minimize\n\nKadane's Algorithm (DP / greedy — not strictly sliding window but same intuition):\n  → Maximum Subarray (LeetCode #53) — key idea: cur = max(arr[i], cur+arr[i])\n\nAdvanced atMost(K) trick:\n  → Subarrays with K Different Integers (LeetCode #992) — bridges this lecture to the next"
      }
    },
    {
      id: randomUUID(), type: "table", order: 26,
      data: {
        caption: "Lecture 2 — Sliding Window Problem Set",
        headers: ["Problem", "Platform", "Window Type", "Core Technique"],
        rows: [
          ["Max Sum Subarray of Size K",          "GFG",            "Fixed K",      "Remove arr[i−K], add arr[i] each step"],
          ["First Negative in Every Window of K", "GFG",            "Fixed K",      "Deque holds indices of negatives in window"],
          ["Longest Substring No Repeat",         "LeetCode #3",    "Variable",     "HashMap of last seen index; move L past duplicate"],
          ["Minimum Size Subarray Sum",           "LeetCode #209",  "Variable",     "Shrink L while window sum ≥ target, track min length"],
          ["Min Swaps Group All 1s Together II",  "LeetCode #2134", "Fixed circular","Count 1s in any window of size = total_ones"],
          ["Maximum Subarray (Kadane's)",         "LeetCode #53",   "Dynamic DP",   "cur = max(arr[i], cur+arr[i]); reset on negative"],
          ["Subarrays K Different Integers",      "LeetCode #992",  "Two windows",  "exactly(K) = atMost(K) − atMost(K−1)"]
        ]
      }
    },
    {
      id: randomUUID(), type: "tip", order: 27,
      data: {
        label: "Master Cheat Sheet — Which Pattern to Use?",
        content: "Given a subarray/substring problem, ask in order:\n\n1. Fixed window size K?             → Fixed sliding window\n2. Condition on window content?     → Variable sliding window (expand R, shrink L)\n3. Looking for pairs/triplets?      → Two pointer (sort first if needed)\n4. In-place compaction/partition?   → Same-direction slow/fast pointer\n5. Max/min subarray sum, no size?   → Kadane's algorithm\n6. Count 'exactly K' subarrays?     → atMost(K) − atMost(K−1)\n7. Pair sum in sorted array?        → Opposite-direction two pointer\n\nMemorise this order. It will solve 90% of array interview questions."
      }
    }
  ]
};

// ── Write to JSON store (works without SQLite) ────────────────────────────────
const jsonPath = join(dataDir, 'pages.json');
let db = {};
try { db = JSON.parse(readFileSync(jsonPath, 'utf8')); } catch {}

if (db[pageId]) {
  console.log(`ℹ  Page "${pageId}" already exists — skipping seed.`);
} else {
  db[pageId] = page;
  writeFileSync(jsonPath, JSON.stringify(db, null, 2));
  console.log(`✅ Seeded: "${page.title}"`);
  console.log(`   ID     : ${pageId}`);
  console.log(`   Blocks : ${page.blocks.length}`);
  console.log(`   Path   : ${jsonPath}`);
}

// ── Also write to SQLite if available ─────────────────────────────────────────
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
  }
  sqlDb.close();
} catch {
  // better-sqlite3 not available — JSON store is used instead
}

import('./seed-page-2.mjs').catch(e => console.error("Failed to run side seed", e));
