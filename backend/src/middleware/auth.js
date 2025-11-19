import admin from "../firebase/firebaseAdmin.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken; // { uid, email, name, etc. }
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
