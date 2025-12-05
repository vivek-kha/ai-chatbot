# Switch to Groq (FREE) - Fix Quota Error

## Problem
Your OpenAI API key has exceeded quota or no billing is set up.

## Solution: Use Groq (100% FREE)

### Step 1: Get Free Groq API Key

1. Go to: **https://console.groq.com/**
2. Sign up (FREE, no credit card needed)
3. Go to: **API Keys** (left sidebar)
4. Click: **Create API Key**
5. Copy the key (starts with `gsk_`)

### Step 2: Update backend/.env

Replace your current `.env` file content with:

```env
GROQ_API_KEY=gsk_your_groq_key_here
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.1-8b-instant
MONGO_URI=mongodb://localhost:27017/ai-support-bot
PORT=5000
```

**Important:**
- Use `GROQ_API_KEY` (not `OPENAI_API_KEY`)
- Set `LLM_BASE_URL=https://api.groq.com/openai/v1`
- Use `LLM_MODEL=llama-3.1-8b-instant`
- Remove or comment out `OPENAI_API_KEY` line

### Step 3: Restart Backend

1. **Stop backend:** Press `Ctrl+C` in backend terminal
2. **Start again:**
   ```bash
   cd backend
   npm start
   ```

### Step 4: Verify

You should see:
```
GROQ_API_KEY: ✅ Set
LLM_BASE_URL: https://api.groq.com/openai/v1
LLM_MODEL: llama-3.1-8b-instant
```

### Step 5: Test

Send a message in the chat - it should work now! 🎉

---

## Why Groq?

- ✅ **100% FREE** - No credit card needed
- ✅ **Very fast** responses
- ✅ **Generous free tier**
- ✅ **No quota limits** (within reason)
- ✅ **Easy to set up**

## Alternative: Fix OpenAI Quota

If you want to use OpenAI instead:

1. Go to: https://platform.openai.com/account/billing
2. Add payment method
3. Add credits ($5 minimum)
4. Wait a few minutes for activation

But **Groq is easier and FREE!** 🚀

