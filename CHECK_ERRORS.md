# How to Check Backend Errors

## Step 1: Find Your Backend Terminal

Look for the terminal window where you ran:
```bash
cd backend
npm start
```

## Step 2: Look for Error Messages

When you send a message in the chat, check the backend terminal for errors. Common error patterns:

### ❌ MongoDB Errors
```
MongoDB connection error: ...
MongooseError: ...
```

### ❌ API Key Errors
```
⚠️ WARNING: No API key found!
Invalid API key
LLM client not initialized
```

### ❌ LLM Service Errors
```
LLM API Error: ...
LLM service error: ...
```

### ❌ Chat Route Errors
```
Chat error: ...
Error message: ...
Error stack: ...
```

## Step 3: Copy the Error

1. **Select the error text** in the terminal
2. **Copy it** (Ctrl+C or right-click → Copy)
3. **Paste it here** so I can help fix it

## What to Look For

When you send a message, you should see in the backend terminal:

**✅ Good (working):**
```
Calling LLM with model: gpt-3.5-turbo, baseURL: default
```

**❌ Bad (error):**
```
Chat error: [error details]
Error message: [specific error]
```

## Common Error Messages

| Error Message | What It Means | Fix |
|--------------|---------------|-----|
| "No API key found" | Missing API key in .env | Add OPENAI_API_KEY to .env |
| "Invalid API key" | Wrong API key | Check/update API key |
| "MongoDB connection error" | Can't connect to database | Start MongoDB or fix MONGO_URI |
| "LLM service error" | API call failed | Check API key and internet |
| "Invalid model name" | Wrong model in .env | Use gpt-3.5-turbo for OpenAI |

## Quick Test

1. **Send a message** in the chat
2. **Immediately check** backend terminal
3. **Copy any red error messages**
4. **Share them here**

---

**Please copy and paste the error message from your backend terminal!**

