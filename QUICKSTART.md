# Quick Start Guide

## Prerequisites Checklist

Before starting, make sure you have:
- ✅ Node.js installed (v16+)
- ✅ MongoDB running (local or MongoDB Atlas)
- ✅ OpenAI API key

## Step-by-Step Setup

### 1. Configure Backend Environment

Create a file `backend/.env` with the following content:

```env
MONGO_URI=mongodb://localhost:27017/ai-support-bot
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

**Important:** Replace `your_openai_api_key_here` with your actual OpenAI API key.

**For MongoDB Atlas:** Use a connection string like:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-support-bot
```

### 2. Start MongoDB

**If using local MongoDB:**
- Make sure MongoDB service is running
- On Windows: Check Services or run `mongod`

**If using MongoDB Atlas:**
- Your connection string is already configured in `.env`

### 3. Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm start
```

You should see:
```
MongoDB connected
Server running on port 5000
```

### 4. Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

The React app will open automatically at `http://localhost:3000`

### 5. Test the Application

1. The chat interface should load
2. Type a message like "Hello" or "How can I help?"
3. The bot should respond using OpenAI

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is available

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify `BASE_URL` in `frontend/src/api/chatApi.js` is `http://localhost:5000/api`

### OpenAI API errors
- Verify your API key is correct
- Check you have credits in your OpenAI account
- Ensure the API key has access to GPT-3.5-turbo

## Adding Sample FAQs (Optional)

You can add FAQs directly to MongoDB or create a simple script. Example FAQ:

```javascript
{
  question: "How do I reset my password?",
  answer: "Visit the login page and click 'Forgot Password'. Enter your email and follow the instructions.",
  tags: ["password", "account", "login"]
}
```

## Next Steps

- Add more FAQs to improve responses
- Customize the system prompts in `backend/prompts/customerSupport.md`
- Test escalation by asking complex questions
- Check the README.md for full documentation

