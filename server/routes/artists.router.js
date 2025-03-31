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

// GET ARTIST BY ID - alecia's original code before adding in the photos:

// router.get('/:artistId', (req, res) => {
//   const query = `
//     SELECT "artists"."id", "artists"."name", "artists"."headline_description", "artists"."card_photo", "artists"."soundcloud_id", "artists"."spotify_id", "user"."id" AS "user_id", "user"."is_banned", "user"."profile_pic", "user"."linkedin", "user"."facebook", "user"."insta", "user"."website" 
//     FROM "user"
//     JOIN "artists"
//     ON "user"."id" = "artists"."user_id"
//     WHERE "user"."is_banned" = FALSE
//     AND "artists"."id" = $1;

//   `;
//   //I tried adding this in to the code and calling it below after query, and nothing worked.. I also have it's own get below
//   // const photoQuery = `SELECT * FROM "photos"
//   // WHERE "photos"."artist_id" = $1;`;
//        pool.query(query, [req.params.artistId])
//     .then(result => {
//       res.send(result.rows);
//     })
//     .catch(err => {
//       console.error('GET artist by id error:', err);
//       res.sendStatus(500);
//     });
// });

router.get('/:artistId', async (req, res) => {
  try {
    const artistQuery = `
      SELECT "artists"."id", "artists"."name", "artists"."headline_description", 
             "artists"."card_photo", "artists"."soundcloud_id", "artists"."spotify_id",
             "user"."id" AS "user_id", "user"."is_banned", "user"."profile_pic",
             "user"."linkedin", "user"."facebook", "user"."insta", "user"."website"
      FROM "user"
      JOIN "artists" ON "user"."id" = "artists"."user_id"
      WHERE "user"."is_banned" = FALSE
      AND "artists"."id" = $1;
    `;

    const photosQuery = `
      SELECT id, image_url, title, description, created_at 
      FROM photos 
      WHERE artist_id = $1;
    `;

    // Running both queries in parallel
    const [artistResult, photosResult] = await Promise.all([
      pool.query(artistQuery, [req.params.artistId]),
      pool.query(photosQuery, [req.params.artistId])
    ]);

    if (artistResult.rows.length === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Combine data
    const artist = artistResult.rows[0];
    artist.photos = photosResult.rows;

    res.json(artist);
  } catch (error) {
    console.error('GET artist by id error:', error);
    res.sendStatus(500);
  }
});



// GET to grab all posted ideas by a specific artist
router.get('/:artistId/ideas', (req, res) => {
  const query = `
  SELECT "ideas"."id", "ideas"."artist_id", "ideas"."created_at", "ideas"."title", "ideas"."is_archived", "ideas"."idea", "artists"."id" AS "art_id", "artists"."name"
  FROM "ideas"
  JOIN "artists"
  ON "ideas"."artist_id" = "artists"."id"
WHERE "artist_id" = $1 AND "is_archived" = FALSE;
  `;
  pool.query(query, [req.params.artistId])
  .then(result => {
      res.send(result.rows);
  })
  .catch(err => {
      console.log('ERROR: cannot render idea list', err);
      res.sendStatus(500);
  })
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