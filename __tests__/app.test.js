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
