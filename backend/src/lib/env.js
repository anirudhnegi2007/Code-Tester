import dotenv from"dotenv";
dotenv.config();
export const ENV={
    PORT:process.env.PORT,
    DB_URL:process.env.DB_URL,
    NODE_ENV:process.env.NODE_ENV,
    FRONTEND_URL:process.env.FRONTEND_URL,
    Stream_API_Secret:process.env.STREAM_API_SECRET,
    Stream_API_Key:process.env.STREAM_API_KEY,

    

}