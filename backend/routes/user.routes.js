import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getUserPosts } from "../controllers/post.controller.js";
import { editProfile, getProfile, toggleFollow, getFollowers, getFollowing } from "../controllers/user.controller.js";
import upload from '../middleware/upload.middleware.js';

const router = Router();

router.get("/:userId/posts", verifyToken, upload.single("media"), getUserPosts);
router.put("/profile", verifyToken, upload.single("profilePic"), editProfile);
router.get("/profile", verifyToken, getProfile);
router.post("/:username/follow", verifyToken, toggleFollow);
router.get("/followers", verifyToken, getFollowers);
router.get("/following", verifyToken, getFollowing);

export default router;
