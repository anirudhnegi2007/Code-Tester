import express from "express";
import { ENV } from "./lib/env.js";
// import path from "path";
import {serve} from "inngest/express";
import { connectDB } from "./lib/DB.js";
import cors from "cors";
import { functions, inngest } from "./lib/inngest.js";

const app = express();

app.use(express.json());

// Allow requests from your frontend URL
app.use(cors({
  origin: ENV.FRONTEND_URL, 
  credentials: true, // if using cookies or auth headers
}));


app.use("/api/inngest" , serve({client : inngest, functions}));

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
