const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const passport = require('passport');

const logger = require('./middleware/logger');
const routes = require('./routes/routes');

require('dotenv').config();


// middleware
const app = express();



app.use([
    cors(),
    express.json(),
    express.urlencoded({ extended: true }),
    passport.initialize(),
    logger,
]);



require('./configs/passport');

// api route baseCamp
app.use(routes);

// wrong path error route
app.use((req, res) => {
    res.status(404).send('404 error! url does not exist');
});

// server error route
app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }

    return res.status(500).send('Something broke in server!');
});

module.exports = app;
