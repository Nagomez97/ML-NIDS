const Flows = require('../models/index').flows;
const logger = require('../../config/log/logsConfig');
const { Op } = require("sequelize");

/**
 * Creates flow entry on DDBB
 *
 * @param {*} flowData
 */
async function newFlow(flowData){
    await Flows.create({
        ip_src: flowData.ip_src,
        ip_dst: flowData.ip_dst,
        port_dst: flowData.port_dst,
        label: flowData.label,
        timestamp: flowData.timestamp,
        len_fwd: flowData.len_fwd,
        len_bwd: flowData.len_bwd
    }).then(promise => {
        return promise.dataValues.id;
    }).catch((err) => {
        logger.error(`FLOWS DATABASE \t Error creating flow. ${err}`);
        return null;
    });
}

/**
 * Destroys flow by Id
 *
 * @param {*} flowId
 */
async function destroyFlow(flowId){
    await Flows.destroy({
        where: {
            id: flowId
        }
    }).catch(err => {
        logger.error(`FLOWS DATABASE \t Error destroying flow. ${err}`);
        return null;
    })
}

/**
 * Destroys every flow
 *
 */
async function destroyAll(){
    await Flows.destroy({
        where: {},
        truncate: true
    }).catch(err => {
        logger.error(`FLOWS DATABASE \t Error destroying flow. ${err}`);
        return null;
    })
}

/**
 * Returns every flow with ip_src, ip_dst or both
 *
 * @param {*} ip_src
 * @param {*} ip_dst
 */
async function getFlowsByIp(ip_src, ip_dst){
    var condition = {}
    if(ip_src != null) condition.ip_src = ip_src;
    if(ip_dst != null) condition.ip_dst = ip_dst;

    await Flows.findAll({
        attributes: ['ip_src', 'ip_dst', 'port_dst', 'label', 'timestamp', 'len_fwd', 'len_bwd'],
        where: condition,
        order: [
            ['timestamp', 'ASC']
        ]
    }).then(res => {
        return res.map(r => {return r.dataValues});
    }).catch(err => {
        logger.error(`FLOWS DATABASE \t Error retrieving flows by IP. ${err}`);
        return null;
    })
}

/**
 * Return every flow with this port
 *
 * @param {*} port
 */
async function getFlowsByPort(port){

    await Flows.findAll({
        attributes: ['ip_src', 'ip_dst', 'port_dst', 'label', 'timestamp', 'len_fwd', 'len_bwd'],
        where: {port_dst : port},
        order: [
            ['timestamp', 'ASC']
        ]
    }).then(res => {
        return res.map(r => {return r.dataValues});
    }).catch(err => {
        logger.error(`FLOWS DATABASE \t Error retrieving flows by Port. ${err}`);
        return null;
    })
}

/**
 * Return every flow with this label
 *
 * @param {*} port
 */
async function getFlowsByLabel(label){

    await Flows.findAll({
        attributes: ['ip_src', 'ip_dst', 'port_dst', 'label', 'timestamp', 'len_fwd', 'len_bwd'],
        where: {label : label},
        order: [
            ['timestamp', 'ASC']
        ]
    }).then(res => {
        return res.map(r => {return r.dataValues});
    }).catch(err => {
        logger.error(`FLOWS DATABASE \t Error retrieving flows by label. ${err}`);
        return null;
    })
}

/**
 * Returns an array of Flows from between two dates
 *
 * @param {*} from
 * @param {*} to
 * @returns
 */
function getFlowsByInterval(from, to){
    return Flows.findAll({
        attributes: ['ip_src', 'ip_dst', 'port_dst', 'label', 'timestamp', 'len_fwd', 'len_bwd'],
        where: {
            timestamp : {
                [Op.gte]: from,
                [Op.lt]: to
            }
        },
        order: [
            ['timestamp', 'ASC']
        ]
    }).then(res => {
        return res.map(r => {return r.dataValues});
    }).catch(err => {
        logger.error(`FLOWS DATABASE \t Error retrieving flows by time interval. ${err}`);
        return null;
    })
}


/**
 * Returns an array of Flows from between two dates
 *
 * @param {*} from
 * @returns
 */
function getFlowsFromHour(from){
    return Flows.findAll({
        attributes: ['ip_src', 'ip_dst', 'port_dst', 'label', 'timestamp', 'len_fwd', 'len_bwd'],
        where: {
            timestamp : {
                [Op.gte]: from
            }
        },
        order: [
            ['timestamp', 'ASC']
        ]
    }).then(res => {
        return res.map(r => {return r.dataValues});
    }).catch(err => {
        logger.error(`FLOWS DATABASE \t Error retrieving flows from hour. ${err}`);
        return null;
    })
}

module.exports = {
    newFlow,
    destroyFlow,
    getFlowsByIp,
    getFlowsByPort,
    getFlowsByLabel,
    destroyAll,
    getFlowsByInterval,
    getFlowsFromHour
}