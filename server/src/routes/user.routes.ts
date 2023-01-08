import { Router } from "express";
import ROLES_LIST from "../configs/ROLES_LIST";
import { getAllUsers, getMe } from "../controllers/user.controller";
import verifyToken, { authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/users
 */
router
  .route("/")
  .get(verifyToken, authorizeRoles(ROLES_LIST.ADMIN), getAllUsers);
router.route("/me").get(verifyToken, getMe);

export default router;
