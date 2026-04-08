import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import pool from '../database/db.js';

const router = Router();
router.use(verifyToken);

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, type, amadeus_order_id, details, status, created_at FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ bookings: rows });
  } catch (err) {
    next(err);
  }
});

export default router;
