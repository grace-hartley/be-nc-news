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
        expect(body.msg).toBe("Article does not exist");
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
describe("/api/articles", () => {
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
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
});

// QUESTION 6
describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 sends an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET: 200 sends an empty array for the given article_id where there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
        expect(body.comments).toEqual([]);
      });
  });
  test("GET: 404 sends status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  test("GET: 400 sends status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/notAnArticle/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET: 404 when given invalid path", () => {
    return request(app)
      .get("/api/articles/1/notComments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path does not exist");
      });
  });
});

// QUESTION 7

describe("/api/articles/:article_id/comments", () => {
  test("POST: 201 should respond with status and inserted comment", () => {
    const commentToSend = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(commentToSend)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.article_id).toBe(2);
        expect(body.comment.comment_id).toBe(19);
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.body).toBe("This is a new comment");
        expect(body.comment.votes).toBe(0);
        expect(typeof body.comment.created_at).toBe("string");
      });
  });
  test("POST: 404 sends status and error message when given non-existent username provided", () => {
    const commentToSend = {
      username: "grace",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(commentToSend)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username does not exist");
      });
  });
  test("POST: 400 sends status and error message when given no body key to send", () => {
    const commentToSend = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(commentToSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST: 400 sends status and error message when given an invalid id", () => {
    const commentToSend = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/notAnArticle/comments")
      .send(commentToSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST: 404 when given invalid endpoint", () => {
    const commentToSend = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/notComments")
      .send(commentToSend)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path does not exist");
      });
  });
  test("POST: 404 sends status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
});

// QUESTION 8
describe("/api/articles/:article_id", () => {
  test("PATCH: 200 responds with updated article with the votes incremented", () => {
    const patchToSend = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/2")
      .send(patchToSend)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(1);
        expect(body.article.article_id).toBe(2);
        expect(typeof body.article.author).toBe("string");
        expect(typeof body.article.title).toBe("string");
        expect(typeof body.article.body).toBe("string");
        expect(typeof body.article.topic).toBe("string");
        expect(body.article.hasOwnProperty("created_at")).toBe(true);
        expect(typeof body.article.article_img_url).toBe("string");
      });
  });
  test("PATCH: 200 responds with updated article with the votes incremented", () => {
    const patchToSend = { inc_votes: -25 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchToSend)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(75);
      });
  });
  test("PATCH: 400 sends status and error message when given no inc_votes key to send", () => {
    const patchToSend = {};
    return request(app)
      .patch("/api/articles/2")
      .send(patchToSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH: 400 sends status and error message when given incorrect key", () => {
    const patchToSend = { votes: 100 };
    return request(app)
      .patch("/api/articles/2")
      .send(patchToSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH: 400 sends status and error message when given inc_votes value provided in invalid format", () => {
    const patchToSend = { inc_votes: "hello" };
    return request(app)
      .patch("/api/articles/2")
      .send(patchToSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH: 404 sends status and error message when given a valid but non-existent id", () => {
    const patchToSend = { votes: 100 };
    return request(app)
      .patch("/api/articles/999")
      .send(patchToSend)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
});

// QUESTION 9
describe("/api/comments/:comment_id", () => {
  test("DELETE: 204 responds with status and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE: 404 sends status and error message when given a valid but non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment does not exist");
      });
  });
  test("DELETE: 400 sends status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/notAComment")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

// QUESTION 10
describe("/api/users", () => {
  test("GET: 200 sends an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(userData.length);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
