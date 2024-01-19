const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const {
  getArticleById,
  getArticles,
  getArticleComments,
  addComment,
  patchArticle,
} = require("./controllers/articles.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

// Error handling

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path does not exist" });
});

app.use((err, req, res, next) => {
  if (err.msg === "Article Not Found") {
    res.status(404).send({ msg: "Article does not exist" });
  }
  if (err.msg === "Comment Not Found") {
    res.status(404).send({ msg: "Comment does not exist" });
  } else if (err.msg === "Topic Not Found") {
    res.status(400).send({ msg: "Topic Not Found" });
  } else if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "username does not exist" });
  } else {
    next(err);
  }
});

module.exports = app;
