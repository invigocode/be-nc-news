const express = require("express");
const cors = require("cors");
const { getTopics } = require("./controllers/topics.controller");
const {
  invalidRequest,
  customError,
  serverError,
  badRequest,
} = require("./controllers/errorHandle.controller");
const {
  getArticleById,
  getArticles,
  getComments,
  addComment,
  patchArticle,
  deleteComment,
  getUsers,
} = require("./controllers/articles.controller");

const app = express();
app.use(express.json());

app.use(cors());

app.get("/api", (request, response, next) => {
  response.status(200).send({ msg: "server is up and running" }).catch(next);
});

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.all("/*", invalidRequest);
app.use(customError);
app.use(badRequest);
app.use(serverError);

module.exports = app;
