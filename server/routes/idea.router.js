const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectIfNotArtist} = require('../modules/authentication-middleware');




//POST to make a new artist idea
router.post('/', rejectIfNotArtist, (req, res) => {
    const query = `
   INSERT INTO "ideas"
   ("artist_id", "title", "idea")
   VALUES ($1, $2, $3);
    `;
    pool.query(query, [req.user.artist_id, req.body.title, req.body.idea])
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