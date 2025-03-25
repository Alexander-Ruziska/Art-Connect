const pool = require("../modules/pool");

const createProfilesIfNotExists = async (req) => {
  // If the user is an artist but has no artist_id, create an artist profile
  if (req.user.is_artist && req.user.artist_id === null) {
    await pool.query(`INSERT INTO "artists" ("user_id") VALUES ($1);`, [
      req.user.id,
    ]);
  }

  // If the user is an organization but has no organization_id, create an organization profile
  if (req.user.is_organization && req.user.organization_id === null) {
    const result = await pool.query(`INSERT INTO "organizations" DEFAULT VALUES RETURNING "id";`);
    //insert organization id and user id once the tabe has been created
    await pool.query(`INSERT INTO "user_organizations" ("user_id", "organization_id") VALUES ($1, $2);`, [req.user.id, result.rows[0].id]);
  }
};


const rejectUnauthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // We've verified the request came from an authenticated user, so
    // we call `next()` to advance to the next middleware function or
    // the route's callback function.
    createProfilesIfNotExists(req);
    next();
  } else {
    // The request came from an unauthenticated user, so we reply with
    // HTTP status code 403:
    res.sendStatus(403);
  }
};

const rejectIfNotArtist = (req, res, next) => {
  // Rejects request even if they are authenticated but not an artist
  if (req.isAuthenticated() && req.user.is_artist) {
    createProfilesIfNotExists(req);
    next();
  } else {
    // The request came from an unauthenticated user, so we reply with
    // HTTP status code 403:
    res.sendStatus(403);
  }
};

const rejectIfNotOrganization = (req, res, next) => {
  // If `is_artist` is false, we assume the user is an organization owner
  if (req.isAuthenticated() && !req.user.is_artist) {
    createProfilesIfNotExists(req);
    next();
  } else {
    // The request came from an unauthenticated user, so we reply with
    // HTTP status code 403:
    res.sendStatus(403);
  }
};

module.exports = {
  rejectUnauthenticated,
  rejectIfNotArtist,
  rejectIfNotOrganization,
  createProfilesIfNotExists,
};
