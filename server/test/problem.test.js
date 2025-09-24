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


describe("POST /api/problems", () => {
    it("should create a new problem", async () => {
      const res = await request(app)
        .post("/api/problems")
        .send({
            name: "Problem 1",
          description: "This is problem 1",
          difficulty: "Easy",
          category: "Basic",
          initialcode: [{language: "Python", code: "print('Hello World')"},
            {language: "Java", code: "System.out.println('Hello World');"},
            {language: "C++", code: "cout << 'Hello World';"},
            {language: "JavaScript", code: "console.log('Hello World');"},
            {language: "C", code: "printf('Hello World');"}
            


          ],
          grade : 10,
          testCases : [{
            input : "5",
            expectedOutput : "120",
            weight : 1
          },
            {
                input : "3",
                expectedOutput : "6",
                weight : 1
            },
            {
                input : "4",
                expectedOutput : "24",
                weight : 1
            }
        ],
        examples : [{
            input : "3",
            output : "6",
            explanation : "3! = 3*2*1 = 6"
        },
        {
            input : "4",
            output : "24",
            explanation : "4! = 4*3*2*1 = 24"   },
            
    ]
        });     
  
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("problem");

    

    });
  });

  describe("POST /api/problems", () => {
    it("should not create a new problem (name required)", async () => {
      const res = await request(app)
        .post("/api/problems")
        .send({
          
          description: "This is problem 1",
          difficulty: "Easy",
          category: "Basic",
          initialcode: [{language: "Python", code: "print('Hello World')"},
            {language: "Java", code: "System.out.println('Hello World');"},
            {language: "C++", code: "cout << 'Hello World';"},
            {language: "JavaScript", code: "console.log('Hello World');"},
            {language: "C", code: "printf('Hello World');"}
            


          ],
          grade : 10,
          testCases : [{
            input : "5",
            expectedOutput : "120",
            weight : 1
          },
            {
                input : "3",
                expectedOutput : "6",
                weight : 1
            },
            {
                input : "4",
                expectedOutput : "24",
                weight : 1
            }
        ],
        examples : [{
            input : "3",
            output : "6",
            explanation : "3! = 3*2*1 = 6"
        },
        {
            input : "4",
            output : "24",
            explanation : "4! = 4*3*2*1 = 24"   },
            
    ]
        });     
  
      expect(res.statusCode).toEqual(400);

    

    });
  });

  describe("POST /api/problems", () => {
    it("should create a new problem (description is not there)", async () => {
      const res = await request(app)
        .post("/api/problems")
        .send({
            name: "Problem 1",
          difficulty: "Easy",
          category: "Basic",
          initialcode: [{language: "Python", code: "print('Hello World')"},
            {language: "Java", code: "System.out.println('Hello World');"},
            {language: "C++", code: "cout << 'Hello World';"},
            {language: "JavaScript", code: "console.log('Hello World');"},
            {language: "C", code: "printf('Hello World');"}
            


          ],
          grade : 10,
          testCases : [{
            input : "5",
            expectedOutput : "120",
            weight : 1
          },
            {
                input : "3",
                expectedOutput : "6",
                weight : 1
            },
            {
                input : "4",
                expectedOutput : "24",
                weight : 1
            }
        ],
        examples : [{
            input : "3",
            output : "6",
            explanation : "3! = 3*2*1 = 6"
        },
        {
            input : "4",
            output : "24",
            explanation : "4! = 4*3*2*1 = 24"   },
            
    ]
        });     
  
      expect(res.statusCode).toEqual(201);

    

    });
  });

  describe("POST /api/problems", () => {
    it("should not create a new problem (difficulty is not there)", async () => {
      const res = await request(app)
        .post("/api/problems")
        .send({
            name: "Problem 1",
          description: "This is problem 1",
          category: "Basic",
          initialcode: [{language: "Python", code: "print('Hello World')"},
            {language: "Java", code: "System.out.println('Hello World');"},
            {language: "C++", code: "cout << 'Hello World';"},
            {language: "JavaScript", code: "console.log('Hello World');"},
            {language: "C", code: "printf('Hello World');"}
            


          ],
          grade : 10,
          testCases : [{
            input : "5",
            expectedOutput : "120",
            weight : 1
          },
            {
                input : "3",
                expectedOutput : "6",
                weight : 1
            },
            {
                input : "4",
                expectedOutput : "24",
                weight : 1
            }
        ],
        examples : [{
            input : "3",
            output : "6",
            explanation : "3! = 3*2*1 = 6"
        },
        {
            input : "4",
            output : "24",
            explanation : "4! = 4*3*2*1 = 24"   },
            
    ]
        });     
  
      expect(res.statusCode).toEqual(400);

    

    });
  });

  describe("POST /api/problems", () => {
    it("should not create a new problem (Category is not there)", async () => {
      const res = await request(app)
        .post("/api/problems")
        .send({
            name: "Problem 1",
          description: "This is problem 1",
          difficulty: "Easy",
          initialcode: [{language: "Python", code: "print('Hello World')"},
            {language: "Java", code: "System.out.println('Hello World');"},
            {language: "C++", code: "cout << 'Hello World';"},
            {language: "JavaScript", code: "console.log('Hello World');"},
            {language: "C", code: "printf('Hello World');"}
            


          ],
          grade : 10,
          testCases : [{
            input : "5",
            expectedOutput : "120",
            weight : 1
          },
            {
                input : "3",
                expectedOutput : "6",
                weight : 1
            },
            {
                input : "4",
                expectedOutput : "24",
                weight : 1
            }
        ],
        examples : [{
            input : "3",
            output : "6",
            explanation : "3! = 3*2*1 = 6"
        },
        {
            input : "4",
            output : "24",
            explanation : "4! = 4*3*2*1 = 24"   },
            
    ]
        });     
  
      expect(res.statusCode).toEqual(400);

    

    });
  });
  

  describe("POST /api/problems", () => {
    it("should not create a new problem (grade input type is required number)", async () => {
      const res = await request(app)
        .post("/api/problems")
        .send({
            name: "Problem 1",
          description: "This is problem 1",
          difficulty: "Easy",
          category: "Basic",
          initialcode: [{language: "Python", code: "print('Hello World')"},
            {language: "Java", code: "System.out.println('Hello World');"},
            {language: "C++", code: "cout << 'Hello World';"},
            {language: "JavaScript", code: "console.log('Hello World');"},
            {language: "C", code: "printf('Hello World');"}
            


          ],
          grade : "grade",
          testCases : [{
            input : "5",
            expectedOutput : "120",
            weight : 1
          },
            {
                input : "3",
                expectedOutput : "6",
                weight : 1
            },
            {
                input : "4",
                expectedOutput : "24",
                weight : 1
            }
        ],
        examples : [{
            input : "3",
            output : "6",
            explanation : "3! = 3*2*1 = 6"
        },
        {
            input : "4",
            output : "24",
            explanation : "4! = 4*3*2*1 = 24"   },
            
    ]
        });     
  
      expect(res.statusCode).toEqual(400);

    

    });
  });

    describe("GET /api/problems", () => {
        it("should get all problems", async () => {
        const res = await request(app).get("/api/problems");
    
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("problems");
        });
    });

    describe("DELETE /api/problems/:id", () => {
        it("should delete a problem", async () => {
        const problem = await request(app)
            .post("/api/problems")
            .send({
                name: "Problem 1",
                description: "This is problem 1",
                difficulty: "Easy",
                category: "Basic",
                initialcode: [{language: "Python", code: "print('Hello World')"},
                {language: "Java", code: "System.out.println('Hello World');"},
                {language: "C++", code: "cout << 'Hello World';"},
                {language: "JavaScript", code: "console.log('Hello World');"},
                {language: "C", code: "printf('Hello World');"}
                
    
              ],
              grade : 10,
              testCases : [{
                input : "5",
                expectedOutput : "120",
                weight : 1
              },
                {
                    input : "3",
                    expectedOutput : "6",
                    weight : 1
                },
                {
                    input : "4",
                    expectedOutput : "24",
                    weight : 1
                }
            ],
            examples : [{
                input : "3",
                output : "6",
                explanation : "3! = 3*2*1 = 6"
            },
            {
                input : "4",
                output : "24",
                explanation : "4! = 4*3*2*1 = 24"   },
                
        ]
            });
    
        const res = await request(app).delete(`/api/problems/${problem.body.problem._id}`);
    
        expect(res.statusCode).toEqual(200);
        });
    });

    describe("PUT /api/problems/:id", () => {
        it("should update a problem", async () => {
            const problem = await request(app)
                .post("/api/problems")
                .send({
                    name: "Problem 1",
                    description: "This is problem 1",
                    difficulty: "Easy",
                    category: "Basic",
                    initialcode: [{language: "Python", code: "print('Hello World')"},
                    {language: "Java", code: "System.out.println('Hello World');"},
                    {language: "C++", code: "cout << 'Hello World';"},
                    {language: "JavaScript", code: "console.log('Hello World');"},
                    {language: "C", code: "printf('Hello World');"}
                    
        
                  ],
                  grade : 10,
                  testCases : [{
                    input : "5",
                    expectedOutput : "120",
                    weight : 1
                  },
                    {
                        input : "3",
                        expectedOutput : "6",
                        weight : 1
                    },
                    {
                        input : "4",
                        expectedOutput : "24",
                        weight : 1
                    }
                ],
                examples : [{
                    input : "3",
                    output : "6",
                    explanation : "3! = 3*2*1 = 6"
                },
                {
                    input : "4",
                    output : "24",
                    explanation : "4! = 4*3*2*1 = 24"   },
                    
            ]
                });
    
            const updatedProblem = {
                name: "Updated Problem",
                description: "This is problem 1",
                difficulty: "Easy",
                category: "Basic",
                initialcode: [{language: "Python", code: "print('Hello World')"},
                {language: "Java", code: "System.out.println('Hello World');"},
                {language: "C++", code: "cout << 'Hello World';"},
                {language: "JavaScript", code: "console.log('Hello World');"},
                {language: "C", code: "printf('Hello World');"}
                
        
                  ],
                  grade : 10,
                  testCases : [{
                    input : "5",
                    expectedOutput : "120",
                    weight : 1
                  },
                    {
                        input : "3",
                        expectedOutput : "6",
                        weight : 1
                    },
                    {
                        input : "4",
                        expectedOutput : "24",
                        weight : 1
                    }
                ],
                examples : [{
                    input : "3",
                    output : "6",
                    explanation : "3! = 3*2*1 = 6"
                },
                {
                    input : "4",
                    output : "24",
                    explanation : "4! = 4*3*2*1 = 24"   },
                ]
            };

            const res = await request(app).put(`/api/problems/${problem.body.problem._id}`).send(updatedProblem);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("problem");
        });

    });

    describe("GET /api/problems/:id", () => {
        it("should get a problem by id", async () => {
            const problem = await request(app)
                .post("/api/problems")
                .send({
                    name: "Problem 1",
                    description: "This is problem 1",
                    difficulty: "Easy",
                    category: "Basic",
                    initialcode: [{language: "Python", code: "print('Hello World')"},
                    {language: "Java", code: "System.out.println('Hello World');"},
                    {language: "C++", code: "cout << 'Hello World';"},
                    {language: "JavaScript", code: "console.log('Hello World');"},
                    {language: "C", code: "printf('Hello World');"}
                    
        
                  ],
                  grade : 10,
                  testCases : [{
                    input : "5",
                    expectedOutput : "120",
                    weight : 1
                  },
                    {
                        input : "3",
                        expectedOutput : "6",
                        weight : 1
                    },
                    {
                        input : "4",
                        expectedOutput : "24",
                        weight : 1
                    }
                ],
                examples : [{
                    input : "3",
                    output : "6",
                    explanation : "3! = 3*2*1 = 6"
                },
                {
                    input : "4",
                    output : "24",
                    explanation : "4! = 4*3*2*1 = 24"   },
                    
            ]
                });

            const res = await request(app).get(`/api/problems/${problem.body.problem._id}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("problem");
            expect(res.body.problem.name).toEqual(problem.body.problem.name);
        });
    });
