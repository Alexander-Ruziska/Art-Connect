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



// GET: Artists who requested jobs from this organization
router.get('/organization', rejectUnauthenticated, async (req, res) => {
  const orgId = req.user.organization_id;

  if (!orgId) {
    return res.status(403).send({ message: 'You must be logged in as an organization.' });
  }

  const query = `
    SELECT 
      jobs.title AS job_title,
      jobs.id AS job_id,
      job_requests.id AS request_id,
      job_requests.status,
      job_requests.created_at AS request_date,
      artists.id AS artist_id,
      artists.name AS artist_name
    FROM job_requests
    JOIN jobs ON job_requests.job_id = jobs.id
    JOIN artists ON job_requests.artist_id = artists.id
    JOIN "user" ON artists.user_id = "user".id
    WHERE jobs.organization_id = $1
    ORDER BY job_requests.created_at DESC;
  `;

  try {
    const result = await pool.query(query, [orgId]);
    res.send(result.rows);
  } catch (err) {
    console.error('Error fetching job requests for organization:', err);
    res.sendStatus(500);
  }
});

// GET /api/job_requests/artist
router.get('/artist', rejectUnauthenticated, async (req, res) => {
  const artistId = req.user.artist_id;

  if (!artistId) {
    return res.status(403).send({ message: 'Must be logged in as an artist.' });
  }

  const sqlText = `
    SELECT 
      job_requests.id AS request_id,
      job_requests.status,
      job_requests.created_at AS request_date,
      jobs.title AS job_title,
      jobs.id AS job_id
    FROM job_requests
    JOIN jobs ON job_requests.job_id = jobs.id
    WHERE job_requests.artist_id = $1
    ORDER BY job_requests.created_at DESC;
  `;

  try {
    const result = await pool.query(sqlText, [artistId]);
    res.send(result.rows);
  } catch (err) {
    console.error('Error fetching artist job requests:', err);
    res.sendStatus(500);
  }
});

// PUT /api/job_requests/:id/accept
router.put('/:id/accept', rejectUnauthenticated, async (req, res) => {
  const orgId = req.user.organization_id;

  if (!orgId) {
    return res.status(403).send({ message: 'Only organizations can accept requests.' });
  }

  const requestId = req.params.id;

  const sqlText = `
    UPDATE "job_requests"
    SET status = 'accepted'
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const result = await pool.query(sqlText, [requestId]);
    res.send(result.rows[0]);
  } catch (err) {
    console.error('Error accepting job request:', err);
    res.sendStatus(500);
  }
});
// PUT /api/job_requests/:id/reject
router.put('/:id/reject', rejectUnauthenticated, async (req, res) => {
  const orgId = req.user.organization_id;

  if (!orgId) {
    return res.status(403).send({ message: 'Only organizations can reject requests.' });
  }

  const requestId = req.params.id;

  const sqlText = `
    UPDATE "job_requests"
    SET status = 'rejected'
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const result = await pool.query(sqlText, [requestId]);
    res.send(result.rows[0]);
  } catch (err) {
    console.error('Error rejecting job request:', err);
    res.sendStatus(500);
  }
});


module.exports = router;