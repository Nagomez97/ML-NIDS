const os = require('os');


/**
 * Checks if an interface exists. Returns the interface data or -1
 *
 * @param {*} interface
 * @returns
 */
function interfaceData(interface) {
    let ifaces = os.networkInterfaces();
    return (interface in ifaces) ? ifaces[interface] : -1;
}

module.exports = {
    interfaceData
}