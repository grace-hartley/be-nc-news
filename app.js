const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

// Error handling

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path does not exist" });
});

module.exports = app;
