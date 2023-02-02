require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const sql = require("mysql2");
const bodyParser = require("body-parser");
const moment = require("moment");
const path = require("path");
const { dbConfig } = require("./dbConfig");

const app = express();

app.set("views", path.join("./front-end/", "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join("./front-end/", "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const connection = sql.createConnection(dbConfig);

  connection.connect();

  const query = "SELECT * from Todolists ORDER BY taskID";

  connection.query(query, (err, rows, fields) => {
    if (err) {
      throw err;
    } else {
      const pendingTasks = rows.filter((x) => x.isDone == 0);
      const completedTasks = rows.filter((x) => !pendingTasks.includes(x));
      res.render("index", {
        pendingTasks: pendingTasks,
        completedTasks: completedTasks,
        moment: moment,
      });
    }
  });

  connection.end();
});

app.post("/add", (req, res) => {
  const connection = sql.createConnection(dbConfig);

  if (req.body.desc.length != 0) {
    connection.connect();

    const query = `insert into TodoLists (taskDesc, time) values('${req.body.desc.trim()}', NOW());`;

    connection.query(query, (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/");
      }
    });

    connection.end();
  }
});

app.get("/update/:updateId", (req, res) => {
  const connection = sql.createConnection(dbConfig);

  connection.connect();

  const query = `update TodoLists set isDone = Abs(isDone -1) where taskId = ${req.params.updateId}`;

  connection.query(query, (err, rows, fields) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/");
    }
  });

  connection.end();
});

app.get("/delete/:deleteId", (req, res) => {
  const connection = sql.createConnection(dbConfig);

  connection.connect();

  const query = `delete from TodoLists where taskID = ${req.params.deleteId}`;

  connection.query(query, (err, rows, fields) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/");
    }
  });

  connection.end();
});

app.listen(5000, () => {
  console.log("listening on port 5000.");
});
