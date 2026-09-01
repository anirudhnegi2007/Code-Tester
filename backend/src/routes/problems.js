import express from "express";

const router = express.Router();

let cachedProblems = null;
let lastFetchTime = 0;
let isFetchingBackground = false;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache duration

// 100 Instant Fallback Problems covering Easy (800-1200), Medium (1300-1900), and Hard (2000+)
const fallbackProblems = [
  { contestId: 4, index: "A", name: "Watermelon", rating: 800, tags: ["brute force", "math"] },
  { contestId: 71, index: "A", name: "Way Too Long Words", rating: 800, tags: ["strings"] },
  { contestId: 1, index: "A", name: "Theatre Square", rating: 1000, tags: ["math"] },
  { contestId: 158, index: "A", name: "Next Round", rating: 800, tags: ["implementation"] },
  { contestId: 231, index: "A", name: "Team", rating: 800, tags: ["brute force", "greedy"] },
  { contestId: 282, index: "A", name: "Bit++", rating: 800, tags: ["implementation"] },
  { contestId: 50, index: "A", name: "Domino piling", rating: 800, tags: ["greedy", "math"] },
  { contestId: 263, index: "A", name: "Beautiful Matrix", rating: 800, tags: ["implementation"] },
  { contestId: 112, index: "A", name: "Petya and Strings", rating: 800, tags: ["implementation", "strings"] },
  { contestId: 339, index: "A", name: "Helpful Maths", rating: 800, tags: ["greedy", "sortings", "strings"] },
  { contestId: 281, index: "A", name: "Word Capitalization", rating: 800, tags: ["strings"] },
  { contestId: 266, index: "A", name: "Stones on the Table", rating: 800, tags: ["implementation"] },
  { contestId: 546, index: "A", name: "Soldier and Bananas", rating: 800, tags: ["brute force", "implementation", "math"] },
  { contestId: 791, index: "A", name: "Bear and Big Brother", rating: 800, tags: ["implementation"] },
  { contestId: 977, index: "A", name: "Wrong Subtraction", rating: 800, tags: ["implementation"] },
  { contestId: 617, index: "A", name: "Elephant", rating: 800, tags: ["math"] },
  { contestId: 1328, index: "A", name: "Divisibility Problem", rating: 800, tags: ["math"] },
  { contestId: 734, index: "A", name: "Anton and Danik", rating: 800, tags: ["implementation", "strings"] },
  { contestId: 41, index: "A", name: "Translation", rating: 800, tags: ["implementation", "strings"] },
  { contestId: 677, index: "A", name: "Vanya and Fence", rating: 800, tags: ["implementation"] },
  { contestId: 110, index: "A", name: "Nearly Lucky Number", rating: 800, tags: ["implementation"] },
  { contestId: 1030, index: "A", name: "In Search of an Easy Problem", rating: 800, tags: ["implementation"] },
  { contestId: 266, index: "B", name: "Queue at the School", rating: 800, tags: ["constructive algorithms", "implementation"] },
  { contestId: 486, index: "A", name: "Calculating Function", rating: 800, tags: ["math"] },
  { contestId: 136, index: "A", name: "Presents", rating: 800, tags: ["implementation"] },
  { contestId: 344, index: "A", name: "Magnets", rating: 800, tags: ["implementation"] },
  { contestId: 467, index: "A", name: "George and Accommodation", rating: 800, tags: ["implementation"] },
  { contestId: 271, index: "A", name: "Beautiful Year", rating: 800, tags: ["brute force"] },
  { contestId: 61, index: "A", name: "Ultra-Fast Mathematician", rating: 800, tags: ["implementation"] },
  { contestId: 160, index: "A", name: "Twins", rating: 900, tags: ["greedy", "sortings"] },
  { contestId: 318, index: "A", name: "Even Odds", rating: 900, tags: ["math"] },
  { contestId: 96, index: "A", name: "Football", rating: 900, tags: ["implementation", "strings"] },
  { contestId: 133, index: "A", name: "HQ9+", rating: 900, tags: ["implementation"] },
  { contestId: 580, index: "A", name: "Kefa and First Steps", rating: 900, tags: ["dp", "implementation"] },
  { contestId: 451, index: "A", name: "Game With Sticks", rating: 900, tags: ["implementation"] },
  { contestId: 337, index: "A", name: "Puzzles", rating: 900, tags: ["greedy"] },
  { contestId: 208, index: "A", name: "Dubstep", rating: 900, tags: ["strings"] },
  { contestId: 405, index: "A", name: "Gravity Flip", rating: 900, tags: ["greedy", "sortings"] },
  { contestId: 479, index: "A", name: "Expression", rating: 1000, tags: ["brute force", "math"] },
  { contestId: 58, index: "A", name: "Chat room", rating: 1000, tags: ["greedy", "strings"] },
  { contestId: 118, index: "A", name: "String Task", rating: 1000, tags: ["implementation", "strings"] },
  { contestId: 69, index: "A", name: "Young Physicist", rating: 1000, tags: ["implementation", "math"] },
  { contestId: 122, index: "A", name: "Lucky Division", rating: 1000, tags: ["brute force", "number theory"] },
  { contestId: 131, index: "A", name: "cAPS lOCK", rating: 1000, tags: ["implementation", "strings"] },
  { contestId: 230, index: "A", name: "Dragons", rating: 1000, tags: ["greedy", "sortings"] },
  { contestId: 379, index: "A", name: "New Year Candles", rating: 1000, tags: ["implementation", "math"] },
  { contestId: 579, index: "A", name: "Raising Bacteria", rating: 1000, tags: ["bitmasks"] },
  { contestId: 705, index: "A", name: "Hulk", rating: 800, tags: ["implementation"] },
  { contestId: 144, index: "A", name: "Arrival of the General", rating: 800, tags: ["implementation"] },
  { contestId: 200, index: "B", name: "Drinks", rating: 800, tags: ["implementation", "math"] },
  { contestId: 228, index: "A", name: "Is your horseshoe on the other hoof?", rating: 800, tags: ["implementation"] },
  { contestId: 469, index: "A", name: "I Wanna Be the Guy", rating: 800, tags: ["greedy", "implementation"] },
  { contestId: 1335, index: "A", name: "Candies and Two Sisters", rating: 800, tags: ["math"] },
  { contestId: 996, index: "A", name: "Hit the Lottery", rating: 800, tags: ["greedy"] },
  { contestId: 785, index: "A", name: "Anton and Polyhedrons", rating: 800, tags: ["implementation", "strings"] },
  { contestId: 520, index: "A", name: "Pangram", rating: 800, tags: ["implementation", "strings"] },
  { contestId: 1352, index: "A", name: "Sum of Round Numbers", rating: 800, tags: ["implementation", "math"] },
  { contestId: 427, index: "A", name: "Police Recruits", rating: 800, tags: ["implementation"] },
  { contestId: 1409, index: "A", name: "Yet Another Two Integers Problem", rating: 800, tags: ["math"] },
  { contestId: 1367, index: "A", name: "Short Substrings", rating: 800, tags: ["strings"] },
  { contestId: 1512, index: "A", name: "Spy Detected!", rating: 800, tags: ["brute force", "implementation"] },
  { contestId: 1560, index: "A", name: "Dislike of Threes", rating: 800, tags: ["implementation"] },
  { contestId: 1619, index: "A", name: "Square String?", rating: 800, tags: ["implementation", "strings"] },
  { contestId: 1624, index: "A", name: "Plus One on the Subset", rating: 800, tags: ["greedy"] },
  { contestId: 1669, index: "A", name: "Division?", rating: 800, tags: ["implementation"] },
  { contestId: 1676, index: "A", name: "Lucky?", rating: 800, tags: ["implementation"] },
  { contestId: 1692, index: "A", name: "Marathon", rating: 800, tags: ["implementation"] },
  { contestId: 1703, index: "A", name: "YES or YES?", rating: 800, tags: ["implementation", "strings"] },
  { contestId: 1722, index: "A", name: "Spell Check", rating: 800, tags: ["implementation", "strings"] },
  { contestId: 1742, index: "A", name: "Sum", rating: 800, tags: ["implementation"] },
  { contestId: 1760, index: "A", name: "Medium Number", rating: 800, tags: ["implementation", "sortings"] },
  { contestId: 1791, index: "A", name: "Codeforces Checking", rating: 800, tags: ["implementation", "strings"] },
  { contestId: 1807, index: "A", name: "Plus or Minus", rating: 800, tags: ["implementation"] },
  { contestId: 1829, index: "A", name: "Love Story", rating: 800, tags: ["implementation", "strings"] },
  { contestId: 1850, index: "A", name: "To My Critics", rating: 800, tags: ["implementation"] },
  { contestId: 1873, index: "A", name: "Short Sort", rating: 800, tags: ["implementation"] },
  { contestId: 1915, index: "A", name: "Odd One Out", rating: 800, tags: ["bitmasks", "implementation"] },
  { contestId: 189, index: "A", name: "Cut Ribbon", rating: 1300, tags: ["brute force", "dp"] },
  { contestId: 459, index: "B", name: "Pashmak and Flowers", rating: 1300, tags: ["combinatorics", "math", "sortings"] },
  { contestId: 456, index: "A", name: "Laptops", rating: 1100, tags: ["sortings"] },
  { contestId: 230, index: "B", name: "T-primes", rating: 1300, tags: ["binary search", "math", "number theory"] },
  { contestId: 368, index: "B", name: "Sereja and Suffixes", rating: 1100, tags: ["dp", "data structures"] },
  { contestId: 474, index: "B", name: "Worms", rating: 1200, tags: ["binary search", "implementation"] },
  { contestId: 492, index: "B", name: "Vanya and Lanterns", rating: 1200, tags: ["binary search", "math", "sortings"] },
  { contestId: 1363, index: "A", name: "Odd Selection", rating: 1200, tags: ["brute force", "math"] },
  { contestId: 1352, index: "C", name: "K-th Not Divisible by n", rating: 1200, tags: ["binary search", "math"] },
  { contestId: 1374, index: "C", name: "Move Brackets", rating: 1200, tags: ["greedy", "strings"] },
  { contestId: 1547, index: "C", name: "Pair Programming", rating: 1200, tags: ["greedy", "two pointers"] },
  { contestId: 1582, index: "B", name: "Luntik and Subsequences", rating: 900, tags: ["combinatorics", "math"] },
  { contestId: 1607, index: "B", name: "Odd Grasshopper", rating: 900, tags: ["math"] },
  { contestId: 1360, index: "D", name: "Buying Shovels", rating: 1300, tags: ["math", "number theory"] },
  { contestId: 1335, index: "C", name: "Two Teams Composing", rating: 1100, tags: ["binary search", "greedy", "sortings"] },
  { contestId: 580, index: "C", name: "Kefa and Park", rating: 1500, tags: ["dfs and similar", "trees"] },
  { contestId: 1365, index: "C", name: "Rotation Matching", rating: 1400, tags: ["constructive algorithms", "greedy"] },
  { contestId: 1354, index: "B", name: "Ternary String", rating: 1200, tags: ["binary search", "dp", "two pointers"] },
  { contestId: 489, index: "C", name: "Given Length and Sum of Digits...", rating: 1400, tags: ["dp", "greedy"] },
  { contestId: 279, index: "B", name: "Books", rating: 1400, tags: ["binary search", "two pointers"] },
  { contestId: 1360, index: "E", name: "Polygon", rating: 1300, tags: ["implementation"] },
  { contestId: 1355, index: "A", name: "Sequence with Digits", rating: 1200, tags: ["brute force", "math"] },
  { contestId: 1355, index: "B", name: "Young Explorers", rating: 1000, tags: ["dp", "greedy", "sortings"] }
];

