const spawn = require('child_process').spawn;
const {csv2ddbb} = require('../database/csv2database');
const logger = require('../../config/log/logsConfig');


/**
 * Launches the python module for the ML model
 * After the execution, calls to csv2ddbb and writes the output on ddbb
 *
 * @param {*} filename
 */
async function predictML(filename){
        logger.debug(`ML MODULE \t Launching model.py...`);

        const pyprocess = spawn('python3', [`${__dirname}/model.py`, filename])

        pyprocess.on('exit', (code) => {
            if(code == 0){
                csv2ddbb(filename);
            }
            else{
                logger.error(`ML MODULE \t Error launching model. Code = ${code}`);
                return;
            }
        })
}

module.exports = {
    predictML
}