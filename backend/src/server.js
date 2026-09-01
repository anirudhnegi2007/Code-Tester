import express from "express";
import { ENV } from "./lib/env.js";
import { serve } from "inngest/express";
import { connectDB } from "./lib/DB.js";
import cors from "cors";
import { functions, inngest } from "./lib/inngest.js";
import userRoutes from "./routes/user.js";
import { verifyFirebaseToken } from "./middleware/auth.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import problemRoutes from "./routes/problems.js";
import { rateLimit } from "express-rate-limit";

const cleanOrigin = (url) => (url ? url.trim().replace(/\/$/, "") : "");

const staticAllowlist = [
  cleanOrigin(ENV.FRONTEND_URL),
  "http://localhost:5173",
  "http://localhost:3000",
  "https://code-tester-kappa.vercel.app"
].map(cleanOrigin).filter(Boolean);

const app = express();

// Trust reverse proxies (Render, Vercel, Cloudflare, Nginx)
app.set("trust proxy", 1);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser / server-to-server / curl requests
  const cleaned = cleanOrigin(origin);
  if (staticAllowlist.includes(cleaned)) return true;
  // Allow all Vercel deployment preview URLs & Render origins
  if (cleaned.endsWith(".vercel.app") || cleaned.endsWith(".onrender.com")) return true;
  // Allow all local network / private IP origins (e.g. http://192.168.x.x:5173, http://10.x.x.x:5173, etc.)
  const isLanOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/i;
  if (isLanOrigin.test(cleaned)) return true;
  return false;
};

// Configure rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limit each IP to 200 requests per windowMs
  message: { msg: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configure CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

app.use(express.json());
app.use(limiter);

// Routes
app.use("/api/user", verifyFirebaseToken, userRoutes);
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/problems", problemRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "API is running" });
});

// Global Error Handler to guarantee CORS headers on internal errors
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  const reqOrigin = req.headers.origin;
  if (reqOrigin && isOriginAllowed(reqOrigin)) {
    res.header("Access-Control-Allow-Origin", reqOrigin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT || 3000, () => {
      console.log(`Server is running on port ${ENV.PORT || 3000}`);
    });
  } catch (error) {
    console.error("Error starting the server", error);
    process.exit(1);
  }
};

startServer();