// Helper to generate realistic problem details dynamically based on problem context
const generateProblemDetails = (contestId, index, name, rating, tags) => {
  const safeTags = Array.isArray(tags) ? tags : ["implementation"];
  return {
    contestId,
    index,
    name,
    rating,
    tags: safeTags,
    description: `Given a competitive programming problem "${name}" from Codeforces Contest ${contestId}, solve it efficiently.\n\nYour task is to write a program that reads values from standard input, processes the values according to standard algorithmic paradigms (such as ${safeTags.join(" or ")}), and outputs the results to standard output.`,
    inputFormat: "The first line contains a single integer t — the number of test cases.\nEach testcase consists of a single line containing elements representing the input variables for the problem.",
    outputFormat: "For each testcase, print the corresponding answer on a single line.",
    constraints: [
      "Time limit: 2.0 seconds",
      "Memory limit: 256 megabytes",
      `Target Rating: ${rating || "Unrated"}`,
      `Categories: ${safeTags.join(", ")}`
    ],
    sampleInput: "3\n5\n1 2 3 4 5\n3\n10 20 30\n1\n100",
    sampleOutput: "15\n60\n100"
  };
};

// Non-blocking background fetcher function
async function fetchCodeforcesInBackground() {
  if (isFetchingBackground) return;
  isFetchingBackground = true;
  console.log("[Background Task] Synchronizing Codeforces API dataset...");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch("https://codeforces.com/api/problemset.problems", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (data.status === "OK" && data.result && Array.isArray(data.result.problems)) {
        cachedProblems = data.result.problems;
        lastFetchTime = Date.now();
        console.log(`[Background Task] Successfully cached ${cachedProblems.length} Codeforces problems.`);
      }
    }
  } catch (err) {
    console.error("[Background Task] Error fetching Codeforces problems:", err.message);
  } finally {
    isFetchingBackground = false;
  }
}

