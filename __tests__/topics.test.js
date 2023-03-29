const app = require("../app");
const supertest = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  test('GET 200: responds with a message "server is up and running"', () => {
    return supertest(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        // console.log(body);
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
        // console.log(body);
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

describe("GET /api/articles/:article_id", () => {
  test('status: 200, responds with an object containing a key of "article" and a value of an object', () => {
    return supertest(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        // console.log(body);
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
});
