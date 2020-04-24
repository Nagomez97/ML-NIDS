const logger = require('../../config/log/logsConfig');
const sniffer = require('../sniffer/sniffer');
const networks = require('../utils/networks');
const system = require('../utils/system');
const Flows = require('../database/flows');
const Targets = require('../database/targets');
const Utils = require('../utils/hours');

const _temp = `${__dirname}/../temp/`;

var _running = false;


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

    logger.info(`CORE \t\t Starting sniffer on interface ${iface}...`);

    sniffer.sniff(iface, timeout);
    _running = true

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
    
    _running = false;

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

    if(hour == '-1' || hour == null || hour == 'Now'){
        return await getCurrentHour(req, res);
    }

    if(hour % 1 != 0 || hour > 23 || hour < 0){ // Checks if hour is an integer and between 0 and 23
        return res.status(400).json({
            'flows': []
        });
    }
    
    var fromHour = Utils.get24DateFromHour(hour);
    var toHour = Utils.get24DateToHour((parseInt(hour, 10) + 1) % 24);

    logger.debug(`CORE \t\t Requested flows between ${fromHour} and ${toHour}`);


    var flows = await Flows.getFlowsByInterval(fromHour, toHour);

    return res.status(200).json({
        'data': flows
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

/**
 * Checks if the sniffer is running
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function isRunning(req, res){
    return res.status(200).json({
        'running': _running
    });
}

/**
 * Returns an array with the network interfaces of the host
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getInterfaces(req, res){
    var ifaces = networks.getInterfaces();

    return res.status(200).json({
        'interfaces': ifaces
    })
}

/**
 * Returns data for the traffic/time chart
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getTimeTrafficData(req, res){
    var hour = req.query.hour; // integer between 0-23
    var flows = []

    if(hour == '-1' || hour == null || hour == 'Now'){
        var fromHour = Utils.getLastHour();

        flows = await Flows.getFlowsFromHour(fromHour);

        chartData = {}

        flows = flows.map(flow => {
            flow.len = flow.len_fwd + flow.len_bwd
            flow.timestamp = flow.timestamp.substring(0, flow.timestamp.length - 3) // Remove seconds

            if(chartData[flow.timestamp] == null){
                chartData[flow.timestamp] = {
                    'timestamp': flow.timestamp,
                    'len': flow.len
                }
            }
            else {
                chartData[flow.timestamp].len += flow.len
            }

            return flow
        })
        
        return res.status(200).json({
            'chartData': chartData
        })
    }

    if(hour % 1 != 0 || hour > 23 || hour < 0){ // Checks if hour is an integer and between 0 and 23
        return res.status(400).json({
            'flows': []
        });
    }
    
    var fromHour = Utils.get24DateFromHour(hour);
    var toHour = Utils.get24DateToHour((parseInt(hour, 10) + 1) % 24);

    logger.debug(`CORE \t\t Requested flows between ${fromHour} and ${toHour}`);


    flows = await Flows.getFlowsByInterval(fromHour, toHour);

    // Once we have all the flows within an hour, we want to group them on every minute
    // and sum the amount of data sent within that minute.

    chartData = {}

    flows = flows.map(flow => {
        flow.len = parseFloat(((flow.len_fwd + flow.len_bwd) / 1000000).toFixed(2))
        flow.timestamp = flow.timestamp.substring(0, flow.timestamp.length - 3) // Remove seconds

        if(chartData[flow.timestamp] == null){
            chartData[flow.timestamp] = {
                'timestamp': flow.timestamp,
                'len': flow.len
            }
        }
        else {
            chartData[flow.timestamp].len = parseFloat(chartData[flow.timestamp].len) + flow.len
        }

        return flow
    })
    
    return res.status(200).json({
        'chartData': chartData
    })

}

/**
 * Returns data for the Traffic/IP chart
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getIPTrafficData(req, res){
    var hour = req.query.hour; // integer between 0-23
    var flows = []

    if(hour == '-1' || hour == null || hour == 'Now'){
        var fromHour = Utils.getLastHour();

        flows = await Flows.getFlowsFromHour(fromHour);

        chartData = {}

        flows = flows.map(flow => {
            // len in Mb
            flow.len = parseFloat(((flow.len_fwd + flow.len_bwd) / 1000000).toFixed(2))
            flow.ip_src = flow.ip_src

            if(chartData[flow.ip_src] == null){
                chartData[flow.ip_src] = flow.len
            }
            else {
                chartData[flow.ip_src] = parseFloat(chartData[flow.ip_src]) + flow.len
            }

            return flow
        })
        
        return res.status(200).json({
            'chartData': chartData
        })
    }

    if(hour % 1 != 0 || hour > 23 || hour < 0){ // Checks if hour is an integer and between 0 and 23
        return res.status(400).json({
            'flows': []
        });
    }
    
    var fromHour = Utils.get24DateFromHour(hour);
    var toHour = Utils.get24DateToHour((parseInt(hour, 10) + 1) % 24);

    logger.debug(`CORE \t\t Requested flows between ${fromHour} and ${toHour}`);


    flows = await Flows.getFlowsByInterval(fromHour, toHour);

    // Once we have all the flows within an hour, we want to group them on every minute
    // and sum the amount of data sent within that minute.

    chartData = {}

    flows = flows.map(flow => {
        flow.len = flow.len_fwd + flow.len_bwd
        flow.ip_src = flow.ip_src

        if(chartData[flow.ip_src] == null){
            chartData[flow.ip_src] = flow.len
        }
        else {
            chartData[flow.ip_src].len += flow.len
        }

        return flow
    })
    
    return res.status(200).json({
        'chartData': chartData
    })

}

/**
 * Returns data for the Attacks/IP chart
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getAttacksIPData(req, res){
    var hour = req.query.hour; // integer between 0-23
    var flows = []

    if(hour == '-1' || hour == null || hour == 'Now'){
        var fromHour = Utils.getLastHour();

        flows = await Flows.getFlowsFromHour(fromHour);

        chartData = {}
        raw_data = {}

        flows = flows.map(flow => {
            // Ammount of attacks

            if(raw_data[flow.ip_src] == null){
                raw_data[flow.ip_src] = {
                    'attacks': 0,
                    'benigns': 0
                }
            }
            if(flow['label'] == 'Attack'){
                raw_data[flow.ip_src]['attacks'] += 1;
            }
            else{
                raw_data[flow.ip_src]['benigns'] += 1;
            }

            return flow
        })

        // Real chart data in %
        Object.keys(raw_data).map(ip => {
            chartData[ip] = raw_data[ip]['attacks'] /  (raw_data[ip]['benigns'] + raw_data[ip]['attacks']) * 100;
            return ip;
        })
        
        return res.status(200).json({
            'chartData': chartData
        })
    }

    if(hour % 1 != 0 || hour > 23 || hour < 0){ // Checks if hour is an integer and between 0 and 23
        return res.status(400).json({
            'flows': []
        });
    }
    
    var fromHour = Utils.get24DateFromHour(hour);
    var toHour = Utils.get24DateToHour((parseInt(hour, 10) + 1) % 24);

    logger.debug(`CORE \t\t Requested flows between ${fromHour} and ${toHour}`);


    flows = await Flows.getFlowsByInterval(fromHour, toHour);

    // Once we have all the flows within an hour, we want to group them on every minute
    // and sum the amount of data sent within that minute.

    chartData = {}
    raw_data = {}

    flows = flows.map(flow => {
        // Ammount of attacks

        if(raw_data[flow.ip_src] == null){
            raw_data[flow.ip_src] = {
                'attacks': 0,
                'benigns': 0
            }
        }
        if(flow['label'] == 'Attack'){
            raw_data[flow.ip_src]['attacks'] += 1;
        }
        else{
            raw_data[flow.ip_src]['benigns'] += 1;
        }

        return flow
    })

    // Real chart data in %
    Object.keys(raw_data).map(ip => {
        chartData[ip] = raw_data[ip]['attacks'] /  (raw_data[ip]['benigns'] + raw_data[ip]['attacks']) * 100;
        return ip;
    })
    
    return res.status(200).json({
        'chartData': chartData
    })

}

/**
 * Creates a target given an IP
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function setTarget(req, res){
    var ip = req.body.ip;
    console.log(req.body)
    if(ip == null){
        logger.error(`CORE \t\t Empty ip whet setting target`);
        return res.status(400);
    }

    Targets.setIPTarget(ip);
    logger.info(`CORE \t\t Target ${ip} added`)
    return res.status(200);
}

/**
 * Removes a target given an IP
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function removeTarget(req, res){
    var ip = req.body.ip;
    if(ip == null){
        logger.error(`CORE \t\t Empty ip whet deleting target`);
        return res.status(400);
    }

    Targets.removeIPTarget(ip);
    return res.status(200);
}



module.exports = {
    startSniffer,
    stopSniffer,
    resetSniffer,
    destroyAllFlows,
    getFromHour,
    getCurrentHour,
    isRunning,
    getInterfaces,
    getTimeTrafficData,
    getIPTrafficData,
    getAttacksIPData,
    setTarget,
    removeTarget
}