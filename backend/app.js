import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from 'url'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.routes.js'
import connectDB from './config/db.js'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/",authRouter);
app.use("/",userRouter);


export default app