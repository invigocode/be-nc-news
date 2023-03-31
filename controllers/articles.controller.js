const { response } = require("../app");
const {
  fetchArticleById,
  fetchArticles,
  fetchComments,
  postComment,
} = require("../models/articles.model");

exports.getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.getComments = (request, response, next) => {
  const { article_id } = request.params;
  Promise.all([fetchComments(article_id), fetchArticleById(article_id)])
    .then(([comments, article]) => {
      if (article) {
        return response.status(200).send({ comments });
      }
      Promise.reject({ status: 404, msg: "Article not found" });
    })
    .catch((err) => next(err));
};

exports.addComment = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  console.log(request.params);
  console.log(request.body);
  postComment(article_id, username, body)
    .then(({ comment }) => {
      response.status(201).send(comment);
    })
    .catch((err) => next(err));
};

exports.addComment = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  console.log(request.body);
  postComment(article_id, username, body)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => next(err));
};
