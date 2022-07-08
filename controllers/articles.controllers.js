//const db = require("../db/data");
const fs = require("fs");
const { checkArticleExists } = require("../db/helpers/utils");
const {
  fetchArticleByID,
  updateArticleVotes,
  selectArticles,
  fetchArticleComments,
  addComment,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  updateArticleVotes(article_id, req.body)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleComments(article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  // console.log(article_id.match(/^[\d]+/g) === null);

  addComment(article_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getApi = (req, res) => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    res.status(200).send({ data });
  });
  // .then((data) => {
  //   console.log(data);
  // });
};
