const { spawn } = require('child_process');
const fs = require('fs');
const logger = require('../../config/log/logsConfig');


/**
 * Removes file
 *
 * @param {*} filename
 * @returns
 */
async function remove_file(filename){
    try {
        if (fs.existsSync(filename)) {
            fs.unlink(filename, function(err) {
                // if no error, file has been deleted successfully
                logger.debug(`TSHARK \t\t File ${filename} removed.`);
            });
        }
    } catch (err) {
        logger.error(`TSHARK \t\t Error removing temporary file ${ filename }`);
        return null;
    }
}

async function tshark(iface, duration, filename){

    var command = ['-i', iface, '-a', `duration:${duration}`, '-w', filename]

    var child = spawn('tshark', command, {
        shell: true
    });

    child.on('error', async (code) => {
        logger.error(`TSHARK \t\t Error code ${code}.`);
        await remove_file(filename);
    });

    child.on('exit', (code) => {
        switch (code) {
            case 2:
                logger.error(`TSHARK \t\t Error creating output file. Maybe higher permissions?`);
                remove_file(filename);
            case 1:
                logger.error(`TSHARK \t\t Permission error. Try again running as sudo.`);
                remove_file(filename);
                return -1;
            default:
                logger.debug(`TSHARK \t\t Finished.`);
                return 0;
        }
    })
}

module.exports = { tshark };