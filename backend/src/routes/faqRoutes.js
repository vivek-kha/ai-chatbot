import express from "express";
import Faq from "../models/Faq.js";

const router = express.Router();

// GET /api/faqs - Return only published FAQs (public endpoint)
router.get("/", async (req, res) => {
  try {
    const faqs = await Faq.find({ published: true });
    res.json(faqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

export default router;
