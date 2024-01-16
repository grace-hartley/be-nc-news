const db = require("../db/connection");

exports.findArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ msg: "Not Found" });
      }
      return result.rows[0];
    });
};

exports.findArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url 
      ORDER BY created_at DESC`
    )
    .then((result) => {
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