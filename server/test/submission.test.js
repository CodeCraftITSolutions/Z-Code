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


describe("POST /api/submission", () => {
    it("should create a new submission", async () => {
    const res = await request(app)
        .post("/api/submission")
        .send({
            problemId: "663f9338bd0be4761e098aba",
            code: "print('Hello World')",
            language: "Python",
            grade: 10,
            userId: "663f9338bd0be4761e098aba"
        });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("submission");
    });
});


describe("POST /api/submission", () => {
  it("should create a new submission", async () => {
  const res = await request(app)
      .post("/api/submission")
      .send({
          problemId: "663f9338bd0be4761e098aba",
          code: "print('Hello World')",
          language: "Python",
          grade: 10,
      });

  expect(res.statusCode).toEqual(400);
  });
});
