import ENV from 'dotenv';
import {StreaChat} from 'stream-chat';
const api_key = ENV.STREAM_API_KEY;
const api_secret = ENV.Stream_API_Secret;

if(!api_key || !api_secret){
    throw new Error("Stream API key and secret are required");
}

export const ChatClient = new StreamChat.getInstance(api_key,api_secret); 

export const upsertUser= async(userData)=>{
    try {
        await ChatClient.upsertUser(userData);
        console.log(`User upserted to Stream Chat : ${userData}`);
    } catch (error) {
        console.error("Error upserting user to Stream Chat : ", error);
        throw error;
    }
}

export const DeleterUser= async(userId)=>{  
    try{
        await ChatClient.deleteUser(userId);
        console.log(`User deleted from Stream Chat : ${userId}`);
    }catch(error){
        console.error("Error deleting user from Stream Chat : ", error);
        throw error;
    }
}