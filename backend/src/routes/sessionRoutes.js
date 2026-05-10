import express from "express";
import { verifyFirebaseToken } from "../middleware/auth.js";
import { createSession, getActiveSessions, getRecentSessions, getSessionById, joinSession, endSession } from "../controllers/sessionController.js";

const router = express.Router();
router.post("/", verifyFirebaseToken, createSession);
router.get("/active", verifyFirebaseToken, getActiveSessions );
router.get("/recent", verifyFirebaseToken, getRecentSessions);
router.get("/:id", verifyFirebaseToken, getSessionById);
router.post("/:id/join", verifyFirebaseToken, joinSession);
router.post("/:id/end", verifyFirebaseToken, endSession);


export default router;