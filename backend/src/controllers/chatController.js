import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req,res) {

   try{
    const token =chatClient.createToken(req.user.uid);

    res.status(200).json({
        token,
        userId :req.user.uid,
        userName: req.user.name,
        userImage: req.user.profileImage
    })

   } catch (err) {
    console.log("Error in getStreamController", err.message);
    res.status(500).json({ message: "Internal error generating Stream Token" });
   }

}