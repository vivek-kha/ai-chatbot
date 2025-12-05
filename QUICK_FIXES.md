# Quick Fixes - Priority Actions

## 🚨 Immediate Security Fixes

### 1. Add Input Validation
**File**: `backend/src/routes/chatRoutes.js`

Add validation middleware:
```javascript
import { body, validationResult } from 'express-validator';

// Add before POST / route
router.post("/", 
  [
    body('sessionId').optional().isUUID().withMessage('Invalid sessionId format'),
    body('message').trim().notEmpty().withMessage('Message is required')
      .isLength({ min: 1, max: 2000 }).withMessage('Message must be 1-2000 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... rest of code
  }
);
```

**Install**: `npm install express-validator`

---

### 2. Fix CORS Configuration
**File**: `backend/src/app.js`

```javascript
import cors from "cors";

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

### 3. Add Rate Limiting
**File**: `backend/src/app.js`

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
```

**Install**: `npm install express-rate-limit`

---

### 4. Fix Frontend API URL
**File**: `frontend/src/api/chatApi.js`

```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
```

**Add to `.env`**: `VITE_API_BASE_URL=http://localhost:5000/api`

---

## 🔧 High Priority Fixes

### 5. Add Database Indexes
**File**: `backend/src/models/Session.js`

```javascript
sessionSchema.index({ sessionId: 1 }, { unique: true });
sessionSchema.index({ status: 1 });
sessionSchema.index({ createdAt: -1 });
```

**File**: `backend/src/models/Faq.js`

```javascript
faqSchema.index({ question: 'text', answer: 'text' });
faqSchema.index({ tags: 1 });
```

---

### 6. Improve Error Handling
**File**: `backend/src/app.js`

```javascript
// Add error handling middleware at the end
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

---

### 7. Add Request Timeout for LLM
**File**: `backend/src/services/llmService.js`

```javascript
// Add timeout configuration
const LLM_TIMEOUT = parseInt(process.env.LLM_TIMEOUT_MS) || 30000; // 30 seconds

// Wrap API call with timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), LLM_TIMEOUT);

try {
  const response = await client.chat.completions.create({
    model: model,
    messages: messages,
  }, { signal: controller.signal });
  
  clearTimeout(timeoutId);
  // ... rest of code
} catch (error) {
  clearTimeout(timeoutId);
  if (error.name === 'AbortError') {
    throw new Error('LLM request timeout. Please try again.');
  }
  // ... existing error handling
}
```

---

### 8. Add Session Persistence (Frontend)
**File**: `frontend/src/components/ChatWindow.jsx`

```javascript
// Load session from localStorage on mount
useEffect(() => {
  const savedSessionId = localStorage.getItem('chatSessionId');
  if (savedSessionId) {
    setSessionId(savedSessionId);
    // Optionally load messages
    getSession(savedSessionId).then(session => {
      if (session.messages) {
        setMessages(session.messages);
      }
    }).catch(console.error);
  } else {
    createSession().then(({ sessionId }) => {
      setSessionId(sessionId);
      localStorage.setItem('chatSessionId', sessionId);
    });
  }
}, []);

// Save sessionId when it changes
useEffect(() => {
  if (sessionId) {
    localStorage.setItem('chatSessionId', sessionId);
  }
}, [sessionId]);
```

---

## 📦 Required Package Updates

### Backend
```bash
cd backend
npm install express-validator express-rate-limit
```

### Frontend
No additional packages needed for quick fixes.

---

## 🔍 Testing Checklist

After implementing fixes, test:
- [ ] Input validation rejects invalid data
- [ ] CORS blocks unauthorized origins
- [ ] Rate limiting works (try 100+ requests)
- [ ] Frontend connects to correct API URL
- [ ] Database queries are faster (check indexes)
- [ ] Errors don't expose stack traces in production
- [ ] LLM calls timeout after 30 seconds
- [ ] Session persists on page refresh

---

## 📝 Environment Variables to Add

### Backend `.env`
```env
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LLM_TIMEOUT_MS=30000
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## ⚠️ Breaking Changes

None of these fixes should break existing functionality, but:
- Rate limiting may affect testing (use test mode)
- CORS changes may require updating frontend URL
- Input validation will reject previously accepted invalid inputs (this is good!)

---

## 🎯 Next Steps After Quick Fixes

1. Add comprehensive testing
2. Implement structured logging
3. Improve FAQ search algorithm
4. Add API documentation
5. Set up monitoring/error tracking

