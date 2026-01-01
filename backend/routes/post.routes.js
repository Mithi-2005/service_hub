import express from 'express'
import { createPost, getFeed, toggleLike, addComment, getComments, getPostDetails, replytoComment, toggleRepost, deletePost } from '../controllers/post.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js'

const router = express.Router()

router.post("/create", verifyToken, upload.single("media"), createPost);
router.get("/feed", verifyToken, getFeed);
router.post("/:id/like", verifyToken, toggleLike);
router.post("/:id/comment", verifyToken, addComment);
router.post("/:id/repost", verifyToken, toggleRepost);
router.delete("/:id/delete", verifyToken, deletePost);
router.post("/:id/comments/:commentId/reply", verifyToken, replytoComment);
router.get("/:id/comments", verifyToken, getComments);
router.get("/:id", verifyToken, getPostDetails);

export default router