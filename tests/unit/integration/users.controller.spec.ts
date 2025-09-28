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

describe("Users Controller", () => {
  let testUser: any;

  beforeAll(() => {
    testUser = createTestUser();
  });

  afterEach(() => {
    TestSession.clearSession();
  });

  describe("GET /api/users/me", () => {
    beforeEach(async () => {
      // Register and login user
      await request(app).post("/api/auth/register").send(testUser);

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      const cookie = getSessionCookie(loginResponse.headers);
      TestSession.setSession(cookie);
    });

    it("should return current user profile", async () => {
      const response = await request(app)
        .get("/api/users/me")
        .set(TestSession.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).toMatchObject({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        phoneNumber: testUser.phoneNumber,
        isVerified: true,
        role: "user",
      });
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should return 401 without session", async () => {
      const response = await request(app).get("/api/users/me").expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        error: "Unauthorized",
      });
    });

    it("should return 401 with invalid session", async () => {
      const response = await request(app)
        .get("/api/users/me")
        .set({ Cookie: "sid=invalid-session-id" })
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        error: "Unauthorized",
      });
    });
  });
});
