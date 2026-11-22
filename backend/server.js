const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Sanitize MongoDB URI if credentials contain special characters that were not percent-encoded
const sanitizeMongoUri = (uri) => {
  if (!uri) return 'mongodb://127.0.0.1:27017/A2Cravings';
  try {
    if (uri.includes('://') && uri.includes('@')) {
      const schemeEnd = uri.indexOf('://') + 3;
      const atLast = uri.lastIndexOf('@');
      const authPart = uri.substring(schemeEnd, atLast);
      const colonIdx = authPart.indexOf(':');
      if (colonIdx !== -1) {
        const user = decodeURIComponent(authPart.substring(0, colonIdx));
        const pass = decodeURIComponent(authPart.substring(colonIdx + 1));
        const hostPart = uri.substring(atLast + 1);
        return `${uri.substring(0, schemeEnd)}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostPart}`;
      }
    }
  } catch {
    // Return original if parsing fails
  }
  return uri;
};

const MONGO_URI = sanitizeMongoUri(process.env.MONGO_URI);

// ─── CORS Configuration ───────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any localhost / 127.0.0.1 origin in local development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

app.use(cors(corsOptions));
app.use(express.json());

// ─── Health Check Endpoint ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    status: 'ok',
    server: 'running',
    database: dbStateMap[dbState] || 'unknown',
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: allowedOrigins,
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// ─── 404 Handler for unknown routes ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── MongoDB Connection + Server Start ───────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
