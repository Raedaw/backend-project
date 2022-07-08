const db = require("../db/connection");
const {
  checkArticleExists,
  checkExists,
  checkValidArticleID,
} = require("../db/helpers/utils");

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortOptions = [
    "created_at",
    "article_id",
    "author",
    "title",
    "topic",
    "votes",
    "comment_count",
  ];
  const validOrderOptions = ["ASC", "DESC"];

  if (!validSortOptions.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: `${sort_by} is not a valid sort by option`,
    });
  }

  if (!validOrderOptions.includes(order)) {
    return Promise.reject({ status: 400, msg: `invalid 'order by' input` });
  }

  let topicStr = "";
  if (topic !== undefined) {
    topicStr = `WHERE articles.topic = '${topic}' `;
  }
  const checkTopicExists = checkExists("topics", "slug", topic);

  return checkTopicExists.then(() => {
    return db
      .query(
        `SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.body, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ${topicStr}GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
      ) /// make sure to fix sql injection^
      .then((result) => {
        //console.log(result.rows);
        return result.rows;
      });
  });
};

exports.fetchArticleByID = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles INNER JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then((result) => {
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
      if (!votesObj.hasOwnProperty("inc_votes")) {
        return Promise.reject({
          status: 400,
          msg: `Missing required fields`,
        });
      }
      if (typeof votesObj.inc_votes !== "number") {
        return Promise.reject({
          status: 400,
          msg: `Invalid input`,
        });
      }
      const article = result.rows[0];
      article.votes += newVotes;
      return article;
    });
};

exports.fetchArticleComments = (article_id) => {
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1;",
      [article_id]
    )
    .then((result) => {
      return Promise.all([result.rows, checkArticleExists(article_id)]);
    })
    .then(([comment, error]) => {
      return comment;
    });
};

exports.addComment = (article_id, newComment) => {
  const { username, body } = newComment;
  if (article_id.match(/^[\d]+/g) === null) {
    return Promise.reject({ status: 400, msg: `Invalid article ID` });
  }
  const usernameExists = checkExists("users", "username", username);
  const articleExists = checkExists("articles", "article_id", article_id);
  return Promise.all([usernameExists, articleExists]).then(() => {
    return db
      .query(
        "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
        [username, body, article_id]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};

exports.removeComment = (comment_id) => {
  if (comment_id.match(/^[\d]+/g) === null) {
    return Promise.reject({ status: 400, msg: `Invalid comment ID` });
  }
  return checkExists("comments", "comment_id", comment_id).then(() => {
    return db
      .query("DELETE FROM comments WHERE comment_id = $1;", [comment_id])
      .then((result) => {
        return result.rows;
      });
  });
};
