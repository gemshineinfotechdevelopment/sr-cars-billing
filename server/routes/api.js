import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

const DB_STATUS_MAP = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    status: 'ok',
    service: 'sr-cars-billing-backend',
    database: {
      status: DB_STATUS_MAP[dbState] || 'unknown',
      name: mongoose.connection.name || null,
      host: mongoose.connection.host || null
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
