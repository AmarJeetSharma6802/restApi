import { jest } from "@jest/globals";
// supertest API hit karne ke liye
import request from "supertest";

// express app import
import app from "../src/index.js";

// model import (isko mock karenge)
import realForm from "../src/model/production.model.js";


// 🔴 DB ko mock kar diya
// Matlab real MongoDB call nahi hogi
jest.mock("../src/model/production.model.js");


// 🔴 Email ko mock kiya
// Real email send nahi hogi
jest.mock("../src/utils/nodemailer.js", () => ({
  sendMail: jest.fn(),
}));



// =============================
// AUTH API TEST
// =============================
describe("Auth API", () => {

  // =============================
  // REGISTER TEST
  // =============================
  describe("Register", () => {

    test("should register user successfully", async () => {

      // 👉 findOne fake → user exist nahi
      realForm.findOne.mockResolvedValue(null);

      // 👉 create fake response
      realForm.create.mockResolvedValue({
        _id: "123",
        email: "test@gmail.com",
      });

      // 👉 API hit ki
      const res = await request(app).post("/auth").send({
        name: "Amar",
        email: "test@gmail.com",
        password: "password1",
        action: "register",
      });

      // 👉 response check
      expect(res.statusCode).toBe(201);
    });



    // duplicate email case
    test("should fail if email already exists", async () => {

      // 👉 user already exist
      realForm.findOne.mockResolvedValue({
        email: "test@gmail.com",
      });

      const res = await request(app).post("/auth").send({
        name: "Amar",
        email: "test@gmail.com",
        password: "password1",
        action: "register",
      });

      expect(res.statusCode).toBe(400);
    });

  });

});

// mockResolvedValue Jest ka method hai jo async function ka fake success response deta hai.


// describe → tests ko group karta
// example: describe("Auth API")

// test / it → actual test likhne ke liye
// example: test("should login")

// expect → result check karta
// example: expect(res.statusCode).toBe(200)

// jest.mock → dependency fake karta
// DB, email, redis sab fake

// mockResolvedValue → async function ka fake response
// DB query fake

// beforeEach → har test se pehle setup
// clean data

// afterEach → test ke baad cleanup

// toBe → exact compare
// number, string

// toEqual → object compare

// toHaveBeenCalled → function call hua ya nahi
