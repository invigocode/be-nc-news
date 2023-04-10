const app = require("../app");
const supertest = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  test('GET 200: responds with a message "server is up and running"', () => {
    return supertest(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({ msg: expect.any(String) });
        expect(body.msg).toBe("server is up and running");
      });
  });
});

describe("/api/topics", () => {
  test('GET 200: responds with an object containing a "topics" key with the value of an object', () => {
    return supertest(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body)[0]).toBe("topics");
      });
  });
  test("GET 200: responds with an array of objects", () => {
    return supertest(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics.length).toBe(3);
        expect(topics[0]).toEqual({
          description: "The man, the Mitch, the legend",
          slug: "mitch",
        });
        expect(topics[2]).toEqual({
          description: "what books are made of",
          slug: "paper",
        });
      });
  });
  test("GET 404: responds with 404 if request has a typo", () => {
    return supertest(app)
      .get("/api/typo")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Path not found" });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test('GET : 200, responds with an object containing a key of "article" and a value of an object', () => {
    return supertest(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body)[0]).toBe("article");
        expect(body.article).toBeInstanceOf(Object);
      });
  });
  test("GET: 200, responds with article referenced by id", () => {
    return supertest(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET: 404, responds with 404 if passed invalid id", () => {
    return supertest(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article not found" });
      });
  });
  test("GET: 400, responds with 400 if passed id that is NaN", () => {
    return supertest(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
});

describe("/api/articles", () => {
  test("GET: 200, should respond with an articles array containing article objects", () => {
    return supertest(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
      });
  });
  test("GET: 200, should respond with articles array of article objects with correct properties'", () => {
    return supertest(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET: 200, should respond with articles in descending order and sorted by created_at", () => {
    return supertest(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 404: responds with 404 if request has a typo", () => {
    return supertest(app)
      .get("/api/typo")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Path not found" });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200, responds with an object containing a key of comments and a value of an array of comments", () => {
    return supertest(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body)[0]).toBe("comments");
      });
  });
  test("GET: 200, responds with an empty array when passed valid article with no comments", () => {
    return supertest(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("should respond with an array of comments for the given article_id", () => {
    return supertest(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(2);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 9,
          });
        });
      });
  });
  test("GET: 200, should respond with comments in descending order ", () => {
    return supertest(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 404: responds with 404 if request has a typo", () => {
    return supertest(app)
      .get("/api/articles/12345/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article not found" });
      });
  });
  test("GET 400: responds with 400 if request is NaN", () => {
    return supertest(app)
      .get("/api/articles/NaN/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST: 201, responds with an object containing a comment key and value of an object", () => {
    const comment = { username: "icellusedkars", body: "cool comment" };
    return supertest(app)
      .post("/api/articles/9/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(Object.keys(body)[0]).toBe("comment");
        expect(body.comment).toBeInstanceOf(Object);
      });
  });
  test("POST: 201, responds with an object of comment with the correct keys", () => {
    const comment = { username: "icellusedkars", body: "cool comment" };
    return supertest(app)
      .post("/api/articles/9/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "cool comment",
          article_id: 9,
          author: "icellusedkars",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("GET 400: responds with 400 if request is NaN", () => {
    const comment = { username: "icellusedkars", body: "cool comment" };
    return supertest(app)
      .post("/api/articles/NaN/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
  test("GET 404: responds with 404 if article id doesn't exist", () => {
    const comment = { username: "icellusedkars", body: "cool comment" };
    return supertest(app)
      .post("/api/articles/12345/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "404 not found" });
      });
  });
  test("GET 404: responds with 404 if username doesn't exist", () => {
    const comment = { username: "null", body: "cool comment" };
    return supertest(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "404 not found" });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH: 200, responds with an object containing a article key and value of an object", () => {
    return supertest(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body)[0]).toBe("article");
        expect(body.article).toBeInstanceOf(Object);
      });
  });
  test("PATCH: 200, should respond with an article with added votes when passed 1+ votes", () => {
    return supertest(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH: 400, should respond with 400 err when passed vote that is NaN", () => {
    return supertest(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "NaN" })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
  test("PATCH: 404, should respond with 404 err when passed article id that doesn't exist", () => {
    return supertest(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Path not found" });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE: 204, responds with an object containing a comment key and value of an empty object", () => {
    return supertest(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("responds with 400 err when passed invalid comment_id", () => {
    return supertest(app)
      .delete("/api/comments/999")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
  test("responds with 400 err when passed a comment_id that is NaN", () => {
    return supertest(app)
      .delete("/api/comments/NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad Request" });
      });
  });
});
