import { NextFunction, Request, Response } from "express";

import asyncHandler from "../middlewares/asyncHandler.middleware";
import Contact from "../models/Contact.model";
import User from "../models/User.model";
import AppErr from "../utils/AppErr";

/**
 * @GET_ALL_CONTACTS
 * @ROUTE @GET {{URL}}/api/v1/contacts
 * @returns All logged in users saved contacts
 * @ACCESS Private (Logged in user only)
 */
export const getAllContacts = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    const contacts = await Contact.find({});

    if (!contacts.length) {
      return next(new AppErr("No contacts found", 404));
    }

    res.status(200).json({
      success: true,
      message: "All contacts fetched",
      contacts,
    });
  }
);

/**
 * @CREATE_CONTACT
 * @ROUTE @POST {{URL}}/api/v1/contacts
 * @returns Creates a new contact
 * @ACCESS Private (Logged in user only)
 */
export const createContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.user_id;
    const { name, email, phoneNumber } = req.body;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return next(new AppErr("User not found", 404));
    }

    if (!name || !phoneNumber) {
      return next(new AppErr("Name and Phone Number are required", 400));
    }

    const existingContact = await Contact.findOne({ phoneNumber }).lean();

    if (existingContact) {
      return next(new AppErr("Phone number already exist", 209));
    }

    const contact = await Contact.create({
      name,
      email,
      phoneNumber,
      user: userId,
    });

    if (!contact) {
      return next(new AppErr("Something went wrong, please try again", 400));
    }

    existingUser.contacts.push(contact);

    await existingUser.save();

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
    });
  }
);

/**
 * @UPDATE_CONTACT
 * @ROUTE @PUT {{URL}}/api/v1/contacts/:id
 * @returns Updates existing contact
 * @ACCESS Private (Logged in user only)
 */
export const updateContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber } = req.body;
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return next(new AppErr("Contact does not exist", 404));
    }

    const updateContact = await Contact.findByIdAndUpdate(
      contactId,
      {
        $set: {
          name,
          email,
          phoneNumber,
        },
      },
      {
        new: true,
      }
    );

    if (!updateContact) {
      return next(new AppErr("Something went wrong, please try again.", 400));
    }

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      updateContact,
    });
  }
);

/**
 * @DELETE_CONTACT
 * @ROUTE @DELETE {{URL}}/api/v1/contacts/:id
 * @returns deletes existing contact
 * @ACCESS Private (Logged in user only)
 */
export const deleteContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return next(new AppErr("Contact does not exist", 404));
    }

    const deleteContact = await Contact.findByIdAndDelete(contactId);

    if (!deleteContact) {
      return next(new AppErr("Something went wrong, please try again.", 400));
    }

    res.status(200).json({
      success: true,
      message: `Contact deleted successfully`,
    });
  }
);
