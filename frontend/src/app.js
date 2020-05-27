const logger = require('../config/log/logsConfig');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const session = require('express-session');
const fs = require('fs');
const https = require('https');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// seves static content
app.use(express.static(__dirname + '/public'));

// Cookies management
app.use(cookieParser());

app.use(session({
    secret: 'importantsecret',
    name: 'nids_session',
    cookie: {
        httpOnly: true, // Cant access through document.cookie
        secure: true, // Requires HTTPS connections only
        sameSite: true, // blocks CORS request on cookies
        maxAge: 3600000 // Time in ms
    },
    resave: true,
    saveUninitialized: true
}))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Setting the routes we are going to listen into the server
router.setRoutes(app);

// Import listen PORT and server activation
https.createServer({
    key: fs.readFileSync(__dirname + '/certs/NIDS.key'),
    cert: fs.readFileSync(__dirname + '/certs/NIDS.cert')
  }, app).listen(8000, () => {
    logger.info('SERVER \t\t Listening on port: 8000');
  });