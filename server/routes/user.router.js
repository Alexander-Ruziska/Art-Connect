const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();

// If the request came from an authenticated user, this route
// sends back an object containing that user's information.
// Otherwise, it sends back an empty object to indicate there
// is not an active session.
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send({});
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  if (req.isAuthenticated()) {
    const sqlText = 'SELECT * FROM "user" WHERE id = $1';
    const sqlValues = [req.params.id];
    pool.query(sqlText, sqlValues)
      .then((result) => {
        res.send(result.rows[0]);
      })
      .catch((err) => {
        console.error('GET /api/user/:id error:', err);
        res.sendStatus(500);
      });
  } else {
    res.send({});
  }
});

// Handles the logic for creating a new user. The one extra wrinkle here is
// that we hash the password before inserting it into the database.
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const hashedPassword = encryptLib.encryptPassword(req.body.password);

  // TODO: Create a default artist profile if user has selected artist=true, OR organization profile otherwise

  const sqlText = `
    INSERT INTO "user"
      ("username", "password")
      VALUES
      ($1, $2);
  `;
  const sqlValues = [username, hashedPassword];

  pool.query(sqlText, sqlValues)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((dbErr) => {
      console.log('POST /api/user/register error:', dbErr);
      res.sendStatus(500);
    });
});

// Handles the logic for logging in a user. When this route receives
// a request, it runs a middleware function that leverages the Passport
// library to instantiate a session if the request body's useruser_name and
// password are correct.
// You can find this middleware function in /server/strategies/user.strategy.js.
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Clear all server session information about this user:
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user.
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
});

// Update user by ID
router.put('/:id', (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.params.id;
    const updates = Object.keys(req.body)
      .filter(key => req.body[key] !== null && req.body[key] !== undefined)
      .map((key, index) => `"${key}" = $${index + 1}`);
    const sqlValues = [
      ...Object.values(req.body).filter(value => value !== null && value !== undefined),
      userId // Directly include the user ID at the end
    ];

    // Check if there are fields to update
    if (updates.length === 0) {
      return res.status(400).send('No valid fields to update.');
    }

    const sqlText = `
      UPDATE "user"
      SET ${updates.join(', ')}
      WHERE "id" = $${sqlValues.length};
    `;

    pool.query(sqlText, sqlValues)
      .then(() => res.sendStatus(200))
      .catch((err) => {
        console.error('PUT /api/user/:id error:', err);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(403); // Forbidden
  }
});



// Delete user by ID
router.delete('/:id', (req, res) => {
  if (req.isAuthenticated()) {
    const sqlText = 'DELETE FROM "user" WHERE id = $1';
    const sqlValues = [req.params.id];

    pool.query(sqlText, sqlValues)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error('DELETE /api/user/:id error:', err);
        res.sendStatus(500);
      });
  } else {
    res.send({});
  }
});

module.exports = router;
