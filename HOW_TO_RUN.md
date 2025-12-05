# 🚀 How to Run the Project

You can run this project from **ANY terminal** - VSCode, Cursor, or regular PowerShell/CMD. Here's how:

## Method 1: Two Terminal Windows (Recommended)

### Terminal 1: Backend Server

1. Open a terminal (VSCode, Cursor, or PowerShell)
2. Navigate to backend folder:
   ```bash
   cd backend
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. **Wait for this message:**
   ```
   MongoDB connected
   Server running on port 5000
   ```
5. **Keep this terminal open!** (Don't close it)

### Terminal 2: Frontend Server

1. Open a **NEW terminal** (keep the first one running!)
2. Navigate to frontend folder:
   ```bash
   cd frontend
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```
4. **Wait for this message:**
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```
5. Browser should open automatically to http://localhost:3000

---

## Method 2: Using VSCode Integrated Terminal

1. Open the project in VSCode
2. Press `` Ctrl + ` `` (backtick) to open terminal
3. Click the **"+"** button to open a second terminal
4. In Terminal 1: `cd backend && npm start`
5. In Terminal 2: `cd frontend && npm run dev`

---

## Method 3: Using Cursor Terminal

1. Open the project in Cursor
2. Go to **Terminal** → **New Terminal** (or press `` Ctrl + ` ``)
3. Open a second terminal: **Terminal** → **New Terminal**
4. In Terminal 1: `cd backend && npm start`
5. In Terminal 2: `cd frontend && npm run dev`

---

## ⚠️ Important Notes

### Both servers must run at the same time!

- ✅ Backend (port 5000) - handles API requests
- ✅ Frontend (port 3000) - shows the chat UI

### If you see "MongoDB connection error":

You need MongoDB running. Options:

**Option A: MongoDB Atlas (Cloud - Easiest)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create a cluster
4. Get connection string
5. Update `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-support-bot
   ```

**Option B: Local MongoDB**
- Install MongoDB Community Edition
- Start MongoDB service
- Use: `MONGO_URI=mongodb://localhost:27017/ai-support-bot`

---

## Quick Test

Once both are running:

1. Open browser: http://localhost:3000
2. You should see the chat interface
3. Type "Hello" and press Enter
4. Bot should respond!

---

## Troubleshooting

### "Site can't be reached" error?
- ✅ Make sure backend is running (check Terminal 1)
- ✅ Make sure frontend is running (check Terminal 2)
- ✅ Wait 10-15 seconds after starting
- ✅ Try refreshing the browser

### Port already in use?
- Close other applications using port 3000 or 5000
- Or change ports in `.env` and `package.json`

### Still not working?
- Check terminal for error messages
- Make sure you're in the correct folders
- Verify `.env` file has your API key

---

## Summary

**You need 2 terminals running:**
1. Terminal 1: `cd backend && npm start` (port 5000)
2. Terminal 2: `cd frontend && npm run dev` (port 3000)

**Then open:** http://localhost:3000 in your browser

That's it! 🎉

