const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// POST /api/job_requests
router.post('/', rejectUnauthenticated, async (req, res) => {
  const { job_id } = req.body;
  const artist_id = req.user.artist_id;

  if (!artist_id) {
    return res.status(400).send({ message: 'Artist ID missing. Must be logged in as artist.' });
  }

  try {
    const sqlText = `
      INSERT INTO "job_requests" ("job_id", "artist_id")
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(sqlText, [job_id, artist_id]);
    res.status(201).send(result.rows[0]);
  } catch (err) {
    console.error('Error creating job request:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
