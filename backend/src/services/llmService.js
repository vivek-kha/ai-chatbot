import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Support both OpenAI and Groq (free alternative)
// For Groq: Use baseURL: "https://api.groq.com/openai/v1"
// For OpenAI: Use default (no baseURL needed)
const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
const baseURL = process.env.LLM_BASE_URL || undefined;
const LLM_TIMEOUT = parseInt(process.env.LLM_TIMEOUT_MS, 10) || 30000;

if (!apiKey) {
  console.error("⚠️ WARNING: No API key found! Please set OPENAI_API_KEY or GROQ_API_KEY in .env file");
}

let client;
try {
  client = new OpenAI({ 
    apiKey: apiKey,
    baseURL: baseURL, // Set to "https://api.groq.com/openai/v1" for Groq
  });
} catch (error) {
  console.error("Failed to initialize OpenAI client:", error);
  client = null;
}

export async function generateSupportResponse({ conversation, faqs, userMessage }) {
  if (!client) {
    throw new Error("LLM client not initialized. Please check your API key in .env file");
  }

  if (!apiKey) {
    throw new Error("No API key found. Please set OPENAI_API_KEY or GROQ_API_KEY in .env file");
  }

  const systemPrompt = `
You are an AI customer support bot for ACME Corp.
Use the FAQs when relevant. If you are not confident, say you will escalate.
Always be concise and friendly.
`;

  const faqContext = faqs.length > 0
    ? `Relevant FAQs:\n${faqs
        .map((f, i) => `${i + 1}. Q: ${f.question}\n   A: ${f.answer}`)
        .join("\n")}`
    : "No relevant FAQs found.";

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "system",
      content: faqContext,
    },
    ...conversation.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    {
      role: "user",
      content: userMessage,
    },
  ];

  // Use model from env or default to gpt-3.5-turbo (OpenAI) or llama-3.1-8b-instant (Groq)
  const model = process.env.LLM_MODEL || "gpt-3.5-turbo";
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LLM_TIMEOUT);

  try {
    console.log(`Calling LLM with model: ${model}, baseURL: ${baseURL || 'default'}`);
    const response = await client.chat.completions.create(
      {
        model: model,
        messages: messages,
      },
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response || !response.choices || !response.choices[0]) {
      throw new Error("Invalid response from LLM API");
    }

    const replyText = response.choices[0].message.content;

    return replyText;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("LLM request timeout. Please try again.");
    }

    console.error("LLM API Error Details:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.constructor.name
    });
    
    if (error.status === 401 || error.code === 'invalid_api_key') {
      throw new Error("Invalid API key. Please check your GROQ_API_KEY or OPENAI_API_KEY in .env file");
    }
    if (error.status === 429 || error.code === 'insufficient_quota') {
      throw new Error("API quota exceeded. Your OpenAI account has no credits. Please add billing or switch to Groq (free) - see SWITCH_TO_GROQ.md");
    }
    if (error.message.includes('model')) {
      throw new Error(`Invalid model name: ${model}. Please check LLM_MODEL in .env file`);
    }
    throw new Error(`LLM service error: ${error.message}`);
  }
}

export async function summariseConversationForEscalation({ conversation }) {
  const conversationText = conversation
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const model = process.env.LLM_MODEL || "gpt-3.5-turbo";
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LLM_TIMEOUT);

  try {
    const response = await client.chat.completions.create(
      {
        model: model,
        messages: [
          {
            role: "system",
            content:
              "You are creating an escalation note for a human support agent. Summarise the issue, what has been tried, and the user's sentiment.",
          },
          {
            role: "user",
            content: conversationText,
          },
        ],
      },
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    return response.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("LLM request timeout. Please try again.");
    }

    console.error("LLM API Error (escalation):", error.message);
    throw new Error(`Failed to generate escalation summary: ${error.message}`);
  }
}
