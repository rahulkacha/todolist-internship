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

app.listen(5000, () => {
  console.log("listening on port 5000.");
});
