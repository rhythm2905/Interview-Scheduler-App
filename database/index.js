require('dotenv').config();
const mysql = require('mysql');

function connect(mysqlConnection) {
    mysqlConnection.connect(function(err) {
        if (err) throw err;
        console.log(`Database Connected!`);
    });
}

function disconnect(mysqlConnection) {
    mysqlConnection.end();
}

module.exports = {
    connect,
    disconnect
};