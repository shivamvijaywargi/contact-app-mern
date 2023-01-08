import { Router } from "express";
import {
  createContact,
  getAllContacts,
} from "../controllers/contact.controller";
import verifyToken from "../middlewares/auth.middleware";

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/contacts
 */
router
  .route("/")
  .post(verifyToken, createContact)
  .get(verifyToken, getAllContacts);

export default router;
