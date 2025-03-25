const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const {rejectUnauthenticated, rejectIfNotArtist} = require('../modules/authentication-middleware');


// GET all artists
router.get('/', rejectUnauthenticated, async (req, res) => {
  const queryText = 'SELECT * FROM "artists";'; 
  try {
    const result = await pool.query(queryText); 
    res.send(result.rows);
  } catch (err) {
    console.error('Error in GET /api/artists:', err);
    res.sendStatus(500);
  }
});
// GET ARTIST BY ID
router.get('/:id', rejectUnauthenticated,  async (req, res) => {
  const artistId = req.params.id;
  const queryText = 'SELECT * FROM "artists" WHERE "id" = $1;';
  
  try {
    const result = await pool.query(queryText, [artistId]);

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Artist not found' });
    }

    res.send(result.rows[0]);
  } catch (err) {
    console.error('Error in GET /api/artists/:id', err);
    res.sendStatus(500);
  }
});


router.put('/update/:id', rejectUnauthenticated, async (req, res) => {
  const artistId = req.params.id;        // 🟢 comes from URL like /update/5
  const userId = req.user.id;            // 🟢 comes from logged-in session

  const {
    name,
    soundcloud_id,
    spotify_id,
    accepted_jobs,
    headline_description,
  } = req.body;

  const queryText = `
    UPDATE "artists"
    SET
      "name" = $1,
      "soundcloud_id" = $2,
      "spotify_id" = $3,
      "accepted_jobs" = $4,
      "headline_description" = $5
    WHERE "id" = $6 AND "user_id" = $7;
  `;

  const values = [
    name,
    soundcloud_id,
    spotify_id,
    accepted_jobs,
    headline_description,
    artistId,
    userId, // 🔒 ensures only the owner (logged-in user) can update it
  ];

  try {
    await pool.query(queryText, values);
    res.sendStatus(200);
  } catch (err) {
    console.error('PUT /api/artists/update/:id error:', err);
    res.sendStatus(500);
  }
});

module.exports = router;