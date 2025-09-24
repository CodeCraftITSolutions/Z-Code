const request = require('supertest');
const app = require('../app'); // Import your Express app
const User = require('../models/user');
const Lecturer = require('../models/lecturer');
const Student = require('../models/student');
const mongoose = require("mongoose");


require("dotenv").config();

beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });
  
  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.connection.close();
  });

 

  describe("POST /api/user/send", () => {
    it("should send OTP to user's email", async () => {
        const mockReqBody = {
            username: "testuser",
            email: "testuser@example.com",
            password: "password",
            usertype: "student"
        };

        const mockLecturer = null; // Assuming no lecturer exists with the same email
        const mockStudent = null; // Assuming no student exists with the same email

        jest.spyOn(Lecturer, 'findOne').mockImplementation(() => mockLecturer);
        jest.spyOn(Student, 'findOne').mockImplementation(() => mockStudent);

        const res = await request(app)
            .post("/api/user/send")
            .send(mockReqBody);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("msg", "Verify with the otp send to the email");
        // Additional assertions for the response body or any other checks you want to perform
    });

    // Add more test cases to cover different scenarios, such as existing user, invalid input, etc.
});

