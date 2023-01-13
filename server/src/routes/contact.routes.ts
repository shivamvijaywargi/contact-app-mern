import { Router } from "express";
import ROLES_LIST from "../configs/ROLES_LIST";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getLoggedInUserContacts,
  updateContact,
} from "../controllers/contact.controller";
import verifyToken, { authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/contacts
 */
router
  .route("/")
  .post(verifyToken, createContact)
  .get(verifyToken, authorizeRoles(ROLES_LIST.ADMIN), getAllContacts);

router.route("/user").get(verifyToken, getLoggedInUserContacts);

router
  .route("/:contactId")
  .put(verifyToken, updateContact)
  .delete(verifyToken, deleteContact);

export default router;
