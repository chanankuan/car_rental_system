import request from "supertest";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  beforeEach,
} from "@jest/globals";
import { app } from "../../../src/app.js";
import { createTestUser, TestSession, getSessionCookie } from "../../setup.js";

console.log("app", app);

describe("Auth Controller", () => {
  let testUser: any;
  let sessionCookie: string;

  beforeAll(async () => {
    testUser = createTestUser();

    // Register the user once for all tests
    await request(app).post("/api/auth/register").send(testUser);

    // Login once and get session for all tests
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    sessionCookie = getSessionCookie(loginResponse.headers);
    TestSession.setSession(sessionCookie);
  });

  afterEach(() => {
    TestSession.clearSession();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      // Create a DIFFERENT user for registration test
      const newUser = createTestUser();
      const response = await request(app)
        .post("/api/auth/register")
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe(newUser.email);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      // Use the pre-registered user from beforeAll
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.user.email).toBe(testUser.email);
    });

    it("should return 401 for invalid credentials", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        })
        .expect(401);
    });
  });

  describe("GET /api/auth/logout", () => {
    let cookie: string;

    // Log in once before running the tests in this block
    beforeAll(async () => {
      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      cookie = getSessionCookie(loginResponse.headers);
    });

    it("should logout successfully with valid session", async () => {
      await request(app)
        .get("/api/auth/logout")
        .set("Cookie", cookie)
        .expect(204);
    });
  });

  describe("POST /api/auth/change-password", () => {
    it("should change password successfully", async () => {
      const newPassword = "NewStrongPass456!";

      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      const cookie = getSessionCookie(loginResponse.headers);

      await request(app)
        .post("/api/auth/change-password")
        .set("Cookie", cookie)
        .send({
          oldPassword: testUser.password,
          newPassword,
        })
        .expect(204);

      // Verify the new password works
      await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: newPassword,
        })
        .expect(200);

      testUser.password = newPassword;
    });
  });
});
