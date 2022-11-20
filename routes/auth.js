import express from "express";
import { signupGet, signupPost, signinGet, signinPost } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/").get(signinGet);
router.route("/api/signin").post(signinPost);
router.route('/signup').get(signupGet);
router.route("/api/signup").post(signupPost);

export default router;
