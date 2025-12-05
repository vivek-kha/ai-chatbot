# How to Get a Groq API Key (FREE)

## Step-by-Step Guide

### Step 1: Go to Groq Console
1. Open your web browser
2. Visit: **https://console.groq.com/**
3. You'll see the Groq homepage

### Step 2: Sign Up / Log In
1. Click the **"Sign Up"** or **"Log In"** button (top right)
2. You can sign up with:
   - Google account
   - GitHub account
   - Email address
3. Complete the registration (it's FREE, no credit card needed!)

### Step 3: Navigate to API Keys
1. After logging in, you'll be in the Groq Console dashboard
2. Look for **"API Keys"** in the left sidebar menu
   - OR
3. Go directly to: **https://console.groq.com/keys**

### Step 4: Create New API Key
1. Click the **"Create API Key"** button
2. Give it a name (e.g., "Customer Support Bot" or "My Project")
3. Click **"Submit"** or **"Create"**

### Step 5: Copy Your API Key
1. **IMPORTANT:** Copy the API key immediately!
   - It will look like: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
2. You won't be able to see it again after closing the popup
3. Save it somewhere safe (you'll need it for your `.env` file)

### Step 6: Add to Your Project
1. Create a file called `.env` in the `backend` folder
2. Add this content:

```env
GROQ_API_KEY=gsk_your_actual_key_here
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.1-8b-instant
MONGO_URI=mongodb://localhost:27017/ai-support-bot
PORT=5000
```

3. Replace `gsk_your_actual_key_here` with the key you copied

---

## Visual Guide

```
1. Visit: https://console.groq.com/
   ↓
2. Sign Up / Log In
   ↓
3. Go to "API Keys" (left sidebar)
   ↓
4. Click "Create API Key"
   ↓
5. Name it and click "Submit"
   ↓
6. COPY THE KEY (you won't see it again!)
   ↓
7. Paste it in backend/.env file
```

---

## Troubleshooting

**Can't find API Keys section?**
- Make sure you're logged in
- Look in the left sidebar menu
- Try: https://console.groq.com/keys

**Key not working?**
- Make sure you copied the entire key (starts with `gsk_`)
- Check there are no extra spaces
- Verify the key is in your `.env` file correctly

**Need to see your keys again?**
- You can't see the full key after creation (for security)
- You'll need to create a new key if you lost it
- Old keys will still work until you delete them

---

## Alternative: OpenAI API Key (If you prefer)

If you want to use OpenAI instead (paid, but cheap):

1. Go to: **https://platform.openai.com/**
2. Sign up / Log in
3. Go to: **https://platform.openai.com/api-keys**
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-`)
6. Use in `.env`:
   ```env
   OPENAI_API_KEY=sk-your_key_here
   LLM_MODEL=gpt-3.5-turbo
   ```

---

## Quick Checklist

- [ ] Signed up at console.groq.com
- [ ] Created an API key
- [ ] Copied the key (starts with `gsk_`)
- [ ] Created `backend/.env` file
- [ ] Added the key to `.env` file
- [ ] Saved the file

You're ready to go! 🚀

