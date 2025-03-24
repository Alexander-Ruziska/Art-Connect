const express = require('express');

const pool = require('../modules/pool');

const router = express.Router();


const isAuthenticated = (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(403); 
    return false;
  }
  return true;
};


router.get('/', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  pool.query('SELECT * FROM "organizations"')
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.error('GET /api/organizations error:', err);
      res.sendStatus(500);
    });
});


router.get('/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const sqlText = 'SELECT * FROM "organizations" WHERE id = $1';
  pool.query(sqlText, [req.params.id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.error('GET /api/organizations/:id error:', err);
      res.sendStatus(500);
    });
});


router.post('/', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const { name, description, mission_statement } = req.body;
  const sqlText = 'INSERT INTO "organizations" ("name", "description", "mission_statement") VALUES ($1, $2, $3) RETURNING id';
  pool.query(sqlText, [name, description, mission_statement])
    .then((result) => res.status(201).send(result.rows[0]))
    .catch((err) => {
      console.error('POST /api/organizations error:', err);
      res.sendStatus(500);
    });
});


router.put('/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const fields = Object.entries(req.body).filter(([key, value]) => value !== null && value !== undefined);
  if (fields.length === 0) return res.status(400).send('No valid fields to update.');

  const updates = fields.map(([key], index) => `"${key}" = $${index + 1}`).join(', ');
  const sqlValues = fields.map(([, value]) => value).concat(req.params.id);
  const sqlText = `UPDATE "organizations" SET ${updates} WHERE "id" = $${sqlValues.length}`;

  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error('PUT /api/organizations/:id error:', err);
      res.sendStatus(500);
    });
});


router.delete('/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const sqlText = 'DELETE FROM "organizations" WHERE id = $1';
  pool.query(sqlText, [req.params.id])
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error('DELETE /api/organizations/:id error:', err);
      res.sendStatus(500);
    });
});

module.exports = router;
