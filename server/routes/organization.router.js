const express = require('express');
const path = require('path');
const pool = require('../modules/pool');
const router = express.Router();

const isAuthenticated = (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(403);
    return false;
  }
  return true;
};

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
}

router.get('/', async (req, res) => {
  // Only get organizations where the associated user is not banned
  const query = `
    SELECT organizations.* 
    FROM organizations
    JOIN user_organizations ON user_organizations.organization_id = organizations.id
    JOIN "user" ON "user".id = user_organizations.user_id
    WHERE "user".is_banned = FALSE;
  `;
  try {
    const result = await pool.query(query);
    res.send(result.rows);
  } catch (err) {
    console.error('GET /api/organizations error:', err);
    res.sendStatus(500);
  }
});

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
        "user".profile_pic,
        "user".linkedin,
        "user".facebook,
        "user".insta,
        "user".website,
        "user".bio,
        "user".phone
      FROM organizations
      JOIN user_organizations ON user_organizations.organization_id = organizations.id
      JOIN "user" ON "user".id = user_organizations.user_id
      WHERE organizations.id = $1 AND "user".is_banned = FALSE
      LIMIT 1;
    `;

    const result = await pool.query(sqlText, [orgId]);
    const organization = result.rows[0];

    if (!organization) {
      return res.status(404).send({ error: "Organization not found or user is banned" });
    }

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

// PUT route to update organization info (Only if user is authorized and not banned)
router.put('/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const orgId = Number(req.params.id);
  const userId = req.user.id;

  const { name, description, mission_statement, profile_pic } = req.body;

  try {
    const membershipCheck = await pool.query(
      `SELECT 1 FROM user_organizations WHERE user_id = $1 AND organization_id = $2`,
      [userId, orgId]
    );
    if (membershipCheck.rowCount === 0) return res.status(403).send({ error: "Forbidden" });

    await pool.query(
      `UPDATE organizations SET name = $1, description = $2, mission_statement = $3 WHERE id = $4`,
      [name, description, mission_statement, orgId]
    );

    if (profile_pic) {
      await pool.query(`UPDATE "user" SET profile_pic = $1 WHERE id = $2`, [profile_pic, userId]);
    }

    const result = await pool.query(
      `SELECT 
        organizations.*,
        "user".profile_pic,
        "user".linkedin,
        "user".facebook,
        "user".insta,
        "user".website,
        "user".bio,
        "user".phone
      FROM organizations
      JOIN user_organizations ON user_organizations.organization_id = organizations.id
      JOIN "user" ON "user".id = user_organizations.user_id
      WHERE organizations.id = $1 AND "user".is_banned = FALSE
      LIMIT 1`,
      [orgId]
    );

    res.send({ ...result.rows[0], is_member: true });
  } catch (err) {
    console.error('PUT /api/organizations/:id error:', err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
