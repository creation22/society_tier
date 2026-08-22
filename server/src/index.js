require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

app.set('trust proxy', 1);
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '100kb' }));

// Global API rate limit.
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down.' }
});
app.use('/api', limiter);

// Stricter limit for write-heavy endpoints.
const writeLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
app.use('/api/auth/signup', writeLimiter);
app.use('/api/auth/login', writeLimiter);
const guestLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });
app.use('/api/auth/guest', guestLimiter);

app.get('/', (_req, res) => res.json({ name: 'GurgaonTier API', status: 'ok' }));

app.use('/api/societies', require('./routes/societies'));
app.use('/api/comments', require('./routes/commentActions'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

app.use(require('./middleware/error').notFound);
app.use(require('./middleware/error').errorHandler);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
