import { Inngest } from "inngest";
import { connectDB } from "./DB.js";
import User from "../models/user.model.js";

export const inngest = new Inngest({ id: "Code_Tester" });

//  Create User
const syncUserData = inngest.createFunction(
  {
    id: "sync_user_data",
    triggers: { event: "user.created" },
  },
  async ({ event, step }) => {
    await step.run("connect-db", async () => {
      await connectDB();
    });

    const { uid, name, email, profileImage } = event.data;

    await step.run("create-user", async () => {
      return await User.create({
        firebaseUID: uid,
        name: name || "",
        email: email || "",
        profileImage: profileImage || "",
      });
    });
  }
);

// Delete User
const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete_user_from_db",
    triggers: { event: "user.deleted" },
  },
  async ({ event, step }) => {
    await step.run("connect-db", async () => {
      await connectDB();
    });

    const { uid } = event.data;

    await step.run("delete-user", async () => {
      return await User.findOneAndDelete({ firebaseUID: uid });
    });
  }
);


export const functions = [syncUserData, deleteUserFromDB];