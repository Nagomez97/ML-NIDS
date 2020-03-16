const logger = require('../../config/log/logsConfig');
const fs = require('fs');
const { tshark } = require('./tshark');

const _out_dir = `pcaps/`;

function create_file(filename){
    fs.closeSync(fs.openSync(filename, 'w'));
    return;
}


async function sniff(iface, duration){
    var timestamp = new Date();
    var filename = `${_out_dir}${timestamp.toISOString()}.pcap`;

    create_file(filename); // We need to create the file first. Tshark issue

    logger.debug(`SNIFFER \t Launching tshark...`)

    tshark(iface, duration, filename);

    return;
}

sniff('wlp3s0', '30');