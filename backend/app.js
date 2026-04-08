import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import flightRoutes from './routes/flights.js';
import hotelRoutes from './routes/hotels.js';
import bookingRoutes from './routes/bookings.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(s => s.trim())
    : true,
  credentials: true,
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(errorHandler);

export default app;
