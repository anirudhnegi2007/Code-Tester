import express from "express";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/", verifyFirebaseToken, createSession);
router.get("/", verifyFirebaseToken, getActiveSessions );


export default router;