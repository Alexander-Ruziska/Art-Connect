const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// Utility: check if user is authenticated
const isAuthenticated = (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(403);
    return false;
  }
  return true;
};

// GET all organizations
router.get('/', (req, res) => {
  pool.query('SELECT * FROM "organizations"')
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.error('GET /api/organizations error:', err);
      res.sendStatus(500);
    });
});

// GET organization by ID, plus profile_pic from associated user
router.get('/:id', async (req, res) => {
  const orgId = Number(req.params.id);
  const userId = req.user?.id;

  if (isNaN(orgId)) {
    return res.status(400).send({ error: "Invalid organization ID" });
  }

  try {
    const sqlText = `
      SELECT 
        organizations.id,
        organizations.name,
        organizations.description,
        organizations.mission_statement,
        organizations.created_at,
        "user".profile_pic
      FROM organizations
      JOIN user_organizations ON user_organizations.organization_id = organizations.id
      JOIN "user" ON "user".id = user_organizations.user_id
      WHERE organizations.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(sqlText, [orgId]);
    const organization = result.rows[0];

    if (!organization) {
      return res.status(404).send({ error: "Organization not found" });
    }

    // Check if the logged-in user is a member of the org
    let isMember = false;
    if (userId) {
      const memberCheckQuery = `
        SELECT 1 FROM user_organizations 
        WHERE user_id = $1 AND organization_id = $2
      `;
      const memberResult = await pool.query(memberCheckQuery, [userId, orgId]);
      isMember = memberResult.rowCount > 0;
    }

    res.send({ ...organization, is_member: isMember });
  } catch (err) {
    console.error('GET /api/organizations/:id error:', err);
    res.sendStatus(500);
  }
});


router.put('/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const organizationId = Number(req.params.id);
  const userId = req.user.id;
  const { name, description, mission_statement, profile_pic } = req.body;

  try {
    // Confirm the user is a member of the organization
    const membershipResult = await pool.query(
      `
      SELECT 1 
      FROM user_organizations 
      WHERE user_id = $1 AND organization_id = $2
      `,
      [userId, organizationId]
    );

    if (membershipResult.rowCount === 0) {
      return res.status(403).send({ error: "Forbidden: You are not a member of this organization" });
    }

    // Update organization data
    await pool.query(
      `
      UPDATE organizations 
      SET name = $1, description = $2, mission_statement = $3 
      WHERE id = $4
      `,
      [name, description, mission_statement, organizationId]
    );

    // Update user profile picture if provided
    if (profile_pic) {
      await pool.query(
        `
        UPDATE "user" 
        SET profile_pic = $1 
        WHERE id = $2
        `,
        [profile_pic, userId]
      );
    }

    // Fetch and return updated organization data including profile picture
    const result = await pool.query(
      `
      SELECT 
        organizations.id,
        organizations.name,
        organizations.description,
        organizations.mission_statement,
        organizations.created_at,
        "user".profile_pic
      FROM organizations
      JOIN user_organizations 
        ON user_organizations.organization_id = organizations.id
      JOIN "user" 
        ON "user".id = user_organizations.user_id
      WHERE organizations.id = $1
      LIMIT 1
      `,
      [organizationId]
    );

    res.send({ ...result.rows[0], is_member: true });

  } catch (error) {
    console.error('PUT /api/organizations/:id error:', error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
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
    {x} - Update the user strategy to check for an organization that the user belongs to
    {x} - Create an organization on user registration if user.is_organization is true
    {x} - Update the rejectIfNotOrganization middleware
    {x} - If user is an organization but no profile exists, create it
    {x} - If user is an artist but no artist profile exists, create it
*/
