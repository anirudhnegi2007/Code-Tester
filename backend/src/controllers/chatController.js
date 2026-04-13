import { ChatClient } from "../lib/stream.js";

export async function getStreamToken(req,res) {

   try{
    const token =ChatClient.createToken(req.user.uid);

    res.status(200).json({
        token,
        userId :req.user.uid,
        userName: req.user.name,
        userImage: req.user.profileImage
    })

   }catch(err){
    console.log("Error in getStreamController" ,error.message)
    res.status(500).json({ message : " internal error Stream Token"})
   }

}