const logger = require('../../config/log/logsConfig');
var path = require('path');
const request = require('request');

// Get random int to serve random image on login
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
COOKIE_EXPIRATION = 3600000; // One hour


/**
 * checks if a session exists. If not, shows login page
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function home(req, res){
    var status = req.session.status;
    var token = req.session.token;
    var imageUrl = '"/images/wallpapers/' + String(getRandomInt(1,5)) + '.jpg"'


    // Checks for first login
    request.post('https://172.19.0.1:8080/api/users/emptyUsers', {},
    (error, response, body) => {
        if(error){
            logger.error(`SERVER \t\t Error ${error}`);
            return;
        }
        body = JSON.parse(body);
        // First login
        if(body.empty == true){
            empty = true;
            res.render('login', {url: imageUrl, message: 'First login detected. Insert desired credentials below.', action: 'newUser', button:'Create User'});
            logger.info(`SERVER \t\t No session detected. First login!`);
            return;
        }

        // No session detected
        else if(req.session.token == null){
            res.render('login', {url: imageUrl, message: '', action: 'login', button:' Log in'});
            logger.info(`SERVER \t\t No session detected. Login required!`);
            return;
        }

        // Check if token is still working
        request.get('https://172.19.0.1:8080/api/sniffer/getInterfaces?username='+req.cookies.username+'&token='+req.cookies.token, {},
        (error, response, body) => {
            if(JSON.parse(body).message == 'Invalid token.'){

                // Logout
                // delete cookies
                res.clearCookie("token");
                res.clearCookie("username");
                if (req.session) {
                    // delete session object
                    req.session.destroy(function(err) {
                    });
                }

                // Login
                res.render('login', {url: imageUrl, message: 'Session Expired.', action: 'login', button:' Log in'});
                logger.info(`SERVER \t\t Invalid token.`);
                return;
            }

            // Already logged-in
            if(status == 'logged-in' && token == req.cookies.token){
                res.sendFile(path.resolve('src/public/home.html'));
                logger.info(`SERVER \t\t Home`)
            }
        
            else {
                res.render('login', {url: imageUrl, message: '', action: 'login', button:' Log in'});
                logger.info(`SERVER \t\t No session detected. Login required!`);
                return;
            }

            })
    })

    
}


/**
 * Checks login credentials sent by post
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function login(req, res){
    var username = req.body.username;
    var password = req.body.passwd;


    // Already logged in
    if(req.session.status == 'logged-in' && req.cookies.token == req.session.token){
        logger.info(`SERVER \t\t Already logged in.`);
        return home(req, res);
    }

    // Check credentials against NIDS microservice
    request.post('https://172.19.0.1:8080/api/users/checkLogin', {json: {username: username, password: password}}, (error, response, body)=>{
        var token = body.token;

        // Login successfull
        if(token != null){
            // Sets token cookie (used for NIDS microservice communication)
            res.cookie('token', token, {expire : new Date() + COOKIE_EXPIRATION});
            res.cookie('username', username, {expire : new Date() + COOKIE_EXPIRATION});

            // Regenerates session for security purposes
            req.session.regenerate(function(err){
                logger.info(`SERVER \t\t Login successful.`)
                req.session.status = 'logged-in';
                req.session.token = token;
                req.session.username = username;

                
                res.redirect('/')
            });
        }
        // Login failed
        else {
            var imageUrl = '"/images/wallpapers/' + String(getRandomInt(1,5)) + '.jpg"'
            res.render('login', {url: imageUrl, message: 'Invalid credentials.', action: 'login', button:' Log in'});
            logger.info(`SERVER \t\t Invalid credentials.`)
        }
        

    });
    return;
}

/**
 * Clears session and cookies
 *
 * @param {*} req
 * @param {*} res
 */
async function logout(req, res){

    // delete cookies
    res.clearCookie("token");
    res.clearCookie("username");
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
    }
    
}

/**
 * Sends credentials to NIDS microservice to create a new user
 *
 * @param {*} req
 * @param {*} res
 */
async function createUser(req, res){
    var username = req.body.username;
    var password = req.body.passwd;

    if(username == null || password == null){
        return res.status(400).json({ok: false})
    }
    else{
        request.post('https://172.19.0.1:8080/api/users/newUser', {json: {username: username, password: password}}, (error, response, body) => {
            var imageUrl = '"/images/wallpapers/' + String(getRandomInt(1,5)) + '.jpg"'
            if(body.ok){
                res.redirect('/');
            }
            else {
                res.render('login', {url: imageUrl, message: 'Cannot create user.', action: 'newUser', button:'Create user'});
            }
        });
    }
}

module.exports = {
    home,
    login,
    logout,
    createUser
}