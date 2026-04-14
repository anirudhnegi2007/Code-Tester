import { Inngest } from "inngest";
import { connectDB } from "./DB.js";
import User from "../models/user.model.js";

import { upsertUser , DeleteUser } from "./stream.js";

export const inngest = new Inngest({ id: "Code_Tester" });

//  CREATE USER DB + STREAM
const syncUserData = inngest.createFunction(
  {
    id: "sync_user_data",
    triggers: { event: "user.created" },
  },
  async ({ event, step }) => {

    const { uid, name, email, profileImage } = event.data;

    // DB
    await step.run("connect-db", async () => {
      await connectDB();
    });

    await step.run("create-user-db", async () => {
      return await User.create({
        firebaseUID: uid,
        name: name || "",
        email: email || "",
        profileImage: profileImage || "",
      });
    });

    // STREAM CHAT
    await step.run("create-stream-user", async () => {
      await streamClient.upsertUser({
        id: uid,
        name: name || "",
        image: profileImage || "",
      });
    });

    //   email service  need to add 
  }
);

//  DELETE USER DB + STREAM
const deleteUser = inngest.createFunction(
  {
    id: "delete_user",
    triggers: { event: "user.deleted" },
  },
  async ({ event, step }) => {

    const { uid } = event.data;

    await step.run("connect-db", async () => {
      await connectDB();
    });

    await step.run("delete-db-user", async () => {
      return await User.findOneAndDelete({ firebaseUID: uid });
    });

    await step.run("delete-stream-user", async () => {
      await streamClient.deleteUser(uid.ToString());
    });
  }
);


export const functions = [syncUserData, deleteUser];