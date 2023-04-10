const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      `
SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(articles.article_id) AS INT) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC
`
    )
    .then((result) => {
      return result.rows;
    });
};

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

exports.fetchComments = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC
    `,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.postComment = (article_id, username, body) => {
  return db
    .query(
      `
          INSERT INTO comments (author, article_id, body)
          VALUES ($1, $2, $3)
          RETURNING *;
              `,
      [username, article_id, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.articlePatcher = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;
    `,
      [article_id, inc_votes]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Path not found" });
      } else {
        return result.rows[0];
      }
    });
};
