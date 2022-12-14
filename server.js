import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';

const cardRoute = require('./api/routes/cardRoute');
const categoryRoute = require('./api/routes/categoryRoute');
const sessionRoute = require('./api/routes/sessionRoute');

import {jwtAuthStrategy} from './api/config/passportConfig';

let app = express();
let port = process.env.PORT || 8080;

// Mongoose instance connection url connection
const databaseUrl = process.env.JP_DB_URL;
mongoose.Promise = global.Promise;

/*
 * Connect to database
*/

var connectWithRetry = function() {
    return mongoose.connect(databaseUrl, function(err) {
        if (err) {
            console.warn('Failed to connect to mongo on startup - retrying in 5 sec');
            setTimeout(connectWithRetry, 5000);
        }
    });
};
connectWithRetry();

passport.use(jwtAuthStrategy);

app.use(express.json({limit: "50Mb"}));
app.use(cors());
app.use(passport.initialize());

app.set('etag', false);
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

/*
 * Routes 
 */
app.use('/cards', passport.authenticate("jwt", { session: false }), cardRoute);
app.use('/categories', passport.authenticate("jwt", { session: false }), categoryRoute);
app.use('/sessions', passport.authenticate("jwt", { session: false }), sessionRoute);

app.listen(port);
console.log('Jeopardy RESTful API server started on: ' + port);