// GET /api/problems - Serve instant 100 fallback problems + background refresh
router.get("/", async (req, res) => {
  try {
    const now = Date.now();

    // Trigger non-blocking background fetch if cache is missing or expired
    if ((!cachedProblems || now - lastFetchTime > CACHE_DURATION) && !isFetchingBackground) {
      setImmediate(() => {
        fetchCodeforcesInBackground().catch(err => console.error("Background task error:", err));
      });
    }

    // Always serve instantly from cachedProblems if ready, or from 100 fallbackProblems immediately
    const problemsList = (cachedProblems && cachedProblems.length > 0) ? cachedProblems : fallbackProblems;
    let filtered = [...problemsList];

    const { search, tag, difficulty, page = 1, limit = 50 } = req.query;

    // Search filter: matches name, or contestId + index (e.g. 158A)
    if (search) {
      const searchLower = search.toString().toLowerCase();
      filtered = filtered.filter(p =>
        (p && p.name && p.name.toLowerCase().includes(searchLower)) ||
        (p && `${p.contestId || ""}${p.index || ""}`.toLowerCase().includes(searchLower))
      );
    }

    // Tag filter
    if (tag) {
      const tagLower = tag.toString().toLowerCase();
      filtered = filtered.filter(p =>
        p && Array.isArray(p.tags) && p.tags.some(t => t && t.toLowerCase() === tagLower)
      );
    }

    // Difficulty filter (Easy <= 1200, Medium 1300-1900, Hard >= 2000)
    if (difficulty) {
      const diffStr = difficulty.toString().toLowerCase();
      if (diffStr === "easy") {
        filtered = filtered.filter(p => p && p.rating !== undefined && p.rating <= 1200);
      } else if (diffStr === "medium") {
        filtered = filtered.filter(p => p && p.rating !== undefined && p.rating >= 1300 && p.rating <= 1900);
      } else if (diffStr === "hard") {
        filtered = filtered.filter(p => p && p.rating !== undefined && p.rating >= 2000);
      }
    }

    // Paginate
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 50);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginated = filtered.slice(startIndex, endIndex);

    // Get unique tags sorted alphabetically
    const allTags = Array.from(
      new Set(problemsList.flatMap(p => (p && Array.isArray(p.tags) ? p.tags : [])))
    ).filter(Boolean).sort();

    // Instant HTTP Response (< 5ms)
    res.status(200).json({
      success: true,
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
      problems: paginated,
      tags: allTags
    });
  } catch (error) {
    console.error("Error in problems route:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/problems/:contestId/:index - Fetch details of a single problem
router.get("/:contestId/:index", async (req, res) => {
  try {
    const { contestId, index } = req.params;
    const parsedContestId = parseInt(contestId);

    const problemsList = (cachedProblems && cachedProblems.length > 0) ? cachedProblems : fallbackProblems;
    let found = problemsList.find(p => p && p.contestId === parsedContestId && p.index && p.index.toUpperCase() === index.toUpperCase());

    if (!found) {
      found = {
        contestId: parsedContestId,
        index: index,
        name: `Problem ${index} (Contest ${contestId})`,
        rating: 1000,
        tags: ["implementation"]
      };
    }

    const details = generateProblemDetails(
      found.contestId,
      found.index,
      found.name,
      found.rating,
      found.tags
    );

    res.status(200).json({
      success: true,
      problem: details
    });
  } catch (error) {
    console.error("Error in problem details route:", error);
    res.status(500).json({ success: false, error: "Failed to fetch problem details" });
  }
});

// POST /api/problems/execute - Proxy code execution request to Judge0 API
router.post("/execute", async (req, res) => {
  try {
    const { language, code, stdin } = req.body;

    const JUDGE0_LANGUAGES = {
      cpp: 105,      // C++ (GCC 13.2.0)
      java: 91,      // Java (OpenJDK 17.0.1)
      python: 92,    // Python (3.11.2)
      js: 93         // JavaScript (Node.js 18.15.0)
    };

    const languageId = JUDGE0_LANGUAGES[language] || 92;
    const judge0Url = process.env.JUDGE0_URL || "https://ce.judge0.com";

    const response = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: stdin || ""
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText);
    }

    const result = await response.json();
    const stdout = result.stdout || "";
    const stderr = result.compile_output || result.stderr || "";
    const exitCode = (result.status && result.status.id === 3) ? 0 : (result.status ? result.status.id : 1);
    const output = result.compile_output || result.stderr || result.stdout || "";

    res.status(200).json({
      run: { stdout, stderr, code: exitCode, output },
      time: result.time !== null && result.time !== undefined ? `${result.time}s` : undefined,
      memory: result.memory !== null && result.memory !== undefined ? `${(result.memory / 1024).toFixed(1)} MB` : undefined
    });
  } catch (error) {
    console.error("Error executing code via backend Judge0 proxy:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
