import { Router } from "express";
import { createContact } from "../controllers/contact.controller";
import verifyToken from "../middlewares/auth.middleware";

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/contacts
 */
router.route("/").post(verifyToken, createContact);

export default router;
