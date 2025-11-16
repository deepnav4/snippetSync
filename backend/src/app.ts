import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/authRoutes';
import snippetRoutes from './routes/snippetRoutes';
import upvoteRoutes from './routes/upvoteRoutes';
import commentRoutes from './routes/commentRoutes';
import userRoutes from './routes/userRoutes';
import notificationRoutes from './routes/notificationRoutes';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration - allow development and production origins
  const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://snippetsync-jgk8.onrender.com',
    process.env.FRONTEND_URL // Add production frontend URL via env variable
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.some(allowed => allowed && origin.startsWith(allowed))) {
          callback(null, true);
        } else {
          callback(null, true); // Allow all for now to fix CORS
        }
      },
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api', limiter);

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Logging middleware
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/snippets', snippetRoutes);
  app.use('/api/snippets', upvoteRoutes);
  app.use('/api/snippets', commentRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
