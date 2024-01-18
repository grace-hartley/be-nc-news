const { checkArticleIdExists } = require("../check-exists");
const {
  findArticleById,
  findArticles,
  findArticleComments,
  insertComment,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  findArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  findArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  const findArticleCommentsQuery = findArticleComments(article_id);
  const queries = [findArticleCommentsQuery];

  if (article_id) {
    const idExistenceQuery = checkArticleIdExists(article_id);
    queries.push(idExistenceQuery);
  }

  Promise.all(queries)
    .then(([articleComments, idExistence]) => {
      res.status(200).send({ comments: articleComments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment({ article_id, username, body })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
