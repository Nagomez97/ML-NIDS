const { spawn } = require('child_process');
const logger = require('../../config/log/logsConfig');
const system = require('../utils/system');
const { csv2ddbb } = require('../database/csv2database');

const csvs = `${__dirname}/../temp/csv/`;


/**
 * Launches the flowmeter. Receives the filename of the pcap and saves the
 * csv file on temp/csv. At the end, removes the pcap to avoid space waste
 *
 * @param {*} filename
 */
async function flowmeter(filename){
    var out = csvs + filename.split('/').pop().replace('.pcap', '.pcap_Flow.csv');
    var command = [`${filename}`, `${csvs}`]

    console.log(command.join(' '))
    var child = spawn(`${__dirname}/bin/cfm`, command, {
        shell: true
    });

    child.on('error', async (code) => {
        logger.error(`FLOWMETER \t Error code ${code}.`);
        await system.remove_file(out);
    });

    child.on('exit', (code) => {
        switch (code) {
            case 2:
                logger.error(`FLOWMETER \t Exit code 2`);
                system.remove_file(filename);
                return -1;
            case 1:
                logger.error(`FLOWMETER \t Exit code 1`);
                system.remove_file(filename);
                return -1;
            default:
                logger.debug(`FLOWMETER \t Finished. Saved as ${out}`);
                csv2ddbb(out);
                system.remove_file(filename); // Remove pcap to avoid space waste
                return 0;
        }
    })
}

module.exports = {
    flowmeter
}