const logger = require('../config/log/logsConfig');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const fs = require('fs');
const https = require('https');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
  var host = "https://" + req.headers.host.replace('8080', '8000')
    res.header("Access-Control-Allow-Origin", host);
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });

//Setting the routes we are going to listen into the server
router.setRoutes(app);


// Import listen PORT and server activation
https.createServer({
  key: fs.readFileSync(__dirname + '/certs/NIDS.key'),
  cert: fs.readFileSync(__dirname + '/certs/NIDS.cert')
}, app).listen(8080, () => {
  logger.info('SERVER \t\t Listening on port: 8080');
});