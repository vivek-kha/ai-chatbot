# Debugging 500 Internal Server Error

## Step 1: Check Backend Terminal

**Look at your backend terminal** (where you ran `npm start`). You should see error messages like:

```
Chat error: [Error details here]
Error message: [Specific error]
Error stack: [Stack trace]
```

## Common Errors & Solutions

### ❌ Error: "No API key found" or "LLM client not initialized"

**Problem:** Missing or incorrect API key in `.env` file

**Solution:**
1. Check `backend/.env` file exists
2. Verify it has:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   LLM_BASE_URL=https://api.groq.com/openai/v1
   LLM_MODEL=llama-3.1-8b-instant
   ```
3. Make sure there are **no spaces** around the `=` sign
4. Make sure the API key starts with `gsk_` (for Groq)

### ❌ Error: "Invalid API key"

**Problem:** API key is wrong or expired

**Solution:**
1. Go to https://console.groq.com/keys
2. Create a new API key
3. Copy it and update `backend/.env`
4. **Restart the backend server** (stop with Ctrl+C, then `npm start` again)

### ❌ Error: "Invalid model name"

**Problem:** Wrong model name in `.env`

**Solution:**
For Groq, use one of these models:
- `llama-3.1-8b-instant` (fastest, recommended)
- `llama-3.1-70b-versatile` (more capable)
- `mixtral-8x7b-32768` (alternative)

Update `backend/.env`:
```env
LLM_MODEL=llama-3.1-8b-instant
```

### ❌ Error: "MongoDB connection error"

**Problem:** MongoDB not running or wrong connection string

**Solution:**
1. **For local MongoDB:**
   - Make sure MongoDB service is running
   - Check `MONGO_URI=mongodb://localhost:27017/ai-support-bot`

2. **For MongoDB Atlas:**
   - Verify connection string format
   - Check IP whitelist in Atlas dashboard
   - Make sure password is URL-encoded

### ❌ Error: "LLM service error: ..."

**Problem:** API call failed

**Common causes:**
- Network issue
- API rate limit
- Invalid request format

**Solution:**
1. Check your internet connection
2. Wait a few minutes if rate limited
3. Verify API key is valid

## Step 2: Check Your .env File

Open `backend/.env` and verify it looks exactly like this (replace with your actual key):

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.1-8b-instant
MONGO_URI=mongodb://localhost:27017/ai-support-bot
PORT=5000
```

**Important:**
- No quotes around values
- No spaces around `=`
- No trailing spaces
- Each variable on its own line

## Step 3: Restart Backend

After fixing `.env`:
1. Stop backend: Press `Ctrl+C` in backend terminal
2. Start again: `npm start`
3. Check for any startup errors

## Step 4: Test Backend Directly

Test if backend is working:

```bash
# Test session creation
curl http://localhost:5000/api/chat/session -X POST

# Should return: {"sessionId":"..."}
```

## Step 5: Check Browser Console

After sending a message, check browser console (F12) for the actual error message. It should now show more details.

## Still Not Working?

1. **Share the exact error message** from backend terminal
2. **Share your `.env` file** (remove the actual API key, just show the structure)
3. **Check if backend shows:** "MongoDB connected" and "Server running on port 5000"

---

## Quick Fix Checklist

- [ ] `.env` file exists in `backend/` folder
- [ ] `GROQ_API_KEY` is set and starts with `gsk_`
- [ ] `LLM_BASE_URL` is `https://api.groq.com/openai/v1`
- [ ] `LLM_MODEL` is `llama-3.1-8b-instant`
- [ ] `MONGO_URI` is correct
- [ ] Backend server restarted after changing `.env`
- [ ] MongoDB is running (if using local)
- [ ] No errors in backend terminal on startup

