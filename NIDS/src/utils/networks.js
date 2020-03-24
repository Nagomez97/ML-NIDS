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

/**
 * Returns an array with the name of all the interfaces available on the host
 *
 */
function getInterfaces(){
    let ifaces = os.networkInterfaces();
    return Object.keys(ifaces)
}

module.exports = {
    interfaceData,
    getInterfaces
}