const fs = require('fs');
const logger = require('../../config/log/logsConfig');
const path = require('path');

/**
 * Creates file as writable
 *
 * @param {*} filename
 * @returns
 */
function create_file(filename){
    try{
        // fs.closeSync(fs.openSync(filename, 'w'));
        fs.writeFileSync(filename, "", (err) => {
            logger.error(`SYSTEM \t Error creating file. ${filename}. ${err}`)
        })
        fs.chmodSync(filename, 0766);
    } catch(err){
        logger.error(`SYSTEM \t\t Eror creating file ${filename}. ${err}`);
        return null;
    }

    return filename;
}

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
                logger.debug(`SYSTEM \t\t File ${filename} removed.`);
            });
        }
    } catch (err) {
        logger.error(`SYSTEM \t\t Error removing temporary file ${ filename }`);
        return null;
    }
}

async function clear_directory(dirname){

    try{
        fs.readdir(dirname, (err, files) => {
            if (err) throw err;
        
            for (const file of files) {
            fs.unlinkSync(path.join(dirname, file), err => {
                if (err) throw err;
                else{
                    logger.info(`SYSTEM \t\t File ${file} removed`);
                }
            });
            }

            logger.info(`SYSTEM \t\t Directory ${dirname} cleared`);
        });
    } catch(err){
        logger.error(`SYSTEM \t\t Error clearing directory ${dirname}: ${err}`);
        return;
    }
}


module.exports = {
    remove_file,
    create_file,
    clear_directory
}