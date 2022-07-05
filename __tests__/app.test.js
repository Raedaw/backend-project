const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

afterAll(() => {
  if (db.end) return db.end();
});
beforeEach(() => {
  return seed(testData);
});

describe("GET api/topics", () => {
  test('"status:200, responds with an array of topic objects" ', () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("4. GET /api/articles/:article_id", () => {
  test("status:200 responds with a matching article", () => {
    const article_ID = 3;

    const article = {
      article_id: article_ID,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      created_at: new Date(1604394720000).toISOString(),
      votes: 0,
    };
    return request(app)
      .get(`/api/articles/${article_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(article);
      });
  });
  test("status:400, responds with an error message when passed a bad article ID", () => {
    return request(app)
      .get("/api/articles/invalidID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status:404, responds with an error message when article id doesn't exist", () => {
    const article_id = 9999;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`article ID ${article_id} does not exist`);
      });
  });
});

describe("5. PATCH /api/articles/:article_id", () => {
  test("status:200, responds with the updated article", () => {
    const newVote = 10;
    const article_ID = 1;
    const addVotes = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_ID}`)
      .send(addVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: article_ID,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 110,
        });
      });
  });
  test("status: 400, responds with error message when missing required fields ", () => {
    const article_ID = 1;
    const addVotes = {};
    return request(app)
      .patch(`/api/articles/${article_ID}`)
      .send(addVotes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Missing required fields`);
      });
  });
  test("status: 400, responds with error message when passed an invalid input", () => {
    const article_ID = 1;
    const addVotes = { inc_votes: "eleven" };
    return request(app)
      .patch(`/api/articles/${article_ID}`)
      .send(addVotes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Invalid input`);
      });
  });
});

describe("Errors", () => {
  test("status:404, responds with error message when passed an invalid route", () => {
    return request(app)
      .get("/api/toopics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});
