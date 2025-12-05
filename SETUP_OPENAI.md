# Setting Up OpenAI API Key

You have an **OpenAI API key** (starts with `sk-proj-`). Here's how to configure it:

## Step 1: Update backend/.env File

Your `backend/.env` file should look like this:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE

LLM_MODEL=gpt-3.5-turbo
MONGO_URI=mongodb://localhost:27017/ai-support-bot
PORT=5000
```

**Important:**
- ✅ Use `OPENAI_API_KEY` (not `GROQ_API_KEY`)
- ✅ Use `LLM_MODEL=gpt-3.5-turbo`
- ✅ **DO NOT** include `LLM_BASE_URL` (leave it out for OpenAI)
- ✅ No spaces around `=`
- ✅ No quotes around values

## Step 2: Restart Backend Server

After updating `.env`:

1. **Stop the backend** (press `Ctrl+C` in the backend terminal)
2. **Start it again:**
   ```bash
   cd backend
   npm start
   ```

## Step 3: Test

1. Send a message in the chat
2. It should work now!

## Differences: OpenAI vs Groq

| Feature | OpenAI | Groq |
|---------|--------|------|
| API Key Format | `sk-proj-...` | `gsk_...` |
| Model | `gpt-3.5-turbo` | `llama-3.1-8b-instant` |
| Base URL | Not needed | `https://api.groq.com/openai/v1` |
| Cost | Paid (~$0.0015/1K tokens) | FREE |

## Troubleshooting

### Still getting 500 error?

1. **Check backend terminal** for error messages
2. **Verify `.env` file:**
   - Make sure `OPENAI_API_KEY` is set (not `GROQ_API_KEY`)
   - Make sure `LLM_MODEL=gpt-3.5-turbo`
   - Make sure `LLM_BASE_URL` is **NOT** in the file (or is commented out)
3. **Restart backend** after changes

### "Invalid API key" error?

- Verify your API key is correct
- Check for extra spaces or quotes
- Make sure you copied the entire key
- Check your OpenAI account has credits

### Want to use Groq (FREE) instead?

1. Get a free key from https://console.groq.com/
2. Update `.env`:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   LLM_BASE_URL=https://api.groq.com/openai/v1
   LLM_MODEL=llama-3.1-8b-instant
   ```

---

Your OpenAI key is configured! Just update the `.env` file and restart the backend. 🚀

