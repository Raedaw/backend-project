const db = require("../db/connection");

exports.fetchArticleByID = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles INNER JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

//SELECT * FROM articles WHERE article_id = $1;
