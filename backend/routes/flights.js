import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { searchFlights, bookFlight } from '../services/flightService.js';
import pool from '../database/db.js';

const router = Router();
router.use(verifyToken);

// POST because Duffel offer_requests is a write operation (creates a resource)
router.post('/search', async (req, res) => {
  try {
    const { origin, destination, departureDate, adults } = req.body;
    if (!origin || !destination || !departureDate || !adults) {
      return res.status(400).json({ error: 'origin, destination, departureDate, and adults are required' });
    }
    const data = await searchFlights({ origin, destination, departureDate, adults });
    res.json(data); // { passengers: [{id, type}], offers: [...] }
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Flight search failed', detail: err.errors?.[0]?.message || err.message || 'Unknown error' });
  }
});

router.post('/book', async (req, res) => {
  try {
    const { offerId, offerAmount, offerCurrency, travelers } = req.body;
    if (!offerId || !offerAmount || !offerCurrency || !travelers?.length) {
      return res.status(400).json({ error: 'offerId, offerAmount, offerCurrency, and travelers are required' });
    }
    const order = await bookFlight({ offerId, offerAmount, offerCurrency, travelers });

    const { rows } = await pool.query(
      'INSERT INTO bookings (user_id, type, amadeus_order_id, details) VALUES ($1, $2, $3, $4) RETURNING id',
      [req.user.id, 'flight', order.id, JSON.stringify({ order, travelers })]
    );
    res.status(201).json({
      bookingId: rows[0].id,
      orderId: order.id,
      bookingReference: order.booking_reference,
      message: 'Flight booked successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Flight booking failed', detail: err.errors?.[0]?.message || err.message || 'Unknown error' });
  }
});

export default router;
