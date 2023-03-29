const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { invalidRequest } = require("./controllers/errorHandle.controller");
const { getArticleById } = require("./controllers/articles.controller");

const app = express();

app.get("/api", (request, response, next) => {
  response.status(200).send({ msg: "server is up and running" }).catch(next);
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(invalidRequest);

module.exports = app;
