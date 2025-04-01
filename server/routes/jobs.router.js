const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

const isAuthenticated = (req, res) => req.isAuthenticated() ? true : (res.sendStatus(403), false);

// GET all jobs (excluding those from banned users/orgs)
router.get('/', async (req, res) => {
  if (!isAuthenticated(req, res)) return;

  const sql = `
    SELECT j.*
    FROM jobs j
    JOIN organizations o ON j.organization_id = o.id
    JOIN user_organizations uo ON uo.organization_id = o.id
    JOIN "user" u ON u.id = uo.user_id
    WHERE u.is_banned = FALSE;
  `;

  try {
    const result = await pool.query(sql);
    res.send(result.rows);
  } catch (err) {
    console.error('GET /api/jobs error:', err);
    res.sendStatus(500);
  }
});

// GET job by ID (only if org user is not banned)
router.get('/:id', async (req, res) => {
  if (!isAuthenticated(req, res)) return;

  const sql = `
    SELECT j.*
    FROM jobs j
    JOIN organizations o ON j.organization_id = o.id
    JOIN user_organizations uo ON uo.organization_id = o.id
    JOIN "user" u ON u.id = uo.user_id
    WHERE j.id = $1 AND u.is_banned = FALSE;
  `;

  try {
    const result = await pool.query(sql, [req.params.id]);
    res.send(result.rows[0]);
  } catch (err) {
    console.error('GET /api/jobs/:id error:', err);
    res.sendStatus(500);
  }
});

// POST new job
router.post('/', async (req, res) => {
  if (!isAuthenticated(req, res)) return;

  const { title, description, deadline, organization_id, is_archived } = req.body;
  const sql = `
    INSERT INTO jobs (title, description, deadline, organization_id, is_archived)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;

  try {
    const result = await pool.query(sql, [title, description, deadline, organization_id, is_archived]);
    res.status(201).send(result.rows[0]);
  } catch (err) {
    console.error('POST /api/jobs error:', err);
    res.sendStatus(500);
  }
});

// PUT update job
router.put('/:id', async (req, res) => {
  if (!isAuthenticated(req, res)) return;

  const fields = Object.entries(req.body).filter(([_, value]) => value !== null && value !== undefined);
  if (!fields.length) return res.status(400).send('No valid fields to update.');

  const updates = fields.map(([key], index) => `"${key}" = $${index + 1}`).join(', ');
  const sqlValues = [...fields.map(([, value]) => value), req.params.id];
  const sqlText = `UPDATE jobs SET ${updates} WHERE id = $${sqlValues.length}`;

  try {
    await pool.query(sqlText, sqlValues);
    res.sendStatus(200);
  } catch (err) {
    console.error('PUT /api/jobs/:id error:', err);
    res.sendStatus(500);
  }
});

// DELETE job
router.delete('/:id', async (req, res) => {
  if (!isAuthenticated(req, res)) return;

  try {
    await pool.query('DELETE FROM jobs WHERE id = $1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('DELETE /api/jobs/:id error:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
