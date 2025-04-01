const express = require("express");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

const router = express.Router();

// Check if user is banned during login
router.post("/login", userStrategy.authenticate("local"), rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  // Check if the user is banned
  const bannedCheckQuery = 'SELECT is_banned FROM "user" WHERE id = $1';
  try {
    const bannedCheckResult = await pool.query(bannedCheckQuery, [userId]);

    if (bannedCheckResult.rows[0].is_banned) {
      req.logout(); // Log the user out if they are banned
      return res.status(403).send({ message: "Your account has been banned" });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error checking banned status:", err);
    res.sendStatus(500);
  }
});

// Register route (prevent duplicate usernames)
router.post("/register", async (req, res, next) => {
  const username = req.body.username;
  const hashedPassword = encryptLib.encryptPassword(req.body.password);
  const isArtist = Boolean(req.body.is_artist);
  const isOrganization = !isArtist;
  const sqlText = `
    INSERT INTO "user" 
      ("username", "password", "is_artist", "is_organization")
      VALUES
      ($1, $2, $3, $4) RETURNING *;
  `;

  const sqlValues = [username, hashedPassword, isArtist, isOrganization];

  // TODO: If the user wants to join an existing organization, add an INSERT here
  // to add an entry to the user_organizations table - that way the automatic
  // profile creation that happens later won't create a new organization for them

  pool
    .query(sqlText, sqlValues)
    .then((result) => { 
      res.send(result.rows[0]);
    })

    .catch((err) => {
      console.error("GET /api/register error", err);
      res.sendStatus(500);
    });
});

// If user is authenticated, return user info
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send({});
  }
});

// Get user by ID
router.get("/:id", (req, res) => {
  const sqlText = 'SELECT * FROM "user" WHERE id = $1';
  const sqlValues = [req.params.id];
  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      res.send(result.rows[0]);
    })
    .catch((err) => {
      console.error("GET /api/user/:id error:", err);
      res.sendStatus(500);
    });
});

// Update user by ID
router.put("/:id", (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.params.id;
    const updates = Object.keys(req.body)
      .filter((key) => req.body[key] !== null && req.body[key] !== undefined)
      .map((key, index) => `"${key}" = $${index + 1}`);
    const sqlValues = [
      ...Object.values(req.body).filter(
        (value) => value !== null && value !== undefined
      ),
      userId,
    ];

    // Check if there are fields to update
    if (updates.length === 0) {
      return res.status(400).send("No valid fields to update.");
    }

    const sqlText = `
      UPDATE "user"
      SET ${updates.join(", ")}
      WHERE "id" = $${sqlValues.length};
    `;

    pool
      .query(sqlText, sqlValues)
      .then(() => res.sendStatus(200))
      .catch((err) => {
        console.error("PUT /api/user/:id error:", err);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(403);
  }
});

// Delete user by ID
router.delete("/:id", (req, res) => {
  if (req.isAuthenticated()) {
    const sqlText = 'DELETE FROM "user" WHERE id = $1';
    const sqlValues = [req.params.id];

    pool
      .query(sqlText, sqlValues)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error("DELETE /api/user/:id error:", err);
        res.sendStatus(500);
      });
  } else {
    res.send({});
  }
});

module.exports = router;
