const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const familyRoutes = require('./src/routes/families');
const memberRoutes = require('./src/routes/members');
const mediaRoutes = require('./src/routes/media');
const messageRoutes = require('./src/routes/messages');
const timelineRoutes = require('./src/routes/timeline');
const qrRoutes = require('./src/routes/qr');
const statsRoutes = require('./src/routes/stats');
const settingsRoutes = require('./src/routes/settings');

const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS setup
const allowedOrigins = [
  process.env.APP_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // In development, allow all origins to facilitate testing on different ports, IPv6 ([::1]), and local network IPs
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      origin.startsWith('http://[::1]:')
    ) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingsRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
