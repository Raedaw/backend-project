const db = require("../db/connection");

exports.fetchArticleByID = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      //console.log(result.rows);

      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `article ID ${article_id} does not exist`,
        });
      }
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
