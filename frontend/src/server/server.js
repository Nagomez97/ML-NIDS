const logger = require('../../config/log/logsConfig');
var path = require('path');

async function home(req, res){
    res.sendFile(path.resolve('src/public/home.html'));
    logger.info(`SERVER \t\t Home`)
}

module.exports = {
    home
}