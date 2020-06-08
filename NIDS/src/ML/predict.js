const spawn = require('child_process').spawn;
const {csv2ddbb} = require('../database/csv2database');
const logger = require('../../config/log/logsConfig');

const fs = require('fs');


/**
 * Launches the python module for the ML model
 * After the execution, calls to csv2ddbb and writes the output on ddbb
 *
 * @param {*} filename
 */
async function predictML(filename){
        logger.debug(`ML MODULE \t Launching model.py...`);

        // var log = fs.createWriteStream("model.lg");

        const pyprocess = spawn('python3', [`${__dirname}/model.py`, filename], {stdio: [null, process.stderr, process.stderr]})

        pyprocess.on('exit', (code) => {
            if(code == 0){
                logger.debug('ML MODULE \t successfully finished.')
                csv2ddbb(filename);
            }
            else if(code == 3){
                logger.error(`ML MODULE \t File not found: ${filename}`)
            }
            else if(code == 4){
                logger.error(`ML MODULE \t Error in prediction. Maybe no data avilable`)
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