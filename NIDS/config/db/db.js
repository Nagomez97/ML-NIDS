const logger = require('../../config/log/logsConfig');

//==============================
// Environment
//==============================
process.env.ENV = process.env.ENV || 'development';

//==============================
// Express Port
//==============================
process.env.PORT = process.env.PORT != null ? process.env.PORT : 8080;

if(process.env.DB_USERNAME == null || process.env.DB_PASSWORD == null){
    logger.error(`SEQUELIZE \t Empty environment variables.`);
}

//==============================
// DDBB config connection
//==============================
module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'NIDS',
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
    }
};