# 🚀 Quick Start - Your App is Starting!

## Current Status

✅ Backend server: Starting...
✅ Frontend server: Starting...

## What to Check

### 1. Backend Server (Port 5000)

**Check if it's running:**
- Open a browser and go to: http://localhost:5000/api/faqs
- You should see `[]` (empty array) if it's working

**If you see errors:**
- **MongoDB connection error?** 
  - Make sure MongoDB is running
  - Check your `MONGO_URI` in `.env` file
  - For local MongoDB: Start MongoDB service
  - For MongoDB Atlas: Check your connection string

**Common MongoDB Issues:**
- **Local MongoDB not running?**
  - Windows: Open Services, find "MongoDB", start it
  - Or run: `mongod` in a terminal
  
- **Using MongoDB Atlas?**
  - Make sure your IP is whitelisted
  - Check your connection string format

### 2. Frontend Server (Port 3000)

**Check if it's running:**
- Should automatically open at: http://localhost:3000
- If not, manually open: http://localhost:3000

**If frontend shows errors:**
- Make sure backend is running first
- Check browser console (F12) for errors

## Next Steps

1. **Wait 10-15 seconds** for both servers to fully start
2. **Open browser** to http://localhost:3000
3. **Test the chat** - Type "Hello" and see if the bot responds!

## Troubleshooting

### Backend won't start?
```bash
cd backend
npm start
```
Look for error messages - they'll tell you what's wrong.

### Frontend won't start?
```bash
cd frontend
npm start
```

### MongoDB Connection Issues?

**Option 1: Use MongoDB Atlas (Cloud - Free)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in `backend/.env`

**Option 2: Install Local MongoDB**
- Download from https://www.mongodb.com/try/download/community
- Install and start the service

### API Key Issues?

- Make sure your Groq API key is correct in `.env`
- Key should start with `gsk_`
- Check for typos or extra spaces

## Success Indicators

✅ Backend: No errors in terminal, shows "Server running on port 5000"
✅ Frontend: Opens in browser, shows chat interface
✅ Chat: Bot responds when you send a message

## Need Help?

Check the error messages in:
- Backend terminal (for server errors)
- Browser console F12 (for frontend errors)

Good luck! 🎉

