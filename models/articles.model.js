const db = require("../db/connection");
const { findTopics } = require("./topics.model");

exports.findArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ msg: "Article Not Found" });
      }
      return result.rows[0];
    });
};

exports.findArticles = (topic) => {
  const queryValues = [];

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url 
  ORDER BY created_at DESC`;

  return db.query(queryStr, queryValues).then((result) => {
    return result.rows;
  });
};

exports.findArticleComments = (article_id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id 
      FROM articles
      JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      ORDER BY created_at DESC
      `,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertComment = ({ article_id, username, body }) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) 
      VALUES ($1, $2, $3) 
      RETURNING *;`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticle = ({ article_id, inc_votes }) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
