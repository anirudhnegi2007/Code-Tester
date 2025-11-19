import express from "express";
import User from "../models/user.model.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

// Save user after Firebase login/signup
router.post("/save", verifyFirebaseToken, async (req, res) => {
  const { uid, name, email } = req.user;

  try {
    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      user = await User.create({
        firebaseUID: uid,
        name: name || "",
        email: email || "",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
