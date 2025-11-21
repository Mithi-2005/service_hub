import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/profile", verifyToken, (req, res) => {
  return res.json({
    message: "Protected route accessed!",
    user: req.user,
  });
});

export default router;
