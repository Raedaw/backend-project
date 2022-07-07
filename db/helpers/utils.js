const format = require("pg-format");
const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((article) => {
      //console.log(article);
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `article ID ${article_id} does not exist`,
        });
      }
    });
};

exports.checkExists = (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);

  return db.query(queryStr, [value]).then((result) => {
    if (column === "slug") {
      if (result.rows.length === 0 && value) {
        return Promise.reject({ status: 404, msg: `topic does not exist` });
      }
    }

    if (result.rows.length === 0 && value) {
      return Promise.reject({ status: 404, msg: `${column} does not exist` });
    }
  });
};

// exports.checkValidArticleID = (article_id) => {
//   console.log(article_id.match(/^[\d]+/g));
//   // {
//   //   return Promise.reject({ status: 400, msg: `Invalid article ID` });
//   // }
//   // return;
// };

// SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes,   COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.topic = 'cats' GROUP BY articles.article_id ORDER BY article_id DESC;
