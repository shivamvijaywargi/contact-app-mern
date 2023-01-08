import { Router } from "express";
import { createContact } from "../controllers/contact.controller";

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/contacts
 */
router.route("/").post(createContact);

export default router;
