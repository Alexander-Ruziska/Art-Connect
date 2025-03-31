const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
  rejectIfNotAdmin // ✅ Properly imported from middleware
} = require('../modules/authentication-middleware');

router.get('/users', rejectUnauthenticated, async (req, res) => {
  try {
    const query = `
      SELECT id, username, is_artist, is_organization, phone, is_banned
      FROM "user"
      ORDER BY username;
    `;
    const result = await pool.query(query);
    res.send(result.rows);
  } catch (err) {
    console.error('GET /api/admin/users error:', err);
    res.sendStatus(500);
  }
});

router.put('/ban/:id', rejectIfNotAdmin, async (req, res) => {
  const userId = Number(req.params.id);
  try {
    await pool.query(`UPDATE "user" SET is_banned = true WHERE id = $1`, [userId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error banning user:', err);
    res.sendStatus(500);
  }
});

router.put('/unban/:id', rejectIfNotAdmin, async (req, res) => {
  const userId = Number(req.params.id);
  try {
    await pool.query(`UPDATE "user" SET is_banned = false WHERE id = $1`, [userId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error unbanning user:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
