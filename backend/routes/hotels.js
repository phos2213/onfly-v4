import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { searchHotels, prebookHotel, bookHotel } from '../services/hotelService.js';
import pool from '../database/db.js';

const router = Router();
router.use(verifyToken);

router.get('/search', async (req, res) => {
  try {
    const { countryCode, cityName, checkInDate, checkOutDate, adults, currency, guestNationality } = req.query;
    if (!countryCode || !cityName || !checkInDate || !checkOutDate || !adults) {
      return res.status(400).json({ error: 'countryCode, cityName, checkInDate, checkOutDate, and adults are required' });
    }
    const data = await searchHotels({ countryCode, cityName, checkInDate, checkOutDate, adults, currency, guestNationality });
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Hotel search failed', detail: err.errors?.[0]?.message || err.message || 'Unknown error' });
  }
});

// Step 3: prebook — locks in the rate, returns prebookId + confirmed price
router.post('/prebook', async (req, res) => {
  try {
    const { offerId } = req.body;
    if (!offerId) return res.status(400).json({ error: 'offerId is required' });
    const data = await prebookHotel({ offerId });
    res.json(data); // { prebookId, price, termsAndConditions, ... }
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Hotel prebook failed', detail: err.errors?.[0]?.message || err.message || 'Unknown error' });
  }
});

// Step 4: confirm booking
router.post('/book', async (req, res) => {
  try {
    const { prebookId, holder, guests } = req.body;
    if (!prebookId || !holder || !guests?.length) {
      return res.status(400).json({ error: 'prebookId, holder, and guests are required' });
    }
    const result = await bookHotel({ prebookId, holder, guests });

    const { rows } = await pool.query(
      'INSERT INTO bookings (user_id, type, amadeus_order_id, details) VALUES ($1, $2, $3, $4) RETURNING id',
      [req.user.id, 'hotel', result.bookingId || result.id, JSON.stringify({ order: result, holder, guests })]
    );
    res.status(201).json({
      bookingId: rows[0].id,
      reference: result.bookingReference || result.bookingId,
      message: 'Hotel booked successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Hotel booking failed', detail: err.errors?.[0]?.message || err.message || 'Unknown error' });
  }
});

export default router;
