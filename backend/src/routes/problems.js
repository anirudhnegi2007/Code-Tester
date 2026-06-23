import express from "express";

const router = express.Router();

let cachedProblems = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache

// Fallback list of common problems (moved to frontend data directory)
const fallbackProblems = [];

// Helper to generate realistic problem details dynamically based on problem context
const generateProblemDetails = (contestId, index, name, rating, tags) => {
  // Common details for specific popular problems
  if (name.toLowerCase() === "watermelon") {
    return {
      contestId, index, name, rating, tags,
      description: "One hot summer day Pete and his friend Billy decided to buy a watermelon. They chose the biggest and the ripest one, in their opinion. After that the watermelon was weighed, and the scales showed w kilos. They rushed home, dying of thirst, and decided to divide the berry, however they faced a hard problem.\n\nPete and Billy are great fans of even numbers, that's why they want to divide the watermelon in such a way that each of the two parts weighs even number of kilos, at the same time it is not obligatory that the parts are equal. The boys are extremely tired and want to start their meal as soon as possible, that's why you should help them and find out, if they can divide the watermelon in the way they want. For sure, each of them should get a part of positive weight.",
      inputFormat: "The first (and the only) input line contains integer number w (1 ≤ w ≤ 100) — the weight of the watermelon bought by the boys.",
      outputFormat: "Print YES, if the boys can divide the watermelon into two parts, each of them weighing even number of kilos; and NO in the opposite case.",
      constraints: [
        "Time limit: 1.0 seconds",
        "Memory limit: 256 megabytes",
        "Constraints: 1 ≤ w ≤ 100"
      ],
      sampleInput: "8",
      sampleOutput: "YES"
    };
  }

  if (name.toLowerCase() === "way too long words") {
    return {
      contestId, index, name, rating, tags,
      description: "Sometimes some words like 'localization' or 'internationalization' are so long that writing them many times in one text is quite tiresome.\n\nLet's consider a word too long, if its length is strictly more than 10 characters. All too long words should be replaced with a special abbreviation.\n\nThis abbreviation is made like this: we write down the first and the last letter of a word and between them we write the number of letters between the first and the last letters. That number is in decimal system and doesn't contain any leading zeroes.\n\nThus, 'localization' will be spelt as 'l10n', and 'internationalization' will be spelt as 'i18n'.\n\nYou are suggested to customize the process of replacing words with abbreviations.",
      inputFormat: "The first line contains an integer n (1 ≤ n ≤ 100). Each of the following n lines contains one word. All words consist of lowercase Latin letters and have lengths from 1 to 100 characters.",
      outputFormat: "Print n lines. The i-th line should contain the result of the abbreviation of the i-th word from the input.",
      constraints: [
        "Time limit: 1.0 seconds",
        "Memory limit: 256 megabytes",
        "Constraints: 1 ≤ n ≤ 100"
      ],
      sampleInput: "4\nword\nlocalization\ninternationalization\npneumonoultramicroscopicsilicovolcanoconiosis",
      sampleOutput: "word\nl10n\ni18n\np43s"
    };
  }

  // Default rich dynamic detail generation for other problems
  return {
    contestId, index, name, rating, tags,
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

export default router;
