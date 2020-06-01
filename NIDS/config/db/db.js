const logger = require('../../config/log/logsConfig');

//==============================
// Environment
//==============================
process.env.ENV = process.env.ENV || 'development';

//==============================
// Express Port
//==============================
process.env.PORT = process.env.PORT != null ? process.env.PORT : 8080;

// console.log(process.env)

if(process.env.DB_USERNAME == null || process.env.DB_PASSWORD == null){
    // logger.error(`SEQUELIZE \t Empty environment variables.`);
}

//==============================
// DDBB config connection
//==============================
module.exports = {
    development: {
        // username: process.env.DB_USERNAME,
        username: 'nacho',
        // password: process.env.DB_PASSWORD,
        password: 'nacho',
        database: 'NIDS',
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
    }
};