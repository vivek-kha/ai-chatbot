import Faq from "../models/Faq.js";

export async function findRelevantFaqs(userMessage, limit = 3) {
  const keywords = userMessage.toLowerCase().split(/\s+/).filter((w) => w.length > 3);

  if (!keywords.length) return [];

  // very simple search using regex OR
  const regexes = keywords.map((k) => new RegExp(k, "i"));
  const faqs = await Faq.find({
    published: true, // Only search published FAQs
    $or: [
      { question: { $in: regexes } },
      { answer: { $in: regexes } },
      { tags: { $in: keywords } },
    ],
  }).limit(limit);

  return faqs;
}
