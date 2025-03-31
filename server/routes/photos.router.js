const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectIfNotArtist} = require('../modules/authentication-middleware');

//This is to allow artists to add photos of their art/band etc. on
router.post('/', rejectIfNotArtist, (req, res) => {
    const query = `
    INSERT INTO "photos"
    ("artist_id", "image_url", "title", "description")
    VALUES ($1, $2, $3, $4);
    `;
    pool.query(query, [req.user.artist_id, req.body.image_url, req.body.title, req.body.description])
    .then(result => {
        console.log('Posting art profile photo', result.rows);
        res.sendStatus(201);
    })
    .catch((err) => {
        console.error('Error adding new art profile photo:', err);
        res.sendStatus(500);
    })
})

module.exports = router;