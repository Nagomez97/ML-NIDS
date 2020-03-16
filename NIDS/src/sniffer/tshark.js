const { spawn } = require('child_process');


async function tshark(iface, duration, filename){

    var command = ['-i', iface, '-a', `duration:${duration}`, '-w', filename]

    var child = spawn('tshark', command, {
        shell: true
    });

    return child;
}

module.exports = { tshark };