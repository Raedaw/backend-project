const express = require("express");
//const connection = require("./db/connection");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");
//app.use(express.json())
const {
  getArticleByID,
  patchArticleVotes,
  getArticles,
  getArticleComments,
  postComment,
  deleteComment,
} = require("./controllers/articles.controllers");
const {
  handleInvalidPaths,
  handle500,
  handleInvalidInput,
  handleCustomErrors,
  handleArticle404,
} = require("./error-handling");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.patch("/api/articles/:article_id", patchArticleVotes);
app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

//error handling:

app.use("*", handleInvalidPaths);

app.use(handleCustomErrors);
app.use(handleInvalidInput);
app.use(handleArticle404);
app.use(handle500);

module.exports = app;
