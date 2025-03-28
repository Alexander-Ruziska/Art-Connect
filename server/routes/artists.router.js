const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const {rejectUnauthenticated, rejectIfNotArtist} = require('../modules/authentication-middleware');

// GET all artists
//need to add in the photo
router.get('/', (req, res) => {
  const query = `SELECT "artists"."id", "artists"."name", "artists"."headline_description", "user"."id" AS "user_id", "user"."is_banned"
       FROM "user"
    JOIN "artists"
    ON "user"."id" = "artists"."user_id"
       WHERE "user"."is_banned" = FALSE;`;
       pool.query(query)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.error('GET /api/artists error:', err);
      res.sendStatus(500);
    });
});

// GET ARTIST BY ID

// router.get('/:id', (req, res) => {
//   const sqlText = 'SELECT * FROM "artists" WHERE id = $1';
//   pool.query(sqlText, [req.params.id])
//     .then((result) => res.send(result.rows[0]))
//     .catch((err) => {
//       console.error('GET /api/artists/:id error:', err);
//       res.sendStatus(500);
//     });
// });

//GET an artist's uploaded photos
// router.get('/:artistId', (req, res) => {
//   const sqlText = `SELECT * FROM "photos"
// WHERE "photos"."artist_id" = $1;`;
//   pool.query(sqlText, [req.params.artistId])
//   .then(result => {
//     res.send(result.rows);
//   })
//   .catch(err => {
//     console.error('Failed getting artists photos:', err)
//     res.sendStatus(500);
//   })
// });

//
router.get('/:artistId', (req, res) => {
  const query = `
    SELECT "artists"."id", "artists"."name", "artists"."headline_description", "artists"."card_photo", "artists"."soundcloud_id", "artists"."spotify_id", "user"."id" AS "user_id", "user"."is_banned", "user"."profile_pic", "user"."linkedin", "user"."facebook", "user"."insta", "user"."website" 
    FROM "user"
    JOIN "artists"
    ON "user"."id" = "artists"."user_id"
    WHERE "user"."is_banned" = FALSE
    AND "artists"."id" = $1;

  `;
  //I tried adding this in to the code and calling it below after query, and nothing worked.. I also have it's own get below
  // const photoQuery = `SELECT * FROM "photos"
  // WHERE "photos"."artist_id" = $1;`;
       pool.query(query, [req.params.artistId])
    .then(result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.error('GET artist by id error:', err);
      res.sendStatus(500);
    });
});



// router.put('/artists/:id', rejectUnauthenticated, async (req, res) => {
//   const artistId = req.params.id;        // 🟢 comes from URL like /update/5
//   const userId = req.user.id;            // 🟢 comes from logged-in session

//   const {
//     name,
//     soundcloud_id,
//     spotify_id,
//     accepted_jobs,
//     headline_description,
//   } = req.body;

//   const queryText = `
//     UPDATE "artists"
//     SET
//       "name" = $1,
//       "soundcloud_id" = $2,
//       "spotify_id" = $3,
//       "accepted_jobs" = $4,
//       "headline_description" = $5
//     WHERE "id" = $6 AND "user_id" = $7;
//   `;

//   const values = [
//     name,
//     soundcloud_id,
//     spotify_id,
//     accepted_jobs,
//     headline_description,
//     artistId,
//     userId, // 🔒 ensures only the owner (logged-in user) can update it
//   ];

//   try {
//     await pool.query(queryText, values);
//     res.sendStatus(200);
//   } catch (err) {
//     console.error('PUT /api/artists/update/:id error:', err);
//     res.sendStatus(500);
//   }
// });

module.exports = router;