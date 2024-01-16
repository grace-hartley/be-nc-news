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

// QUESTION 5
describe("GET /api/articles", () => {
  test("GET: 200 sends an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(articleData.length);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(article.body).toBe(undefined);
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  // I know this is the same test as Q2 but can't think what other errors would apply here?
  test("GET: 404 when given invalid path", () => {
    return request(app)
      .get("/api/notArticles")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path does not exist");
      });
  });
});
