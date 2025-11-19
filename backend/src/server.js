import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/DB.js";
const _dirname = path.resolve();

const app = express();

app.use(express.json());

// Allow requests from your frontend URL
app.use(cors({
  origin: "https://code-tester-teal.vercel.app/", 
  credentials: true, // if using cookies or auth headers
}));



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
