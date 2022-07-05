const express = require("express");
//const connection = require("./db/connection");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleByID } = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");
//app.use(express.json())

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/users", getUsers);

//error handling:
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else res.sendStatus(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
