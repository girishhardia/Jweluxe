const mysql = require('mysql');
const connection = mysql.createConnection({
    user: 'root',
    password: 'Niraj123@',
    host: 'localhost',
    port: 3306,
    database: 'project1',
});
connection.connect(err => {
    if (err) throw err;
    else {
        console.log('Database Connection Established Successfully!!!');
    }
});

module.exports = connection;
