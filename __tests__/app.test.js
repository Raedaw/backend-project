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
        expect(articles).toBeSortedBy("created_at", { descending: true });
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

describe("10. POST /api/articles/:article_id/comments", () => {
  test("status 201: responds with posted comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Awesome post!",
    };
    const article_id = 3;

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .expect(201)
      .send(newComment)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 19,
          body: newComment.body,
          article_id: article_id,
          author: newComment.username,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("status:404, responds with an error message when article id doesn't exist", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Awesome post!",
    };
    const article_id = 999;
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .expect(404)
      .send(newComment)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`article_id does not exist`);
      });
  });
  test("status:400, responds with an error message when body is missing from new comment", () => {
    const newComment = {
      username: "icellusedkars",
    };
    const article_id = 3;
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .expect(400)
      .send(newComment)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test("status:400, responds with an error message when username is missing from new comment", () => {
    const newComment = {
      body: "who am I?",
    };
    const article_id = 3;
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .expect(400)
      .send(newComment)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test("status:400, responds with an error message when passed an invalid input as article id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Awesome post!",
    };
    const article_id = "banana";
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .expect(400)
      .send(newComment)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid article ID");
      });
  });
  test("status:404, responds with an error message when username doesn't exist in the database", () => {
    const newComment = {
      username: "santa",
      body: "Awesome post!",
    };
    const article_id = 1;
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .expect(404)
      .send(newComment)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`username does not exist`);
      });
  });
});

describe("11. GET /api/articles (queries)", () => {
  describe("sort_by sorts articles by any valid column by descending order by default", () => {
    test("sorts by date by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          expect(articles).toBeInstanceOf(Array);
          //console.log(articles);
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
            //coerce: true,
          });
          expect(articles[0]).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: new Date(1604394720000).toISOString(),
            votes: 0,
            comment_count: "2",
          });
        });
    });
    test("200: accepts sort_by query with article_id ", () => {
      const sortByColumn = "article_id";
      return request(app)
        .get(`/api/articles?sort_by=${sortByColumn}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy(sortByColumn, {
            descending: true,
          });
        });
    });
    test("200: accepts sort_by query with votes", () => {
      const sortByColumn = "votes";
      return request(app)
        .get(`/api/articles?sort_by=${sortByColumn}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy(sortByColumn, {
            descending: true,
            coerce: true,
          });
        });
    });
    test("200: accepts sort_by query with title", () => {
      const sortByColumn = "title";
      return request(app)
        .get(`/api/articles?sort_by=${sortByColumn}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy(sortByColumn, {
            descending: true,
          });
        });
    });
    test("200: accepts sort_by query with topic", () => {
      const sortByColumn = "topic";
      return request(app)
        .get(`/api/articles?sort_by=${sortByColumn}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy(sortByColumn, {
            descending: true,
          });
        });
    });
    test("200: accepts sort_by query with author", () => {
      const sortByColumn = "author";
      return request(app)
        .get(`/api/articles?sort_by=${sortByColumn}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy(sortByColumn, {
            descending: true,
          });
        });
    });
    test("200: accepts sort_by query with comment_count", () => {
      const sortByColumn = "comment_count";
      return request(app)
        .get(`/api/articles?sort_by=${sortByColumn}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy(sortByColumn, {
            descending: true,
            coerce: true,
          });
        });
    });
    test("sorts by ascending order when specified", () => {
      const sortByColumn = "article_id";
      return request(app)
        .get(`/api/articles?sort_by=${sortByColumn}&order=ASC`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy(sortByColumn, {
            coerce: true,
          });
        });
    });
  });
  test("filters articles by the topic value specified in the query ", () => {
    const topic = "cats";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(1);
        expect(articles).toBeInstanceOf(Array);
        expect(articles[0].topic).toBe(topic);
      });
  });
  describe("error handling", () => {
    test("status:400, responds with an error message when the passed column is not a valid option", () => {
      const sortByColumn = "im_not_real";
      return request(app)
        .get(`/api/articles?sort_by=${sortByColumn}`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`${sortByColumn} is not a valid sort by option`);
        });
    });

    test("status:400, responds with an error message when passed order isn't ASC or DESC", () => {
      const sortByColumn = "votes";
      return request(app)
        .get(`/api/articles?sort_by=${sortByColumn}&order=PASTA`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`invalid 'order by' input`);
        });
    });
    test("status:404, responds with an error message when topic doesn't exist in the database", () => {
      const topic = "unicorns";
      return request(app)
        .get(`/api/articles?topic=${topic}`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`topic does not exist`);
        });
    });

    test("status:200, responds with an empty message when topic exists in the database but not the article", () => {
      const topic = "paper";
      return request(app)
        .get(`/api/articles?topic=${topic}`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(0);
          expect(articles).toBeInstanceOf(Array);
        });
    });
  });
  describe("GET /api ", () => {
    test("status: 200 responds with json object containing information on all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          console.log(body.data.length);
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
});
