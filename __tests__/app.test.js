const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const sorted = require("jest-sorted");

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
      comment_count: "2",
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

describe("6. GET /api/users", () => {
  test("status: 200, responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("8. GET /api/articles", () => {
  test("status:200, responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("created_at");
        articles.forEach((article) => {
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("author");
        });
      });
  });
});

describe("9. GET /api/articles/:article_id/comments", () => {
  test("returns an array of comments for given article id", () => {
    const article_ID = 9;
    return request(app)
      .get(`/api/articles/${article_ID}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(2);
        expect(comments).toBeInstanceOf(Array);
        comments.forEach((comment) => {
          expect(comment).toBeInstanceOf(Object);
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(comment.article_id).toBe(article_ID);
        });
      });
  });
  test("status:404, responds with an error message when article id doesn't exist", () => {
    const article_id = 999;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`article ID ${article_id} does not exist`);
      });
  });
  test("status:200, responds with an empty array when article exists but has no comments", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        //console.log(comments);
        expect(comments.length).toBe(0);
        expect(comments).toBeInstanceOf(Array);
      });
  });
  test("status:400, responds with an error message when passed an invalid id", () => {
    const article_id = "banana";
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
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
