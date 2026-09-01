import admin from "../firebase/firebaseAdmin.js";
import User from "../models/user.model.js";
import { upsertUser } from "../lib/stream.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Authenticated user:", decodedToken.uid);
    
    req.user = decodedToken; // { uid, email, name, etc. }

    let dbUser = await User.findOne({ firebaseUID: decodedToken.uid });
    if (!dbUser) {
      dbUser = await User.create({
        firebaseUID: decodedToken.uid,
        name: decodedToken.name || decodedToken.email?.split("@")[0] || "User",
        email: decodedToken.email || "",
      });
      try {
        await upsertUser({
          id: decodedToken.uid,
          name: dbUser.name,
          email: dbUser.email,
        });
      } catch (streamErr) {
        console.error("Stream upsert warning in auth middleware:", streamErr.message);
      }
    }
    req.user._id = dbUser._id;
    req.user.name = dbUser.name || decodedToken.name;

    next();
  } catch (err) {
    console.log("Auth verification error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
 