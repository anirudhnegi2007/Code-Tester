import { chatClient, streamApiKey } from "../lib/stream.js";

export async function getStreamToken(req,res) {

   try{
    const token =chatClient.createToken(req.user._id.toString());

    res.status(200).json({
        token,
        apiKey: streamApiKey,
        userId :req.user._id.toString(),
        userName: req.user.name,
        userImage: req.user.profileImage
    })

   } catch (err) {
    console.log("Error in getStreamController", err.message);
    res.status(500).json({ message: "Internal error generating Stream Token" });
   }

}