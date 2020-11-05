require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const connectDB = require("./database/index.js");
const mysql = require('mysql');
const app = express();
//app.set('view engine', 'ejs');
const mysqlConnection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.use(bodyParser.urlencoded({ extended: true }));
connectDB.connect(mysqlConnection);

//Importing Routes
require("./routes/interviewRoutes")(app, mysqlConnection);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started!");
  console.log("Listening on PORT ", chalk.inverse.green(server.address().port));
});

process.on("SIGINT", () => {
  console.log(chalk.red("\nServer Turn off Sequence Initiated!"));
  console.log(chalk.yellow("Disconnecting from Database"));
  connectDB.disconnect(mysqlConnection);
  console.log(chalk.yellow("Closing Server!"));
  server.close();
  console.log(chalk.green("Turn Off Sequence Complete! Exiting"));
  process.exit(1);
});