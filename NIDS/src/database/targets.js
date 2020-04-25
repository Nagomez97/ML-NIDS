const Targets = require('../models/index').targets;
const Flows = require('../models/index').flows;
const logger = require('../../config/log/logsConfig');
const { Op } = require("sequelize");
const sequelize = require('sequelize');

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
        where : {
            ip : ip
        }
    }).catch(err => {
        logger.error(`DDBB \t\t Error retrieving targets.`);
    })

    return res;
}

/**
 * Returns targets
 *
 * @param {*} ip
 * @returns
 */
async function getTargets(){

    var res = Targets.findAll({
        attributes: ['ip', 'blocked']
    }).then(res => {
        return res.map(x => {return x.dataValues})
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
    if(found == null || found == undefined){
        return;
    }
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

/**
 *Returns the number of benign flows for the given IP
 *
 * @param {*} ip
 */
async function countFlows(ips, fromHour){
    var res = await Flows.findAll({
        attributes: ['ip_src', 'label', [sequelize.fn('count', sequelize.col('label')), 'count']],
        group : ['ip_src', 'label'],
        raw: true,
        where: {
            ip_src: ips,
            timestamp : {
                [Op.gte]: fromHour
            }
        }
    }).then(res => {
        var results = {};
        res.map(count => {
            if(results[count.ip_src] == null){
                results[count.ip_src] = {}
            }
            if(count.label == 'Benign'){
                results[count.ip_src]['benigns'] = count.count;
            }
            else{
                results[count.ip_src]['attacks'] = count.count;
            }
        })

        return results;
    })

    Object.keys(res).map(key => {
        if(res[key]['benigns'] == undefined){
            res[key]['benigns'] = 0;
        }
    })

    return res;

}

/**
 * Return an array with every target and its attack per hour
 *
 * @param {*} targets
 */
async function attacksPerHour(fromHour){
    var targets = await getTargets();
    var ips = targets.map(target => {
        return target.ip;
    })

    var counts = await countFlows(ips, fromHour);

    var stats = targets.map(ob => {
        var ip = ob['ip'];
        if(counts[ip] != null){
            count = counts[ip];
            var stat = (count['attacks'] / (count['attacks'] + count['benigns']) * 100).toFixed(2);
        }
        else {
            var stat = 0;
        }
        
        return {ip: ip, stat: stat, blocked: ob['blocked']}
    })


    return stats

}

module.exports ={
    getTarget,
    getTargets,
    setIPTarget,
    removeIPTarget,
    attacksPerHour
}