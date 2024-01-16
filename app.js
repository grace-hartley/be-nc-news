const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

// Error handling

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path does not exist" });
});

app.use((err, req, res, next) => {
  if (err.msg === "Not Found") {
    res.status(404).send({ msg: "article does not exist" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

module.exports = app;
