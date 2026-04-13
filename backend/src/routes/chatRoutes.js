import express from "express"
import { getStreamToken } from "../controllers/chatController.js";
import { verifyFirebaseToken } from "../middleware/auth.js";
const router=express.Router();
// /api/chat/token
router.get("/token",verifyFirebaseToken,getStreamToken)

export default router