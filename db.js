const mysql = require('mysql2');  // Make sure to use mysql2, not mysql

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aditya123', // your MySQL password
  database: 'aip_project'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

module.exports = connection;
