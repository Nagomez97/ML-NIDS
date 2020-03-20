const logger = require('../../config/log/logsConfig');
const sniffer = require('../sniffer/sniffer');
const networks = require('../utils/networks');
const system = require('../utils/system');
const Flows = require('../database/flows');
const Utils = require('../utils/hours');

const _temp = `${__dirname}/../temp/`;


/**
 * Starts the sniffer loop and checks for valid input fields
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function startSniffer(req, res){
    var iface = req.body.interface;
    var timeout = req.body.timeout;
    
    if(iface == null || timeout == null || ! (new RegExp('^\\d+$').test(timeout)) ){
        logger.error(`CORE \t\t Invalid fields`);
        return res.status(400).json({
            status: 'ERROR',
            message: 'Invalid fields'
        })
    }
    else if(networks.interfaceData(iface) == -1){
        logger.error(`CORE \t\t Invalid interface`);
        return res.status(400).json({
            status: 'ERROR',
            message: 'Invalid interface'
        })
    }

    logger.info(`CORE \t\t Starting sniffer...`);

    sniffer.sniff(iface, timeout);

    return res.status(200).json({
        status: 'OK',
        message: 'Sniffer started'
    })
}   

/**
 * Sends the stop signal to the sniffer
 *
 * @param {*} req
 * @param {*} res
 */
async function stopSniffer(req, res){
    logger.info(`CORE \t\t Stopping sniffer...`);
    try{
        sniffer.stop();
    } catch(err){
        logger.error(`CORE \t\t Error stopping sniffer ${err}`);
        return res.status(500).json({
            status: 'ERROR',
            message: 'Error stopping sniffer'
        })
    }
    

    return res.status(200).json({
        status: 'OK',
        message: 'Sniffer stopped'
    })
}

async function resetSniffer(req, res){
    logger.info(`CORE \t\t Sniffer reset: Clearing temp files`);
    var pcaps = `${_temp}pcap`;
    var csvs = `${_temp}csv`;

    system.clear_directory(pcaps);
    system.clear_directory(csvs);

    return res.status(200).json({
        status: 'OK',
        message: 'Sniffer reset'
    })
}

/**
 * Destroys all flows from database
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function destroyAllFlows(req, res){
    logger.info(`CORE \t\t Destroying flows on DDBB.`);
    Flows.destroyAll();

    return res.status(200).json({
        status: 'OK',
        message: 'Flows destroyed'
    })
}

/**
 * Return an array of flows between the specified hour and the next
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getFromHour(req, res){
    var hour = req.query.hour; // integer between 0-23

    if(hour == null || hour % 1 != 0 || hour > 23 || hour < 0){ // Checks if hour is an integer and between 0 and 23
        return res.status(400).json({
            'flows': []
        });
    }
    
    var fromHour = Utils.get24DateFromHour(hour);
    var toHour = Utils.get24DateToHour((parseInt(hour, 10) + 1) % 24);

    logger.debug(`CORE \t\t Requested flows between ${fromHour} and ${toHour}`);


    var flows = await Flows.getFlowsByInterval(fromHour, toHour);

    return res.status(200).json({
        'flows': flows
    })

}

/**
 * Return an array of flows from the last hour
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getCurrentHour(req, res){ 
    var fromHour = Utils.getLastHour();

    logger.debug(`CORE \t\t Requested flows from ${fromHour}`);


    var flows = await Flows.getFlowsFromHour(fromHour);

    return res.status(200).json({
        'data': flows
    })

}

async function getByIpSrc(req, res){

}

module.exports = {
    startSniffer,
    stopSniffer,
    resetSniffer,
    destroyAllFlows,
    getByIpSrc,
    getFromHour,
    getCurrentHour
}