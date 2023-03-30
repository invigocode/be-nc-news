const { response } = require("../app");
const {
  fetchArticleById,
  fetchArticles,
  fetchComments,
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
  // console.log(request.params);
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
