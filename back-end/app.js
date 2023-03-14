require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const sql = require("mysql2");
const bodyParser = require("body-parser");
const moment = require("moment");
const path = require("path");
const cors = require("cors");
const { dbConfig } = require("./configs/dbConfig");

const app = express();

app.use(cors());

app.set("views", path.join("../front-end/", "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join("../front-end/", "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// connection creation
const connection = sql.createConnection(dbConfig);

connection.connect();

app.get("/", (req, res) => {
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
});

app.post("/add", (req, res) => {
  const query = `insert into TodoLists (taskDesc, date) values('${req.body.desc.trim()}', NOW());`;

  connection.query(query, (err, rows, fields) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/");
    }
  });
});

app.get("/update/:updateId", (req, res) => {
  const query = `update TodoLists set isDone = Abs(isDone -1) where taskId = ${req.params.updateId}`;

  connection.query(query, (err, rows, fields) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/");
    }
  });
});

app.get("/delete/:deleteId", (req, res) => {
  const query = `delete from TodoLists where taskID = ${req.params.deleteId}`;

  connection.query(query, (err, rows, fields) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/");
    }
  });
});

// API ROUTES

app.get("/api", (req, res) => {
  const query = "SELECT * from Todolists ORDER BY taskID";

  connection.query(query, (err, rows, fields) => {
    if (err) {
      throw err;
    } else {
      rows.map((obj) => {
        obj.date = moment(obj.date).format("DD/MM/YYYY");
      });

      return res.json(rows);
    }
  });
});

app.post("/api/add", (req, res) => {
  const query = `insert into TodoLists (taskDesc, date) values('${req.body.desc.trim()}', '${moment(
    req.body.date
  ).format("YY-MM-DD")}');`;
  // 2023-03-02
  connection.query(query, (err, rows, fields) => {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

app.patch("/api/update/:updateId", (req, res) => {
  const query = `update TodoLists set isDone = Abs(isDone -1) where taskId = ${req.params.updateId}`;

  connection.query(query, (err, rows, fields) => {
    if (err) {
      throw err;
    } else {
      res.status(200).json({ message: "success" });
    }
  });
});

app.delete("/api/delete/:deleteId", (req, res) => {
  const query = `delete from TodoLists where taskID = ${req.params.deleteId}`;

  connection.query(query, (err, rows, fields) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      res.status(200).json({
        message:
          "successfully deleted the task with taskID: " + req.params.deleteId,
      });
    }
  });
});

app.listen(5000, () => {
  console.log("listening on port 5000.");
});
