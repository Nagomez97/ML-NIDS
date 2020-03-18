const logger = require('../../config/log/logsConfig');
const sniffer = require('../sniffer/sniffer');
const networks = require('../utils/networks');
const system = require('../utils/system');
const Flows = require('../database/flows');

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

async function destroyAllFlows(req, res){
    logger.info(`CORE \t\t Destroying flows on DDBB.`);
    Flows.destroyAll();

    return res.status(200).json({
        status: 'OK',
        message: 'Flows destroyed'
    })
}

module.exports = {
    startSniffer,
    stopSniffer,
    resetSniffer,
    destroyAllFlows
}