# AI Customer Support Bot

An AI-powered customer support bot built with the MERN stack (MongoDB, Express.js, React, Node.js) and integrated with OpenAI's GPT-3.5-turbo. The bot features contextual memory, FAQ integration, automatic escalation detection, and a modern chat interface.

## Project Overview

This application provides an intelligent customer support system that:
- Answers customer questions using context from FAQs and conversation history
- Maintains session-based contextual memory across conversations
- Automatically detects when to escalate to human agents
- Generates escalation summaries for human support agents
- Provides a clean, modern React-based chat interface

## Architecture

### Tech Stack

- **MongoDB** - Stores FAQs, sessions, and messages
- **Express.js (Node.js)** - REST APIs, LLM integration, business logic
- **React** - Chat UI with session management
- **OpenAI GPT-3.5-turbo** - Powers:
  - Contextual question answering
  - Conversation summarization for escalation
  - Intelligent response generation

### System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React     │────────▶│   Express    │────────▶│  MongoDB    │
│  Frontend   │  HTTP   │    Server    │  ODM    │  Database   │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              │ API Calls
                              ▼
                        ┌──────────────┐
                        │   OpenAI     │
                        │   GPT-3.5    │
                        └──────────────┘
```

### How Sessions Work

1. **Session Creation**: Each conversation starts with a unique `sessionId` stored in MongoDB
2. **Context Management**: The last 6 messages from a session are loaded and passed to the LLM for context
3. **Message Storage**: All user and assistant messages are stored in the session's `messages` array
4. **Escalation Tracking**: When escalation is detected, the session status changes to "escalated" and a summary is generated

### Data Flow

1. User sends a message → Frontend calls `/api/chat`
2. Backend loads session from MongoDB (or creates new one)
3. FAQ service finds relevant FAQs using keyword matching
4. Last 6 messages are extracted for context
5. LLM service generates response using FAQs + conversation context
6. Escalation detection checks response for keywords
7. If escalated, summary is generated and session status updated
8. Response returned to frontend with escalation status

## LLM Prompts

The system uses two main prompts (documented in `backend/prompts/customerSupport.md`):

### 1. Answer Generation Prompt
```
You are an AI customer support bot for ACME Corp.
Use the FAQs when relevant. If you are not confident, say you will escalate.
Always be concise and friendly.
```

### 2. Escalation Summarization Prompt
```
You are creating an escalation note for a human support agent. 
Summarise the issue, what has been tried, and the user's sentiment.
```

## Setup & Run

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=mongodb://localhost:27017/ai-support-bot
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

4. Start the server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
or
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser (powered by Vite).

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ai-support-bot` |
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-...` |
| `PORT` | Backend server port | `5000` |

## API Endpoints

### Sessions

#### Create New Session
```http
POST /api/chat/session
```

**Response:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Get Session
```http
GET /api/chat/session/:sessionId
```

**Response:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "active",
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "meta": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "lastUserQuestion": "Hello",
  "escalationNote": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Chat

#### Send Message
```http
POST /api/chat
Content-Type: application/json

{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "How do I reset my password?"
}
```

**Response:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "reply": "To reset your password, please visit the login page and click 'Forgot Password'...",
  "escalated": false,
  "suggestedNextActions": [
    "Ask a follow-up question",
    "Rate this answer (if UI supports rating)"
  ],
  "status": "active"
}
```

**Escalated Response:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "reply": "I understand your concern. Let me escalate this to a human agent who can better assist you.",
  "escalated": true,
  "suggestedNextActions": [
    "Wait for a human agent to respond",
    "Provide additional details if requested"
  ],
  "status": "escalated"
}
```

### FAQs

#### Get All FAQs
```http
GET /api/faqs
```

**Response:**
```json
[
  {
    "_id": "...",
    "question": "How do I reset my password?",
    "answer": "Visit the login page and click 'Forgot Password'...",
    "tags": ["password", "account", "login"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Demo Scenarios

### Scenario 1: FAQ-Based Question

1. **User asks**: "How do I reset my password?"
2. **System process**:
   - FAQ service finds relevant FAQ about password reset
   - LLM receives FAQ context + conversation history
   - LLM generates response using FAQ information
3. **Result**: User receives accurate answer based on FAQ

### Scenario 2: Escalation Trigger

1. **User asks**: "I need to cancel my subscription but I'm locked out of my account"
2. **System process**:
   - FAQ service may find some relevant FAQs
   - LLM generates response but detects complexity
   - LLM response contains "escalate" or "human agent" keywords
   - System detects escalation keywords
   - Escalation summary is generated
   - Session status changes to "escalated"
3. **Result**: 
   - User sees escalation badge in UI
   - Session marked as escalated with summary note for human agent
   - Chat input disabled

### Scenario 3: Contextual Memory

1. **User asks**: "What's my order status?"
2. **System responds**: "I'd need your order number to check the status."
3. **User provides**: "Order #12345"
4. **System process**:
   - Previous messages loaded from session
   - LLM receives full context: initial question + follow-up
   - LLM can reference the order number in response
5. **Result**: Bot maintains conversation context across multiple messages

## Project Structure

```
ai-customer-support-bot/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Faq.js
│   │   │   ├── Message.js
│   │   │   └── Session.js
│   │   ├── routes/
│   │   │   ├── chatRoutes.js
│   │   │   └── faqRoutes.js
│   │   ├── services/
│   │   │   ├── llmService.js
│   │   │   └── faqService.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── app.js
│   │   └── server.js
│   ├── prompts/
│   │   └── customerSupport.md
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ChatWindow.jsx
    │   │   └── MessageBubble.jsx
    │   ├── pages/
    │   │   └── SupportPage.jsx
    │   ├── api/
    │   │   └── chatApi.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── public/
    │   └── index.html
    └── package.json
```

## Key Features

- ✅ Session-based conversation management
- ✅ FAQ integration with keyword matching
- ✅ Contextual memory (last 6 messages)
- ✅ Automatic escalation detection
- ✅ Escalation summary generation
- ✅ Modern, responsive chat UI
- ✅ Real-time message display
- ✅ Error handling and loading states

## Future Enhancements

- Admin panel for FAQ management
- Session history viewer
- Analytics dashboard
- Multi-language support
- Voice input/output
- Integration with ticketing systems
- User authentication
- Rate limiting and security improvements

## License

ISC

