require("dotenv").config({path:"/config"});
const sql = require("mysql2");

const connection = sql.createConnection( {
  host: "localhost",
  user: "root" ,//your username
  password: "Rk@322002", //your password
  database: "todolistdb",
  port: 3308, //your port
});

connection.connect();

// this query will create a new table
const query = `CREATE TABLE todolists
   (taskID int NOT NULL AUTO_INCREMENT,
    taskDesc varchar(255) DEFAULT NULL,
    time datetime DEFAULT NULL,
    isDone tinyint(1) DEFAULT 0,
    PRIMARY KEY (taskID));`;

connection.query(query, (err, rows, fields) => {
  if (err) {
    throw err;
  } else {
    console.log(rows);
  }
});

connection.end();
