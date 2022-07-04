const db = require("../db/connection");

exports.fetchArticleByID = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateArticleVotes = (article_id, votesObj) => {
  const newVotes = votesObj.inc_votes;
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      const article = result.rows[0];
      article.votes += newVotes;
      return article;
    });
};
