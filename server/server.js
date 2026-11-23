import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.send('SR Cars Billing API is running.');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
