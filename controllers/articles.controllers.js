//const db = require("../db/data");
const { checkArticleExists } = require("../db/helpers/utils");
const {
  fetchArticleByID,
  updateArticleVotes,
  selectArticles,
  fetchArticleComments,
  addComment,
  removeComment,
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

  addComment(article_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then((response) => {
      res.status(204).send({ response });
    })
    .catch(next);
};
