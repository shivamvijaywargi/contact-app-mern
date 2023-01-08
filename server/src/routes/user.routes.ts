import { Router } from "express";
import { getAllUsers, getMe } from "../controllers/user.controller";
import verifyToken from "../middlewares/auth.middleware";

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/users
 */
router.route("/").get(getAllUsers);
router.route("/me").get(verifyToken, getMe);

export default router;
