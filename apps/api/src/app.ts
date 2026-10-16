import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // 1. Security Headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // 2. CORS Configuration
  const allowedOrigins = [
    env.FRONTEND_ORIGIN,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Not allowed by Access-Control-Allow-Origin'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // 3. Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // 4. Body Parsers with limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 5. Mount API Routes
  app.use('/api', routes);

  // 6. 404 Route Handler
  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.method} ${req.path} does not exist`,
      },
    });
  });

  // 7. Centralized Error Handler
  app.use(errorHandler);

  return app;
}
