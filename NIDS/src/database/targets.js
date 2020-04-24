const Targets = require('../models/index').targets;
const logger = require('../../config/log/logsConfig');
const { Op } = require("sequelize");

/**
 * Returns a target by its IP
 *
 * @param {*} ip
 * @returns
 */
async function getTarget(ip){
    if(ip == null){
        logger.error(`DDBB \t\t Null ip when getting target`);
        return null;
    }

    var res = Targets.findOne({
        attributes: ['ip', 'blocked'],
    }).catch(err => {
        logger.error(`DDBB \t\t Error retrieving targets.`);
    })

    return res;
}

/**
 * Creates a target
 *
 * @param {*} ip
 * @returns
 */
async function setIPTarget(ip){
    if(ip == null){
        logger.error(`DDBB \t\t Null ip when adding target`);
        return;
    }

    var found = await getTarget(ip);
    // If does not exist, create it
    if(found == null || found.length < 1){
        Targets.create({
            ip: ip,
            blocked: false
        }).catch(err => {
            logger.error(`DDBB \t\t Error creating target`);
        })
    }
    else {
        return;
    }

}

/**
 * Removes a target
 *
 * @param {*} ip
 * @returns
 */
async function removeIPTarget(ip){
    if(ip == null){
        logger.error(`DDBB \t\t Null ip when adding target`);
        return;
    }

    var found = await getTarget(ip);
    // If does exist, removes it
    if(found != null || found.length == 1){
        Targets.destroy({
            where : {ip : ip}
        }).catch(err => {
            logger.error(`DDBB \t\t Error creating target`);
        })
    }
    else {
        return;
    }

}

module.exports ={
    getTarget,
    setIPTarget,
    removeIPTarget
}