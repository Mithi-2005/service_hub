import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from 'dotenv'
// import path from 'path'

// dotenv.config({ path: path.resolve(__dirname, '.env') })

dotenv.config()

connectDB()

app.listen(process.env.PORT, ()=>{
    console.log(`Running at http://localhost:${process.env.PORT}`)
})