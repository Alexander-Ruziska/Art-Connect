const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated, rejectIfNotArtist } = require('../modules/authentication-middleware');

router.get('/', (req, res) => {
  const query = `
    SELECT 
      "artists"."id",
      "artists"."name",
      "artists"."headline_description",
      "artists"."card_photo",
      "user"."id" AS "user_id"
    FROM "user"
    JOIN "artists" ON "user"."id" = "artists"."user_id"
    WHERE "user"."is_banned" = FALSE;
  `;

  pool.query(query)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.error('GET /api/artists error:', err);
      res.sendStatus(500);
    });
});

router.get('/:id', async (req, res) => {
  const artistId = req.params.id;
  const loggedInUserId = req.user?.id;

  const artistQuery = `
    SELECT 
      "artists"."id",
      "artists"."name",
      "artists"."headline_description",
      "artists"."card_photo",
      "artists"."soundcloud_id",
      "artists"."spotify_id",
      "user"."id" AS "user_id",
      "user"."profile_pic",
      "user"."linkedin",
      "user"."facebook",
      "user"."insta",
      "user"."website",
      "user"."bio",
      "user"."phone"
    FROM "user"
    JOIN "artists" ON "user"."id" = "artists"."user_id"
    WHERE "artists"."id" = $1 AND "user"."is_banned" = FALSE;
  `;

  const photoQuery = `
    SELECT * FROM "photos"
    WHERE "artist_id" = $1;
  `;

  try {
    const artistResult = await pool.query(artistQuery, [artistId]);
    const photoResult = await pool.query(photoQuery, [artistId]);

    if (artistResult.rows.length === 0) {
      return res.status(404).send({ error: 'Artist not found or is banned' });
    }

    const artist = artistResult.rows[0];
    artist.photos = photoResult.rows;

    let isMember = false;
    if (req.isAuthenticated() && loggedInUserId === artist.user_id) {
      isMember = true;
    }

    res.send({ ...artist, is_member: isMember });
  } catch (err) {
    console.error('GET artist by id error:', err);
    res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const artistId = Number(req.params.id);
  const userId = req.user.id;

  const {
    name,
    soundcloud_id,
    spotify_id,
    accepted_jobs,
    headline_description,
    profile_pic,
    linkedin,
    facebook,
    insta,
    website,
    bio,
    phone
  } = req.body;

  try {
    const ownershipCheck = await pool.query(
      `SELECT 1 FROM artists WHERE id = $1 AND user_id = $2`,
      [artistId, userId]
    );
    if (ownershipCheck.rowCount === 0) {
      return res.status(403).send({ error: "Forbidden" });
    }

    await pool.query(
      `UPDATE artists
       SET name = $1, soundcloud_id = $2, spotify_id = $3, accepted_jobs = $4, headline_description = $5
       WHERE id = $6`,
      [name, soundcloud_id, spotify_id, accepted_jobs, headline_description, artistId]
    );

    await pool.query(
      `UPDATE "user"
       SET profile_pic = $1, linkedin = $2, facebook = $3, insta = $4, website = $5, bio = $6, phone = $7
       WHERE id = $8`,
      [profile_pic, linkedin, facebook, insta, website, bio, phone, userId]
    );

    const result = await pool.query(
      `SELECT 
        artists.*,
        "user".profile_pic,
        "user".linkedin,
        "user".facebook,
        "user".insta,
        "user".website,
        "user".bio,
        "user".phone
      FROM artists
      JOIN "user" ON "user".id = artists.user_id
      WHERE artists.id = $1
      LIMIT 1`,
      [artistId]
    );

    res.send({ ...result.rows[0], is_member: true });
  } catch (err) {
    console.error('PUT /api/artists/:id error:', err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
