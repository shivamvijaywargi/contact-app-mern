import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/users
 */
router.route("/").get(getAllUsers);

export default router;
