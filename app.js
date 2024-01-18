const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const {
  getArticleById,
  getArticles,
  getArticleComments,
  addComment,
} = require("./controllers/articles.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", addComment);

// Error handling

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path does not exist" });
});

app.use((err, req, res, next) => {
  if (err.msg === "Not Found") {
    res.status(404).send({ msg: "article does not exist" });
  } else if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

module.exports = app;
