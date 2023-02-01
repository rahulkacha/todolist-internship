require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const sql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.set("views", path.join("./front-end/", "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join("./front-end/", "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

const dbConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "testdb",
  port: 3308,
};
//GET API
app.get("/database", function (req, res) {
  const connection = sql.createConnection(dbConfig);

  connection.connect();

  connection.query("SELECT * from Persons", (err, rows, fields) => {
    if (err) throw err;

    console.log("The solution is: ", rows);
  });

  connection.end();
});

app.listen(5000, () => {
  console.log("listening on port 5000.");
});
