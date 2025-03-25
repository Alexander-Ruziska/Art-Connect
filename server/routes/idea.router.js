const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
// const { rejectIfNotArtist } = require('../modules/authentication-middleware');


//wait until ismails code is done it is giving me a 200 although I don't know if that is false or not because the code isn't set...? Maybe?
// getting all ideas
// router.get('/', rejectIfNotArist, (req, res) => {
//     const query = `
//       SELECT "artist_id", "created", "is_archived", "idea"
//   FROM "ideas"
// 	WHERE "artist_id" = $1 AND "is_archived" = FALSE;
//     `;
//     pool.query(query, [req.user.artist_id ])
//     .then(result => {
//         res.send(result.rows);
//     })
//     .catch(err => {
//         console.log('ERROR: cannot render idea list', err);
//         res.sendStatus(500);
//     })
// });

//check to make sure that it works once Ismails code is in the system
//post for idea form
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

//check to make sure that it works once Ismails code is in the system
//put route to archive an idea
/*
router.put('/archiveId', rejectIfNotArist, (req, res) =>{
    //Below is making a request to grab the id from the req.body
    const { id } = req.body;

    if(!id){
        return res.status(400).json({ error: "Missing idea ID"});
    }
    const sqlText = `
    UPDATE "ideas"
    SET "is_archived" = TRUE
    WHERE "is_archived" = FALSE
    AND "ideas"."id" = $1 AND "ideas"."artist_id"= $2;
    `;
    pool.query(sqlText, [id, req.user.id])
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        })
});
*/



module.exports = router;