const fs = require('fs');

//==============================
// Environment
//==============================
process.env.ENV = process.env.ENV || 'test';
// process.env.ENV = process.env.ENV || 'test';


//==============================
// Express Port
//==============================
process.env.PORT = process.env.PORT != null ? process.env.PORT : 8080;

//==============================
// DDBB config connection
//==============================
module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'mysql',
        logging: false,
    },
    test: {
        username: 'nacho',
        password: 'nacho',
        database: 'NIDS',
        host: '127.0.0.1',
        dialect: 'mysql',
        logging: false
    }
};