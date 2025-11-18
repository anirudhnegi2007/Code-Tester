import mongoose from 'mongoose';

import {ENV} from './env.js';

// Function to connect to the database  
export const connectDB= async()=>{
    try {
       const con= await mongoose.connect(ENV.DB_URL);
       console.log("Connected to mongoDB",con.connection.host)
    }
    catch(error){
        console.error("Error connecting to mongoDB", error);
        process.exit(1);

    }
}