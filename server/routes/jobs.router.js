const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();


const isAuthenticated = (req, res) => req.isAuthenticated() ? true : (res.sendStatus(403), false);


router.get('/', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  pool.query('SELECT * FROM "jobs"')
    .then((result) => res.send(result.rows))
    .catch((err) => res.sendStatus(500) && console.error('GET /api/jobs error:', err));
});


router.get('/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  pool.query('SELECT * FROM "jobs" WHERE id = $1', [req.params.id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => res.sendStatus(500) && console.error('GET /api/jobs/:id error:', err));
});


router.post('/', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const { title, description, deadline, organization_id, archived } = req.body;
  const sqlText = 'INSERT INTO "jobs" ("title", "description", "deadline", "organization_id", "archived") VALUES ($1, $2, $3, $4, $5) RETURNING id';
  pool.query(sqlText, [title, description, deadline, organization_id, archived])
    .then((result) => res.status(201).send(result.rows[0]))
    .catch((err) => res.sendStatus(500) && console.error('POST /api/jobs error:', err));
});


router.put('/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  const fields = Object.entries(req.body).filter(([_, value]) => value !== null && value !== undefined);
  if (!fields.length) return res.status(400).send('No valid fields to update.');

  const updates = fields.map(([key], index) => `"${key}" = $${index + 1}`).join(', ');
  const sqlValues = [...fields.map(([, value]) => value), req.params.id];
  const sqlText = `UPDATE "jobs" SET ${updates} WHERE "id" = $${sqlValues.length}`;

  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(200))
    .catch((err) => res.sendStatus(500) && console.error('PUT /api/jobs/:id error:', err));
});


router.delete('/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;
  pool.query('DELETE FROM "jobs" WHERE id = $1', [req.params.id])
    .then(() => res.sendStatus(200))
    .catch((err) => res.sendStatus(500) && console.error('DELETE /api/jobs/:id error:', err));
});

module.exports = router;
