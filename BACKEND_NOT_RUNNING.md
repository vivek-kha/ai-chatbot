# Backend Server Not Running

## Error: `ERR_CONNECTION_REFUSED`

This means your **backend server is not running** on port 5000.

## Solution: Start the Backend Server

### Step 1: Open a Terminal

Open a terminal (VSCode, Cursor, or PowerShell).

### Step 2: Navigate to Backend Folder

```bash
cd backend
```

### Step 3: Start the Server

```bash
npm start
```

### Step 4: Wait for Success Messages

You should see:
```
🔍 Checking environment variables...
PORT: 5000
MONGO_URI: ✅ Set
OPENAI_API_KEY: ✅ Set
✅ MongoDB connected successfully
✅ Server running on port 5000
✅ API available at http://localhost:5000/api
```

### Step 5: Keep Terminal Open

**Important:** Keep this terminal window open! If you close it, the server stops.

## Verify Backend is Running

1. Open browser and go to: http://localhost:5000/api/faqs
2. You should see: `[]` (empty array)
3. If you see an error, the server is not running

## Common Issues

### Issue: "MongoDB connection error"

**Solution:**
- Make sure MongoDB is running
- Check your `MONGO_URI` in `backend/.env`
- For MongoDB Atlas: Verify connection string

### Issue: "No API key found"

**Solution:**
- Check `backend/.env` file exists
- Verify `OPENAI_API_KEY` is set

### Issue: Port 5000 already in use

**Solution:**
- Close other applications using port 5000
- Or change `PORT` in `.env` to another number (e.g., 5001)

## Quick Checklist

- [ ] Backend terminal is open
- [ ] Ran `cd backend`
- [ ] Ran `npm start`
- [ ] See "Server running on port 5000"
- [ ] Terminal is still open (not closed)
- [ ] Can access http://localhost:5000/api/faqs

---

**Once the backend is running, refresh your frontend page and try again!**

