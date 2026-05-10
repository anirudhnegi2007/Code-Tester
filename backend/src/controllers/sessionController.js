import Session from "../models/Session.js";
import { streamClient, chatClient } from "../lib/stream.js";

export async function createSession(req, res) {
  // to create a new session
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ error: "Problem and difficulty are required" });
    }
    // generate unique callId for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substr(7)}`;
    // create session in database
    const newSession = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    // create stream video call for the session
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        sessionId: newSession._id.toString(),
        custom: { problem, difficulty, host: userId.toString() },
      },
    });

    // chat messaging
    await chatClient.channel("messaging", callId, {
      name: ` ${problem} - ${difficulty} Session`,
      members: [userId.toString()],
    });

    await channel.create();

    res.status(201).json({ session: newSession });
  } catch (error) {
    res.status(500).json({ error: "Failed to create session" });
    console.error("Error creating session: ", error);
  }
}

export async function getActiveSessions(req, res) {
  // to get all active sessions
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "username")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
    console.error("Error fetching sessions: ", error);
  }
}

export async function getRecentSessions(req, res) {
  // to get recent sessions of the user
  try {
    const userId = req.user._id;
    // get sessions where user is host or participant
    await Session.find({
      status: "completed",
      $or: [{ host: userId }, { Participants: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent sessions" });
    console.error("Error fetching recent sessions: ", error);
  }
}

export async function getSessionById(req, res) {
  // to get a session by its ID
  try{
    const { id } = req.params;
    const session = await Session.findById(id)
    .populate("host", "username")
    .populate("participants", "username");
     if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

  }catch(error){
    res.status(500).json({ error: "Failed to fetch session" });
    console.error("Error fetching session: ", error);
  }
}

export async function joinSession(req, res) {
  // to join a session by its ID
try {
    const { id } = req.params;
  const userId = req.user._id;
  const session = await Session.findById(id);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

    if (session.participant) return res.status(400).json({ error: "Session is already full" });
  session.participants = userId;
  await session.save();
const channel = await chatClient.channel("messaging", session.callId);
await channel.addMembers([userId.toString()]);
  res.status(200).json({ session });

}catch(error){
    res.status(500).json({ error: "Failed to join session" });
    console.error("Error joining session: ", error);
  }
  
}

export async function endSession(req, res) {
  // to delete a session by its ID
  try{
const { id } = req.params;
const userId = req.user._id;
const session = await Session.findById(id);

if (!session) {
  return res.status(404).json({ error: "Session not found" });
}
// only host can end the session
if (session.host.toString() !== userId.toString()) {
  return res.status(403).json({ error: "Only host can end the session" });
}
if (session.status === "completed") {
  return res.status(400).json({ error: "Session is already completed" });
}
session.status = "completed";
await session.save();
// delete  chat channel
const channel = await chatClient.channel("messaging", session.callId);
await channel.delete({hard:true});
// delete stream video call
const call= await streamClient.video.call("default", session.callId);
await call.delete({hard:true});
res.status(200).json({ message: "Session ended successfully" });

  }catch(error){
    res.status(500).json({ error: "Failed to end session" });
    console.error("Error ending session: ", error);
  }



}


