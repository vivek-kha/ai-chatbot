import Faq from "../models/Faq.js";

export async function getAllFaqs(req, res, next) {
  try {
    const faqs = await Faq.find({});
    return res.json(faqs);
  } catch (err) {
    next(err);
  }
}


