import express from "express";
import { ENV } from "./lib/env.js";
console.log(ENV.PORT);
console.log(ENV.DB_URL);



const app= express();

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"API is running "})

})

app.listen(ENV.PORT,()=>{
    console.log("server running on port",ENV.PORT);
    
})

export default app;
