const { findTopics } = require("../models/topics.model");
const endpoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  findTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (req, res, next) => {
  res.status(200).send(endpoints);
};
