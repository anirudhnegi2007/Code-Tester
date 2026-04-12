import { ENV } from "./env.js";

import {StreamChat} from 'stream-chat';
const api_key = ENV.Stream_API_Key;
const api_secret = ENV.Stream_API_Secret;

if(!api_key || !api_secret){
    throw new Error("Stream API key and secret are required");
}

export const ChatClient =  StreamChat.getInstance(api_key,api_secret); 

export const upsertUser= async(userData)=>{
    try {
        const result = await ChatClient.upsertUser(userData);
        // console.log(`User upserted to Stream Chat : ${userData}`);
        console.log("User data received:", JSON.stringify(userData, null, 2));
    } catch (error) {
        console.error("Error upserting user to Stream Chat : ", error);
        throw error;
    }
}

export const DeleteUser= async(userId)=>{  
    try{
        await ChatClient.deleteUser(userId);
        console.log(`User deleted from Stream Chat : ${userId}`);
    }catch(error){
        console.error("Error deleting user from Stream Chat : ", error);
        throw error;
    }
}