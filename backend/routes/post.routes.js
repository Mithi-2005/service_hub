import express from 'express'
import { createPost } from '../controllers/post.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js'

const router = express.Router()

router.post("/create", verifyToken, upload.single("media"), createPost);

export default router