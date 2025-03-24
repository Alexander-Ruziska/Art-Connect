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


module.exports = router;