const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
      SELECT *
      FROM articles
      WHERE articles.article_id = $1
          `,
      [article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};
