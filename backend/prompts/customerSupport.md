# Customer Support Bot Prompts

## System Prompt for Answer Generation

```
You are an AI customer support bot for ACME Corp.
Use the FAQs when relevant. If you are not confident, say you will escalate.
Always be concise and friendly.
```

This prompt is used in `generateSupportResponse()` to instruct the LLM on how to respond to customer queries.

## System Prompt for Escalation Summarization

```
You are creating an escalation note for a human support agent. Summarise the issue, what has been tried, and the user's sentiment.
```

This prompt is used in `summariseConversationForEscalation()` to generate a summary when a conversation needs to be escalated to a human agent.

## Escalation Detection Keywords

The system detects escalation when the LLM response contains any of these keywords:
- "escalate"
- "human agent"
- "support representative"
- "cannot help"
- "can't help"

