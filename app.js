require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const sql = require("mssql");
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

// config for your database

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: "localhost",
  port: 3308,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {},
};

sql.connect(sqlConfig, (err) => {
  if (err) {
    console.log(err);
  } else {
    new sql.Request().query("select * from todolists", (err, result) => {
      // ... error checks

      console.dir(result);
    });
  }
});

app.listen(5000, () => {
  console.log("listening on port 5000.");
});
