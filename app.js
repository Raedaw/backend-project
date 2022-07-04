const express = require("express");
//const connection = require("./db/connection");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
//app.use(express.json())

app.get("/api/topics", getTopics);

//error handling:

// app.all("/*", (req, res) => {
//     res.status(404).send({ msg: "Route not found" });
//   });

//   app.use((err, req, res, next) => {
//     console.log(err);
//     res.sendStatus(500);
//   });

module.exports = app;
