import express from "express";
import Faq from "../models/Faq.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/admin/faqs - List FAQs with pagination, search, filter
router.get("/faqs", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;

    // Build query
    const query = {};

    // Search in question/answer
    if (req.query.q) {
      query.$or = [
        { question: { $regex: req.query.q, $options: "i" } },
        { answer: { $regex: req.query.q, $options: "i" } },
      ];
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    // Filter by published status
    if (req.query.published !== undefined && req.query.published !== "all") {
      query.published = req.query.published === "true";
    }

    const [faqs, total] = await Promise.all([
      Faq.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),
      Faq.countDocuments(query),
    ]);

    res.json({
      data: faqs,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

// GET /api/admin/faqs/:id - Get single FAQ
router.get("/faqs/:id", async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }
    res.json(faq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch FAQ" });
  }
});

// POST /api/admin/faqs - Create new FAQ
router.post("/faqs", async (req, res) => {
  try {
    const { question, answer, tags, category, published } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    const faq = await Faq.create({
      question,
      answer,
      tags: tags || [],
      category: category || "general",
      published: published !== undefined ? published : true,
      version: 1,
    });

    res.status(201).json(faq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create FAQ" });
  }
});

// PUT /api/admin/faqs/:id - Update FAQ
router.put("/faqs/:id", async (req, res) => {
  try {
    const { question, answer, tags, category, published } = req.body;

    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    // Increment version on update
    const updateData = {
      question: question || faq.question,
      answer: answer || faq.answer,
      tags: tags || faq.tags,
      category: category || faq.category,
      published: published !== undefined ? published : faq.published,
      version: faq.version + 1,
    };

    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedFaq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update FAQ" });
  }
});

// PATCH /api/admin/faqs/:id/publish - Toggle publish status
router.patch("/faqs/:id/publish", async (req, res) => {
  try {
    const { published } = req.body;
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      { published },
      { new: true }
    );

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.json(faq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update publish status" });
  }
});

// DELETE /api/admin/faqs/:id - Delete FAQ
router.delete("/faqs/:id", async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }
    res.json({ message: "FAQ deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
});

// GET /api/admin/sessions - list recent sessions with user and message summaries
router.get("/sessions", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.perPage) || 20, 100);
    const skip = (page - 1) * perPage;

    const [sessions, total] = await Promise.all([
      Session.find({})
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate("user", "email name")
        .lean(),
      Session.countDocuments({}),
    ]);

    const data = sessions.map((s) => {
      const lastUser = [...(s.messages || [])].reverse().find((m) => m.role === "user");
      const lastAssistant = [...(s.messages || [])]
        .reverse()
        .find((m) => m.role === "assistant");
      return {
        id: s._id,
        sessionId: s.sessionId,
        userEmail: s.userEmail || s.user?.email || null,
        userName: s.userName || s.user?.name || null,
        status: s.status,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        messageCount: s.messages?.length || 0,
        lastUserMessage: lastUser?.content || null,
        lastAssistantMessage: lastAssistant?.content || null,
      };
    });

    res.json({
      data,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

export default router;

