const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');


// GET to grab all posted ideas by a specific artist
router.get('/', (req, res) => {
    const query = `
    SELECT "ideas"."id", "ideas"."artist_id", "ideas"."created_at", "ideas"."is_archived", "ideas"."idea", "artists"."id" AS "art_id", "artists"."name"
  	FROM "ideas"
  	JOIN "artists"
  	ON "ideas"."artist_id" = "artists"."id"
	WHERE "artist_id" = $1 AND "is_archived" = FALSE;
    `;
    pool.query(query, [req.user.artist_id])
    .then(result => {
        res.send(result.rows);
    })
    .catch(err => {
        console.log('ERROR: cannot render idea list', err);
        res.sendStatus(500);
    })
});


//POST to make a new artist idea
router.post('/', (req, res) => {
    const query = `
   INSERT INTO "ideas"
   ("artist_id","idea")
   VALUES ($1, $2);
    `;
    pool.query(query, [req.user.artist_id, req.body.idea])
    .then(result => {
        console.log(`post idea results:`, result.rows);
        res.sendStatus(201);
    })
    .catch((err) => {
        console.error(`error adding idea`, err);
        res.sendStatus(500);
    });
});


//PUT route to archive an artist idea
router.put('/archive', (req, res) => {
    //Below is making a request to grab the id from the req.body
    const { id } = req.body;

    if(!id){
        return res.status(400).json({ error: "Missing idea ID"});
    }
    const sqlText=`
    UPDATE "ideas"
    SET "is_archived" = TRUE
    WHERE "is_archived" = FALSE
    AND "ideas"."id" = $1 AND "ideas"."artist_id"= $2;
    `;
    pool.query(sqlText, [id, req.user.artist_id])
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});




module.exports = router;