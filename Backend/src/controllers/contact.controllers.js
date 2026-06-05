import { Contact } from "../models/Contact.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError }     from "../utils/ApiError.js";
import { ApiResponse }  from "../utils/ApiResponse.js";
import { sendContactEmail } from "../utils/mailer.js";

// ─── User: Submit contact message ─────────────────────────────────────────────
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, "All fields are required");
  }

  const contact = await Contact.create({ name, email, message });

  // Auto-reply to the sender
  await sendContactEmail({ name, email, message });

  return res.status(201).json(new ApiResponse(201, contact, "Message sent successfully"));
});

// ─── Admin: Get all contact messages ──────────────────────────────────────────
export const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, contacts, "Contacts fetched"));
});

// ─── Admin: Mark message as read ──────────────────────────────────────────────
export const markContactRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!contact) throw new ApiError(404, "Message not found");
  return res.status(200).json(new ApiResponse(200, contact, "Marked as read"));
});