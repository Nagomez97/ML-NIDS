const Users = require('../models/index').Users;
const crypto = require('crypto');
const logger = require('../../config/log/logsConfig');

/**
 * Creates user on ddbb with a hashed password
 *
 * @param {*} username
 * @param {*} password
 */
async function createUser(username, password){
    var salt = crypto.randomBytes(16).toString('base64');
    var encrypted = crypto
                    .createHash('RSA-SHA256')
                    .update(password)
                    .update(salt)
                    .digest('hex');

    await Users.create({
        username: username,
        password: encrypted,
        salt: salt,
        token: null
    }).catch((err) => {
        logger.error(`USERS \t\t New user error: ${err}`);
        return res.status(400).json({'error': err.name});
    })
}

/**
 * Checks if Users table is empty
 *
 * @returns
 */
async function emptyUsers(){
    var users = await Users.findAll({
        attributes: ['username']
    });

    if(users.length > 0){
        return false;
    }
    else {
        return true;
    }
}

/**
 * Updates session token
 *
 * @param {*} username
 * @param {*} token
 */
async function updateToken(username, token){
    await Users.update({
        token: token
    }, {
        where: {username: username}
    }).catch(err => {
        logger.error(`USERS \t\t Cannot update token: ${err}`);
    })
}

/**
 * Checks if credentials are correct and returns random session token
 *
 * @param {*} username
 * @param {*} password
 * @returns
 */
async function checkLogin(username, password){
    var user = await Users.findOne({
        attributes: ['username', 'salt', 'password'],
        where: {username: username}
    });

    if(user == null){
        logger.debug(`USERS \t\t User does not exist.`);
        return null
    }
    else{
        var salt = user.salt;
        var check = user.password;
        var encrypted = crypto.createHash('RSA-SHA256')
                        .update(password)
                        .update(salt)
                        .digest('hex');
        if(encrypted == check){
            var token = crypto.randomBytes(64).toString('hex');
            await updateToken(username, token);
            return token;
        }
        else {
            return null;
        }
    }
}

async function checkToken(username, token){
    var ddbb_token = await Users.findOne({
        attributes: ['token'],
        where: {username: username}
    }).then(res => {
        return res.dataValues.token;
    }).catch(err => {
        logger.error(`USERS \t\t Error checking token> ${err}`);
    });

    if(token == ddbb_token) return true;

    else return false;
}

module.exports = {
    createUser,
    emptyUsers,
    checkLogin,
    checkToken
}