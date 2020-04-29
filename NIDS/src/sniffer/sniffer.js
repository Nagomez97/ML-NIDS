const logger = require('../../config/log/logsConfig');
const fs = require('fs');
const { tshark } = require('./tshark');
const system = require('../utils/system');
const {flowmeter} = require('../flowmeter/flowmeter');

const _out_dir = `${__dirname}/../temp/pcap/`;

var _child = {
    process: null,
    status: null,
    filename: ''
}


/**
 * Listens for chunks of <duration> time and saves it on a pcap file at temp/pcap
 *
 * @param {*} iface
 * @param {*} duration
 */
async function sniff(iface, duration){
    var timestamp = new Date();
    var filename = `${_out_dir}${timestamp.toISOString()}.pcap`;

    await system.create_file(filename); // We need to create the file first. Tshark issue

    logger.debug(`SNIFFER \t Launching tshark...  ${filename}`)

    _child.process = await tshark(iface, duration, filename);
    _child.status = 'RUNNING';
    _child.filename = filename;

    _child.process.on('error', async (code) => {
        logger.error(`SNIFFER \t Error code ${code}.`);
        await system.remove_file(filename);
    });

    _child.process.on('exit', (code) => {
        switch (code) {
            case 9:
                logger.info(`SNIFFER \t Stopped.`);
                return 0;
            case 2:
                logger.error(`SNIFFER \t Error creating output file. Maybe higher permissions?`);
                system.remove_file(filename);
                return -1;
            case 1:
                logger.error(`SNIFFER \t Permission error. Try again running as sudo.`);
                system.remove_file(filename);
                return -1;
            case 0:
                logger.debug(`SNIFFER \t Tshark finished. Launching FlowMeter.`);
                if(_child.status != 'STOPPED'){
                    flowmeter(filename);
                    sniff(iface, duration); //Loops
                }
                return 0;
            default:
                logger.info(`SNIFFER \t Stopped.`);
                return -1;
        }
    })
}

/**
 * Kills the child process and removes its output file
 *
 * @returns
 */
function stop(){
    _child.status = 'STOPPED';
    system.remove_file(_child.filename);
    
    process.kill(_child.process.pid, 'SIGKILL');
    
    return;
}

module.exports = {
    sniff,
    stop
}