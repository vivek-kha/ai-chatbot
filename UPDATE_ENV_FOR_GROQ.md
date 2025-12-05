# Update .env File for Groq

## Your .env file should look like this:

```env
GROQ_API_KEY=gsk_your_actual_groq_key_here
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.1-8b-instant
MONGO_URI=mongodb://localhost:27017/ai-support-bot
PORT=5000
```

## Steps to Update:

1. **Open** `backend/.env` file in your editor

2. **Replace everything** with the content above

3. **Replace** `gsk_your_actual_groq_key_here` with your actual Groq API key

4. **Remove** the `OPENAI_API_KEY` line (if it exists)

5. **Save** the file

6. **Restart** your backend server:
   - Stop: `Ctrl+C` in backend terminal
   - Start: `npm start`

## Get Your Groq API Key:

1. Go to: https://console.groq.com/
2. Sign up (FREE, no credit card)
3. Go to: **API Keys** (left sidebar)
4. Click: **Create API Key**
5. Copy the key (starts with `gsk_`)

## Verify It's Working:

After restarting, you should see in backend terminal:
```
GROQ_API_KEY: ✅ Set
LLM_BASE_URL: https://api.groq.com/openai/v1
LLM_MODEL: llama-3.1-8b-instant
```

Then test by sending a message in the chat!

