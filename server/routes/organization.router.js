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
  pool.query('SELECT * FROM "organizations"')
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.error('GET /api/organizations error:', err);
      res.sendStatus(500);
    });
});


router.get('/:id', (req, res) => {
  const sqlText = 'SELECT * FROM "organizations" WHERE id = $1';
  pool.query(sqlText, [req.params.id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.error('GET /api/organizations/:id error:', err);
      res.sendStatus(500);
    });
});

// router.post('/', (req, res) => {
//   if (!isAuthenticated(req, res)) return;
//   const { name, description, mission_statement } = req.body;
//   const sqlText = 'INSERT INTO "organizations" ("name", "description", "mission_statement") VALUES ($1, $2, $3) RETURNING id';
//   pool.query(sqlText, [name, description, mission_statement])
//     .then((result) => res.status(201).send(result.rows[0]))
//     .catch((err) => {
//       console.error('POST /api/organizations error:', err);
//       res.sendStatus(500);
//     });
// });

// TODO: Update this to be explicit with which fields to update - building strings for UPDATE
// with map introduces sql injection (because we're not using sql parameterization ($1, $2, etc))
router.put('/:id', (req, res) => {
  if (!isAuthenticated(req, res)) return;

  const id = req.params.id;
  if (!(Number(id) > 0)) {
    res.status(400).send("Invalid ID");
    return;
  }

  // Explicitly allowed fields to update
  const orgProfile = ["name", "description", "address", "phone", "email", "website"];
  const updates = [];
  const sqlValues = [];

  orgProfile.forEach((field) => {
    const value = req.body[field];
    if (value !== null && value !== undefined) {
      updates.push(`"${field}" = $${sqlValues.length + 1}`);
      sqlValues.push(value);
    }
  });

  if (updates.length === 0) {
    res.status(400).send("No valid fields to update.");
    return;
  }

  sqlValues.push(id);
  const sqlText = `UPDATE "organizations" SET ${updates.join(', ')} WHERE "id" = $${sqlValues.length}`;

  pool.query(sqlText, sqlValues)
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error('PUT /api/organizations/:id error:', err);
      res.sendStatus(500);
    });
});



// router.delete('/:id', (req, res) => {
//   if (!isAuthenticated(req, res)) return;
//   const sqlText = 'DELETE FROM "organizations" WHERE id = $1';
//   pool.query(sqlText, [req.params.id])
//     .then(() => res.sendStatus(200))
//     .catch((err) => {
//       console.error('DELETE /api/organizations/:id error:', err);
//       res.sendStatus(500);
//     });
// });

module.exports = router;

/*
  Refactor organization:
    - Add a new table `user_organizations` that ties a user to an organization
    - Add a user.is_organization
    - Add a unique constraint to (user_id, organization_id) so each user can only belong to one org

    Backend Updates:
{x}- Update the user strategy to check for an organization that the user belongs to
{x} - Create an organization on user registration if user.is_organization is true
{x} - Update the rejectIfNotOrganization middleware


{x}  - If user is an organization but no profile exists, create it
{x}  - If user is an artist but no artist profile exists, create it
*/