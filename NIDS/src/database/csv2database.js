const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const logger = require('../../config/log/logsConfig');
const Flows = require('./flows');
const System = require('../utils/system');

function csv2ddbb(filename){
    try{
        var inputStream = fs.createReadStream(filename, 'utf8');
        inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true, skipHeader: true, asObject: true }))
        .on('data', function (row) {
            var data = {
                ip_src: row['Src IP'],
                ip_dst: row['Dst IP'],
                port_dst: row['Dst Port'],
                timestamp: row['Timestamp'],
                len_fwd: row['TotLen Fwd Pkts'],
                len_bwd: row['TotLen Bwd Pkts'],
                label: row['Label'],
                prob: row['Prob']
            }
            // Timestamp format to be ordered on ddbb
            // yyyy/mm/dd hh:mm:ss
            var tmp = data.timestamp.split("/");
            var end = tmp[2].split(" ");
            var ts = end[0] + '/' + tmp[1] + '/' + tmp[0] + ' ' + end[1];
            data.timestamp = ts;


            try{
                Flows.newFlow(data)
            }
            catch(err) {
                logger.error(`CSV2DDBB \t Error creating flow. Continue.`);
            }
        })
        .on('end', function (data) {
            logger.debug(`CSV2DDBB \t Finished reading csv.`);
            System.remove_file(filename);
        });
 
    } catch(err){
        logger.error(`CSV2DDBB \t Error parsing CSV file. ${err}`);
    }
}

module.exports = {
    csv2ddbb
}