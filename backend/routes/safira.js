import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import pool from '../database/db.js';

const router = Router();
router.use(verifyToken);

router.get('/', async (req, res, next) => {
  try {
    const email = req.user.username;
    const { rows } = await pool.query(
      'SELECT id, email, conversation_id, response, created_at FROM safira_suggestions WHERE email = $1 ORDER BY conversation_id, created_at',
      [email]
    );

    // Group responses by conversation_id
    const grouped = rows.reduce((acc, row) => {
      const key = row.conversation_id;
      if (!acc[key]) acc[key] = { conversationId: key, responses: [] };
      acc[key].responses.push(row.response);
      return acc;
    }, {});

    res.json({ suggestions: Object.values(grouped) });
  } catch (err) {
    next(err);
  }
});

export default router;
