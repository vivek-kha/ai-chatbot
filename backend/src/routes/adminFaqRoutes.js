import express from "express";
import {
  listFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  setFaqPublished,
  softDeleteFaq,
  getFaqHistory,
} from "../controllers/adminFaqController.js";

const router = express.Router();

// GET /api/admin/faqs
router.get("/", listFaqs);

// GET /api/admin/faqs/:id
router.get("/:id", getFaqById);

// GET /api/admin/faqs/:id/history
router.get("/:id/history", getFaqHistory);

// POST /api/admin/faqs
router.post("/", createFaq);

// PUT /api/admin/faqs/:id
router.put("/:id", updateFaq);

// PATCH /api/admin/faqs/:id/publish
router.patch("/:id/publish", setFaqPublished);

// DELETE /api/admin/faqs/:id
router.delete("/:id", softDeleteFaq);

export default router;


