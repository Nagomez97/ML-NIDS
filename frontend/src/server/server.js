const logger = require('../../config/log/logsConfig');
var path = require('path');

async function home(req, res){
    var status = req.session.status;

    console.log(status);

    if(status != 'logged-in'){
        res.sendFile(path.resolve('src/public/login.html'));
        logger.info(`SERVER \t\t No session detected. Login required!`);
        return;
    }

    res.sendFile(path.resolve('src/public/home.html'));
    logger.info(`SERVER \t\t Home`)
}

async function login(req, res){
    var username = req.body.username;
    var passwd = req.body.passwd;

    if(req.session.status == 'logged-in'){
        logger.debug(`SERVER \t\t Already logged in.`)
        return home(req, res);
    }
    
    if(username == 'admin' && passwd == 'admin'){
        req.session.regenerate(function(err){
            logger.debug(`SERVER \t\t Login successful.`)
            req.session.status = 'logged-in';
            return home(req, res)
        });
        
    }

    return;
}

module.exports = {
    home,
    login
}