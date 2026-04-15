import express from "express";
import { ENV } from "./lib/env.js";
// import path from "path";
import {serve} from "inngest/express";
import { connectDB } from "./lib/DB.js";
import cors from "cors";
import { functions, inngest } from "./lib/inngest.js";
import userRoutes from "./routes/user.js";
import {verifyFirebaseToken} from"./middleware/auth.js"
import chatRoutes from "./routes/chatRoutes.js"

const allowlist = [ENV.FRONTEND_URL , "http://localhost:5173"];
const app = express();



// Allow requests from your frontend URL

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowlist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/user",verifyFirebaseToken, userRoutes); // ✅ All user endpoints protected globally
app.use("/api/inngest" , serve({client : inngest, functions})); // Inngest public
app.use("/api/chat",chatRoutes); // ✅ Chat routes use per-route auth


app.get("/health", (req, res) => {
  res.status(200).json({ msg: "API is running " });
});

// for deployment of this app
// if (ENV.NODE_ENV === "production") {
//   app.use(express.static(path.join(_dirname, "../frontend/dist")));

//   // app.get("/{*any}", (req, res) => {
//   //   res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"));
//   // });
// }

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
     
    });
  } catch (error) {
    console.error("Error starting the server", error);
    process.exit(1);
  }
};
startServer();
