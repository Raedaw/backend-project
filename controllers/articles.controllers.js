//const db = require("../db/data");
const {
  fetchArticleByID,
  updateArticleVotes,
  selectArticles,
  fetchArticleComments,
  checkArticleExists,
} = require("../models/articles.models");

exports.getArticles = (req, res) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
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

exports.getArticleComments = async (req, res, next) => {
  const { article_id } = req.params;
  const comments = await fetchArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
