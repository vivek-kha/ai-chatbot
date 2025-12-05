# Troubleshooting Guide

## "Sorry, something went wrong" Error

If you're seeing this error for every message, check the following:

### 1. Check Browser Console (F12)

Open browser DevTools (F12) and check the Console tab for error messages. This will show you the actual error.

### 2. Check Backend Terminal

Look at your backend terminal for error messages. Common issues:

#### ❌ MongoDB Connection Error
```
MongoDB connection error: ...
```

**Solution:**
- Make sure MongoDB is running
- Check your `MONGO_URI` in `backend/.env`
- For MongoDB Atlas: Verify connection string and IP whitelist

#### ❌ API Key Error
```
Invalid API key. Please check your GROQ_API_KEY or OPENAI_API_KEY
```

**Solution:**
- Verify your API key in `backend/.env`
- For Groq: Make sure you have `GROQ_API_KEY` set
- For OpenAI: Make sure you have `OPENAI_API_KEY` set
- Check for typos or extra spaces

#### ❌ LLM Service Error
```
LLM service error: ...
```

**Solution:**
- Check your API key is valid
- Verify `LLM_BASE_URL` is set correctly (for Groq: `https://api.groq.com/openai/v1`)
- Verify `LLM_MODEL` is set correctly (for Groq: `llama-3.1-8b-instant`)

### 3. Check Your .env File

Make sure `backend/.env` has:

**For Groq (Free):**
```env
GROQ_API_KEY=gsk_your_key_here
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.1-8b-instant
MONGO_URI=mongodb://localhost:27017/ai-support-bot
PORT=5000
```

**For OpenAI:**
```env
OPENAI_API_KEY=sk-your_key_here
LLM_MODEL=gpt-3.5-turbo
MONGO_URI=mongodb://localhost:27017/ai-support-bot
PORT=5000
```

### 4. Verify Backend is Running

1. Check if backend is running on port 5000:
   - Open: http://localhost:5000/api/faqs
   - Should return `[]` (empty array)

2. If not running:
   ```bash
   cd backend
   npm start
   ```

### 5. Verify Frontend is Running

1. Check if frontend is running on port 3000:
   - Open: http://localhost:3000
   - Should show the chat interface

2. If not running:
   ```bash
   cd frontend
   npm run dev
   ```

### 6. Check CORS

If you see CORS errors in browser console:
- Make sure backend has CORS enabled (it should be in `app.js`)
- Verify backend is running on port 5000
- Check `BASE_URL` in `frontend/src/api/chatApi.js` is `http://localhost:5000/api`

### 7. Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to create session" | MongoDB not connected | Start MongoDB or fix connection string |
| "Invalid API key" | Wrong/missing API key | Check `.env` file |
| "API rate limit exceeded" | Too many requests | Wait a few minutes |
| "Network error" | Backend not running | Start backend server |
| "CORS error" | CORS not configured | Check backend CORS settings |

### 8. Test API Directly

Test the backend API directly:

```bash
# Test session creation
curl http://localhost:5000/api/chat/session -X POST

# Test chat (replace SESSION_ID)
curl http://localhost:5000/api/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"SESSION_ID","message":"Hello"}'
```

### 9. Still Not Working?

1. **Check all error messages** in:
   - Browser console (F12)
   - Backend terminal
   - Frontend terminal

2. **Verify all services are running:**
   - ✅ MongoDB
   - ✅ Backend (port 5000)
   - ✅ Frontend (port 3000)

3. **Restart everything:**
   - Stop all terminals
   - Restart MongoDB
   - Start backend: `cd backend && npm start`
   - Start frontend: `cd frontend && npm run dev`

4. **Check file paths:**
   - Make sure `.env` is in `backend/` folder
   - Make sure all files are in correct locations

---

## Quick Checklist

- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3000)
- [ ] `.env` file exists in `backend/` folder
- [ ] API key is set in `.env`
- [ ] `MONGO_URI` is correct
- [ ] No errors in browser console
- [ ] No errors in backend terminal

