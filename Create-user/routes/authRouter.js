import { Router } from "express";
import {
  createUser,
  verifyEmail,
  loginUser,
} from "../Controllers/controller.js";

import { ensureIsAutenticated } from "../Middleware/auth-middleware.js";
const router = Router();
router.post("/create-user", createUser);
router.post("/verify-email", verifyEmail);
router.post("/login-user", loginUser);

router.get("/protected", ensureIsAutenticated, (req, res) => {
  res.status(200).json({ message: "protected route" });
});

export default router;
