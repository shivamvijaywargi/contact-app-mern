import { Router } from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  updateContact,
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

router
  .route("/:contactId")
  .put(verifyToken, updateContact)
  .delete(verifyToken, deleteContact);

export default router;
