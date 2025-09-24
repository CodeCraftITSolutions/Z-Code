const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");

require("dotenv").config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("POST /api/contest", () => {
  it("should create a new contest", async () => {
    const res = await request(app)
      .post("/api/contest")
      .send({
        name: "Contest 1",
        startDate: "2022-12-12",
        endDate: "2022-12-13",
        duration: 1,
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("contest");
  });
});
describe("POST /api/contest", () => {
  it("should not create a new contest, because of name is not there!", async () => {
    const res = await request(app)
      .post("/api/contest")
      .send({
        startDate: "2022-12-12",
        endDate: "2022-12-13",
        duration: 1,
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });

    expect(res.statusCode).toEqual(500);
  });
});
describe("POST /api/contest", () => {
  it("should create a new contest", async () => {
    const res = await request(app)
      .post("/api/contest")
      .send({
        name: "Contest 1",
        startDate: "2022-12-12",
        endDate: "2022-12-13",
        duration: 1,
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("contest");
  });
});

describe("POST /api/contest", () => {
  it("should not create a new contest, because of startDate is not there!", async () => {
    const res = await request(app)
      .post("/api/contest")
      .send({
        name: "Contest 1",
        endDate: "2022-12-13",
        duration: 1,
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });
    expect(res.statusCode).toEqual(500);
  });
});

describe("POST /api/contest", () => {
  it("should not create a new contest, because of endDate is not there!", async () => {
    const res = await request(app)
      .post("/api/contest")
      .send({
        name: "Contest 1",
        startDate: "2022-12-12",
        duration: 1,
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });

    expect(res.statusCode).toEqual(500);
  });
});

describe("POST /api/contest", () => {
  it("should not create a new contest, because of duration is not there!", async () => {
    const res = await request(app)
      .post("/api/contest")
      .send({
        name: "Contest 1",
        startDate: "2022-12-12",
        endDate: "2022-12-13",
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });

    expect(res.statusCode).toEqual(500);
  });
});
describe("POST /api/contest", () => {
  it("should create a new contest", async () => {
    const res = await request(app)
      .post("/api/contest")
      .send({
        name: "Contest 1",
        startDate: "2022-12-12",
        endDate: "2022-12-13",
        duration: 1,
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("contest");
  });
});
describe("POST /api/contest", () => {
  it("should not create a new contest, because of duration should be in number type!", async () => {
    const res = await request(app)
      .post("/api/contest")
      .send({
        startDate: "2022-12-12",
        endDate: "2022-12-13",
        duration: "String value",
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });

    expect(res.statusCode).toEqual(500);
  });
});
describe("POST /api/contest", () => {
  it("should create a new contest, because Problems is not required create contest", async () => {
    const res = await request(app).post("/api/contest").send({
      name: "Contest 1",
      startDate: "2022-12-12",
      endDate: "2022-12-13",
      duration: 1,
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("contest");
  });
});

describe("GET /api/contest", () => {
  it("should get all contests", async () => {
    const res = await request(app).get("/api/contest");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("contests");
  });
});

describe("DELETE /api/contest/:id", () => {
  it("should delete a contest", async () => {
    const contest = await request(app)
      .post("/api/contest")
      .send({
        name: "Contest 1",
        startDate: "2022-12-12",
        endDate: "2022-12-13",
        duration: 1,
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });

    const res = await request(app).delete(
      `/api/contest/${contest.body.contest._id}`
    );

    expect(res.statusCode).toEqual(200);
  });
});

describe("PUT /api/contest/:id", () => {
  it("should update a contest", async () => {
    const contest = await request(app)
      .post("/api/contest")
      .send({
        name: "Contest 1",
        startDate: "2022-12-12",
        endDate: "2022-12-13",
        duration: 1,
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });

    const updatedContest = {
      name: "Updated Contest",
      startDate: "2022-12-15",
      endDate: "2022-12-16",
      duration: 2,
      problems: [
        "663f9338bd0be4761e098aba",
        "663f9338bd0be4761e098aba",
        "663f9338bd0be4761e098abc",
      ],
    };

    const res = await request(app)
      .put(`/api/contest/${contest.body.contest._id}`)
      .send(updatedContest);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("contest");
    expect(res.body.contest.name).toEqual(updatedContest.name);
    expect(res.body.contest.duration).toEqual(updatedContest.duration);
    expect(res.body.contest.problems).toEqual(updatedContest.problems);
  });
});

describe("GET /api/contest/:id", () => {
  it("should get a contest by id", async () => {
    const contest = await request(app)
      .post("/api/contest")
      .send({
        name: "Contest 1",
        startDate: "2022-12-12",
        endDate: "2022-12-13",
        duration: 1,
        problems: ["663f9338bd0be4761e098aba", "663f9338bd0be4761e098aba"],
      });

    const res = await request(app).get(
      `/api/contest/${contest.body.contest._id}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("contest");
    expect(res.body.contest.name).toEqual(contest.body.contest.name);
  });
});
