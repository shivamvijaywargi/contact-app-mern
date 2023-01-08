import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/auth
 */
router.route("/new").post(registerUser);
router.route("/").post(loginUser);
router.route("/reset").post(forgotPassword);
router.route("/reset/:token").post(resetPassword);

export default router;