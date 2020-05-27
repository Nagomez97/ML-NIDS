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

    var res = await Targets.findOne({
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

    var res = await Targets.findAll({
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
 *Returns the number of attack-benign flows for the given src_IPs
 *
 * @param {*} ip
 */
async function countFlowsFrom(ips, fromHour){
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
            if(count.label.includes('Benign')){
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
        else if(res[key]['attacks'] == undefined){
            res[key]['attacks'] = 0;
        }
    })

    return res;

}

/**
 *Returns the number of attack-benign flows for the given dest_IPs
 *
 * @param {*} ip
 */
async function countFlowsTo(ips, fromHour){
    var res = await Flows.findAll({
        attributes: ['ip_dst', 'label', [sequelize.fn('count', sequelize.col('label')), 'count']],
        group : ['ip_dst', 'label'],
        raw: true,
        where: {
            ip_dst: ips,
            timestamp : {
                [Op.gte]: fromHour
            }
        }
    }).then(res => {
        var results = {};
        res.map(count => {
            if(results[count.ip_dst] == null){
                results[count.ip_dst] = {}
            }
            if(count.label.includes('Benign')){
                results[count.ip_dst]['benigns'] = count.count;
            }
            else{
                results[count.ip_dst]['attacks'] = count.count;
            }
        })

        return results;
    })


    Object.keys(res).map(key => {
        if(res[key]['benigns'] == undefined){
            res[key]['benigns'] = 0;
        }
        else if(res[key]['attacks'] == undefined){
            res[key]['attacks'] = 0;
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

    var counts_from = await countFlowsFrom(ips, fromHour);
    var counts_to = await countFlowsTo(ips, fromHour);

    var stats = targets.map(ob => {
        var ip = ob['ip'];

        // Get proportion of attacks against target
        if(counts_from[ip] != null){
            count = counts_from[ip];
            var stat_from = (count['attacks'] / (count['attacks'] + count['benigns']) * 100).toFixed(2);
        }
        else {
            var stat_from = "0.00";
        }

        // Get proportion of attacks fired by target
        if(counts_to[ip] != null){
            count = counts_to[ip];
            var stat_to = (count['attacks'] / (count['attacks'] + count['benigns']) * 100).toFixed(2);
        }
        else {
            var stat_to = "0.00";
        }
        
        return {ip: ip, stat_from: stat_from, stat_to: stat_to, blocked: ob['blocked']}
    })


    return stats

}

/**
 * Returns the number of attacks against each IP
 *
 * @param {*} attacker
 * @param {*} fromHour
 * @returns
 */
async function getAttacksFromIP(attacker, fromHour){
    var result = await Flows.findAll({
        attributes: ['ip_dst', [sequelize.fn('count', sequelize.col('label')), 'attacks']],
        group : ['ip_dst'],
        raw: true,
        where: {
            ip_src: attacker,
            label: 'Attack',
            timestamp : {
                [Op.gte]: fromHour
            }
        }
    }).catch(err => {
        logger.error(`TARGETS \t Error retrieving attacks from IP: ${err}`)
        return []
    })

    if(result.length == 0){
        return [{'ip_dst': 'None', 'attacks': 1}]
    }

    // Descending sort
    result = result.sort(function (a,b){
        if(a.attacks > b.attacks) return -1;
        if(a.attacks < b.attacks) return 1;
        return 0;
    });

    var total = 0;
    result.map(x => {
        total += x['attacks'];
    });

    result.map(x => {
        x.attacks = (x.attacks / total);
        return x;
    })

    // If there are more than 10 targets, returns only the top ten
    if(result.length >= 10){
        var top = result.slice(0, 9);
        var others = result.slice(10,);
        var others_sum = 0;
        others.map(x => {others_sum += x['attacks']})

        top.push({'ip_dst': 'others', 'attacks': others_sum});

        return top;
        
    }

    return result;
}

/**
 *Returns true if a host is already targeted
 *
 * @param {*} ip
 */
async function isTargeted(ip){
    var target = await getTarget(ip);

    return target != null;
}

module.exports ={
    getTarget,
    getTargets,
    setIPTarget,
    removeIPTarget,
    attacksPerHour,
    isTargeted,
    getAttacksFromIP
}