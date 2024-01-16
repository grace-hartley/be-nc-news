const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));

afterAll(() => db.end());

//QUESTION 2
describe("/api/topics", () => {
  test("GET:200 sends an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("GET: 404 when given invalid path", () => {
    return request(app)
      .get("/api/notTopics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path does not exist");
      });
  });
});

//QUESTION 3
describe("/api", () => {
  test("GET: 200 sends object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body).toEqual(endpoints);

        expect(body["GET /api"].hasOwnProperty("description")).toBe(true);

        const endpointKeysArray = Object.keys(body);

        endpointKeysArray.forEach((endpointKey) => {
          if (endpointKey !== "GET /api") {
            const endpoint = body[endpointKey];
            expect(endpoint.hasOwnProperty("description")).toBe(true);
            expect(endpoint.hasOwnProperty("queries")).toBe(true);
            expect(endpoint.hasOwnProperty("exampleResponse")).toBe(true);
          }
        });
      });
  });
});

//QUESTION 4
describe("/api/articles/:article_id", () => {
  test("GET: 200 sends a single article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article.author).toEqual(articleData[0].author);
        expect(body.article.title).toEqual(articleData[0].title);
        expect(body.article.body).toEqual(articleData[0].body);
        expect(body.article.topic).toEqual(articleData[0].topic);
        expect(body.article.hasOwnProperty("created_at")).toBe(true);
        expect(body.article.votes).toEqual(articleData[0].votes);
        expect(body.article.article_img_url).toEqual(
          articleData[0].article_img_url
        );
      });
  });
  test("GET: 404 sends status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET: 400 sends status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/notAnArticle")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
