import express from "express";

const router = express.Router();

let cachedProblems = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache

// Fallback list of common problems (moved to frontend data directory)
const fallbackProblems = [];

// Helper to generate realistic problem details dynamically based on problem context
const generateProblemDetails = (contestId, index, name, rating, tags) => {
  // Default rich dynamic detail generation for other problems
  return {
    contestId,
    index,
    name,
    rating,
    tags,
    description: `Given a competitive programming problem "${name}" from Codeforces Contest ${contestId}, solve it efficiently.\n\nYour task is to write a program that reads values from standard input, processes the values according to standard algorithmic paradigms (such as ${tags.join(" or ") || "implementation"}), and outputs the results to standard output.`,
    inputFormat: "The first line contains a single integer t — the number of test cases.\nEach testcase consists of a single line containing elements representing the input variables for the problem.",
    outputFormat: "For each testcase, print the corresponding answer on a single line.",
    constraints: [
      "Time limit: 2.0 seconds",
      "Memory limit: 256 megabytes",
      `Target Rating: ${rating || "Unrated"}`,
      `Categories: ${tags.join(", ")}`
    ],
    sampleInput: "3\n5\n1 2 3 4 5\n3\n10 20 30\n1\n100",
    sampleOutput: "15\n60\n100"
  };
};

// GET /api/problems - Fetch cached list or fallback
router.get("/", async (req, res) => {
  try {
    const now = Date.now();

    // Fetch from Codeforces API if cache is empty or expired
    if (!cachedProblems || now - lastFetchTime > CACHE_DURATION) {
      try {
        console.log("Fetching problems from Codeforces API...");
        const response = await fetch("https://codeforces.com/api/problemset.problems", {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json"
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.status === "OK" && data.result && data.result.problems) {
            cachedProblems = data.result.problems;
            lastFetchTime = now;
            console.log(`Successfully cached ${cachedProblems.length} Codeforces problems.`);
          } else {
            console.warn("Codeforces API returned non-OK status:", data.status, data.comment);
          }
        } else {
          console.warn(`Codeforces API responded with HTTP status ${response.status}`);
        }
      } catch (fetchError) {
        console.error("Error calling Codeforces API:", fetchError.message);
      }
    }

    const problemsList = cachedProblems || fallbackProblems;
    let filtered = [...problemsList];

    const { search, tag, difficulty, page = 1, limit = 50 } = req.query;

    // Search filter: matches name, or contestId + index (e.g. 158A)
    if (search) {
      const searchLower = search.toString().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        `${p.contestId}${p.index}`.toLowerCase().includes(searchLower)
      );
    }

    // Tag filter
    if (tag) {
      const tagLower = tag.toString().toLowerCase();
      filtered = filtered.filter(p =>
        p.tags && p.tags.some(t => t.toLowerCase() === tagLower)
      );
    }

    // Difficulty filter (Easy <= 1200, Medium 1300-1900, Hard >= 2000)
    if (difficulty) {
      const diffStr = difficulty.toString().toLowerCase();
      if (diffStr === "easy") {
        filtered = filtered.filter(p => p.rating !== undefined && p.rating <= 1200);
      } else if (diffStr === "medium") {
        filtered = filtered.filter(p => p.rating !== undefined && p.rating >= 1300 && p.rating <= 1900);
      } else if (diffStr === "hard") {
        filtered = filtered.filter(p => p.rating !== undefined && p.rating >= 2000);
      }
    }

    // Paginate
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginated = filtered.slice(startIndex, endIndex);

    // Get unique tags sorted alphabetically
    const allTags = Array.from(new Set(problemsList.flatMap(p => p.tags || []))).sort();

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

    // Find the problem in the cache, fallback list, or search from active cached list
    const problemsList = cachedProblems || fallbackProblems;
    let found = problemsList.find(p => p.contestId === parsedContestId && p.index.toUpperCase() === index.toUpperCase());

    // If not found in the static/cached list, create a default problem detail object
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

// POST /api/problems/execute - Proxy code execution request to Piston API
router.post("/execute", async (req, res) => {
  try {
    const { language, code, stdin } = req.body;

    const PISTON_LANGUAGES = {
      cpp: "c++",
      java: "java",
      python: "python",
      js: "javascript"
    };

    const pistonLang = PISTON_LANGUAGES[language] || language;
    const pistonUrl = process.env.PISTON_URL || "https://emkc.org/api/v2/piston";

    console.log(`Forwarding execution to Piston at ${pistonUrl}/execute for language: ${pistonLang}`);

    const response = await fetch(`${pistonUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        language: pistonLang,
        version: "*",
        files: [
          {
            content: code
          }
        ],
        stdin: stdin || ""
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Piston API error response (Status ${response.status}):`, errorText);
      return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error executing code via backend Piston proxy:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
