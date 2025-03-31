require('dotenv').config();
const express = require('express');
const organizationRouter = require('./routes/organization.router');
const bodyParser = require('body-parser');
const cors = require('cors');
// Instantiate an express server:
const app = express();

// Use process.env.PORT if it exists, otherwise use 5001:
const PORT = process.env.PORT || 5001;

// Require auth-related middleware:
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Require router files:
const userRouter = require('./routes/user.router')
const artistsRouter = require('./routes/artists.router')
const ideasRouter = require('./routes/idea.router')
const jobsRouter = require('./routes/jobs.router')
const jobRequestRouter = require('./routes/job_requests.router')



app.use(cors({
  origin: 'http://localhost:5173',  // Update to your frontend URL
  credentials: true  // Allow cookies to be sent with requests
}));

// Apply middleware:
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());


// Apply router files:
app.use('/api/user', userRouter);
app.use('/api/organizations', organizationRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/ideas', ideasRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/job_requests', jobRequestRouter);

// Start the server:
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
