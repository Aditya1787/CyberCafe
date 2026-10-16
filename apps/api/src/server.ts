import { createApp } from './app.js';
import { env } from './config/env.js';
import { isSupabaseConfigured } from './config/supabase.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`
  ======================================================
  🚀 Baba Anandeshwar Internet Cafe API Server
  ======================================================
  🌍 Environment : ${env.NODE_ENV}
  📡 Listening on : http://localhost:${env.PORT}
  🔗 API Base    : http://localhost:${env.PORT}/api
  🔒 Supabase    : ${isSupabaseConfigured() ? 'Connected ✅' : '⚠️ Missing credentials (Check .env)'}
  ======================================================
  `);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
