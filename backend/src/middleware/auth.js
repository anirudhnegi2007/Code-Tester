import admin from "../firebase/firebaseAdmin.js";
import User from "../models/user.model.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Authenticated user:", decodedToken.uid);
    
    req.user = decodedToken; // { uid, email, name, etc. }

    const dbUser = await User.findOne({ firebaseUID: decodedToken.uid });
    if (dbUser) {
      req.user._id = dbUser._id;
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
 