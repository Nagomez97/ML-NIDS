const Flows = require('../models/index').flows;
const logger = require('../../config/log/logsConfig');

async function newFlow(flowData){
    await Flows.create({
        ip_src: flowData.ip_src,
        ip_dst: flowData.ip_dst,
        port_dst: flowData.port_dst,
        label: flowData.label,
        timestamp: flowData.timestamp
    }).then(promise => {
        return promise.dataValues.id;
    }).catch((err) => {
        logger.error(`FLOWS DATABASE \t Error creating flow. ${err}`);
        return null;
    });
}

var data = {
    ip_src: '192.168.1.1',
    ip_dst: '192.168.1.40',
    port_dst: '8080',
    label: 'attack',
    timestamp:'01:24:33'
}
newFlow(data);

module.exports = {
    newFlow
}