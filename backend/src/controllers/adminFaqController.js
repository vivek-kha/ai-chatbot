import Faq from "../models/Faq.js";
import FaqHistory from "../models/FaqHistory.js";

/**
 * GET /api/admin/faqs
 * Query params:
 *  - q: full text search
 *  - tag: filter by tag
 *  - category: filter by category
 *  - published: "true" | "false"
 *  - page, perPage
 */
export async function listFaqs(req, res, next) {
  try {
    const { q, tag, category, published, page = 1, perPage = 20 } = req.query;

    const filter = { deleted: false };

    if (q) filter.$text = { $search: q };
    if (tag) filter.tags = tag;
    if (category) filter.category = category;
    if (published !== undefined) {
      filter.published = published === "true";
    }

    const pageNum = Number(page) || 1;
    const limit = Number(perPage) || 20;

    const [items, total] = await Promise.all([
      Faq.find(filter)
        .sort({ updatedAt: -1 })
        .skip((pageNum - 1) * limit)
        .limit(limit),
      Faq.countDocuments(filter),
    ]);

    res.json({
      data: items,
      total,
      page: pageNum,
      perPage: limit,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/faqs/:id
 */
export async function getFaqById(req, res, next) {
  try {
    const { id } = req.params;
    const faq = await Faq.findOne({ _id: id, deleted: false });
    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }
    res.json(faq);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/faqs
 */
export async function createFaq(req, res, next) {
  try {
    const {
      question,
      answer,
      tags = [],
      category = "general",
      published = true,
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "question and answer are required" });
    }

    const faq = await Faq.create({
      question,
      answer,
      tags,
      category,
      published,
      meta: {
        createdBy: req.user?._id || null,
        updatedBy: req.user?._id || null,
      },
    });

    res.status(201).json(faq);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/faqs/:id
 */
export async function updateFaq(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await Faq.findOne({ _id: id, deleted: false });
    if (!existing) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    // Save old version to history
    await FaqHistory.create({
      faqId: existing._id,
      snapshot: existing.toObject(),
      changedBy: req.user?._id || null,
    });

    const update = {};
    const allowedFields = ["question", "answer", "tags", "category", "published"];

    for (const key of allowedFields) {
      if (key in req.body) {
        update[key] = req.body[key];
      }
    }

    update.version = (existing.version || 1) + 1;
    update["meta.updatedBy"] = req.user?._id || null;

    const updatedFaq = await Faq.findByIdAndUpdate(id, update, {
      new: true,
    });

    res.json(updatedFaq);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/faqs/:id/publish
 * Body: { published: boolean }
 */
export async function setFaqPublished(req, res, next) {
  try {
    const { id } = req.params;
    const { published } = req.body;

    if (typeof published !== "boolean") {
      return res.status(400).json({ error: "published must be boolean" });
    }

    const existing = await Faq.findOne({ _id: id, deleted: false });
    if (!existing) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      {
        published,
        "meta.updatedBy": req.user?._id || null,
      },
      { new: true }
    );

    res.json(updatedFaq);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/faqs/:id
 * Soft delete
 */
export async function softDeleteFaq(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await Faq.findOne({ _id: id, deleted: false });
    if (!existing) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    await Faq.findByIdAndUpdate(id, {
      deleted: true,
      "meta.updatedBy": req.user?._id || null,
    });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/faqs/:id/history
 * Simple history reader
 */
export async function getFaqHistory(req, res, next) {
  try {
    const { id } = req.params;
    const history = await FaqHistory.find({ faqId: id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (err) {
    next(err);
  }
}


