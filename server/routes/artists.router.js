const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');


// GET route to get all artists
router.get('/', async (req, res) => {
  const queryText = 'SELECT * FROM "artists";'; 
  try {
    const result = await pool.query(queryText); 
    res.send(result.rows);
  } catch (err) {
    console.error('Error in GET /api/artists:', err);
    res.sendStatus(500);
  }
});



module.exports = router;