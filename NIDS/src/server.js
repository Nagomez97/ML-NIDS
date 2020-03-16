const logger = require('../config/log/logsConfig');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//Setting the routes we are going to listen into the server
router.setRoutes(app);

// Import listen PORT and server activation
app.listen(8080, () => {
    logger.info('SERVER \t\t Listening on port: 8080');
});