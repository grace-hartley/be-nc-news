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
  return Promise.all([
    db.query(
      "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url FROM articles ORDER BY created_at DESC"
    ),
    db.query(
      "SELECT article_id, COUNT(comment_id) AS comment_count FROM comments GROUP BY article_id"
    ),
  ]).then(([articlesResult, commentsResult]) => {
    const articles = articlesResult.rows;
    const commentCounts = {};

    commentsResult.rows.forEach((row) => {
      commentCounts[row.article_id] = Number(row.comment_count);
    });

    const articlesWithComments = articles.map((article) => {
      return {
        ...article,
        comment_count: commentCounts[article.article_id] || 0,
      };
    });
    return articlesWithComments;
  });
};
