import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";

const _dirname=path.resolve()


const app= express();

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"API is running "})

})

// for deployment of this app
if (ENV.NODE_ENV=== "production"){
    app.use(express.static(path.join(_dirname,"../frontend/dist")))

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(_dirname,"../frontend","dist","index.html"))
    })
}

app.listen(ENV.PORT,()=>{
    console.log("server running on port",ENV.PORT);
    
})


// export default app;


