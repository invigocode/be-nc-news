const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const {
  invalidRequest,
  customError,
  BadRequest,
  serverError,
} = require("./controllers/errorHandle.controller");
const {
  getArticleById,
  getArticles,
  getComments,
  addComment,
} = require("./controllers/articles.controller");

const app = express();
app.use(express.json());

app.get("/api", (request, response, next) => {
  response.status(200).send({ msg: "server is up and running" }).catch(next);
});

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", addComment);

app.all("/*", invalidRequest);
app.use(customError);
app.use(BadRequest);
app.use(serverError);

module.exports = app;
