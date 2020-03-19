const logger = require('../config/log/logsConfig');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes');

const app = express();

// seves static content
app.use(express.static(__dirname + '/public'));

//Setting the routes we are going to listen into the server
router.setRoutes(app);

// Import listen PORT and server activation
app.listen(8000, () => {
    logger.info('SERVER \t\t Listening on port: 8000');
});