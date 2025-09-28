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

describe("Cars Controller", () => {
  let testUser: any;

  beforeAll(() => {
    testUser = createTestUser();
  });

  afterEach(() => {
    TestSession.clearSession();
  });

  describe("GET /api/cars", () => {
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

    it("should return paginated list of cars", async () => {
      const response = await request(app)
        .get("/api/cars")
        .set(TestSession.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty("cars");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.cars)).toBe(true);
      expect(response.body.pagination).toMatchObject({
        total: expect.any(Number),
        page: 1,
        pageSize: 10,
      });

      // Verify car structure matches Swagger schema
      if (response.body.cars.length > 0) {
        const car = response.body.cars[0];
        expect(car).toMatchObject({
          id: expect.any(String),
          make: expect.any(String),
          model: expect.any(String),
          year: expect.any(Number),
          isAvailable: expect.any(Boolean),
        });
      }
    });

    it("should support pagination parameters", async () => {
      const response = await request(app)
        .get("/api/cars?page=2&pageSize=5")
        .set(TestSession.getAuthHeaders())
        .expect(200);

      expect(response.body.pagination).toMatchObject({
        page: 2,
        pageSize: 5,
      });
    });

    it("should filter cars by make", async () => {
      const response = await request(app)
        .get("/api/cars?make=Toyota")
        .set(TestSession.getAuthHeaders())
        .expect(200);

      // All returned cars should match the filter
      response.body.cars.forEach((car: any) => {
        expect(car.make).toBe("Toyota");
      });
    });

    it("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/cars").expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        error: "Unauthorized",
      });
    });
  });

  describe("GET /api/cars/{id}", () => {
    let testCarId: string;

    beforeEach(async () => {
      // Register and login user
      await request(app).post("/api/auth/register").send(testUser);

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      const cookie = getSessionCookie(loginResponse.headers);
      TestSession.setSession(cookie);

      // Get a car ID from the list endpoint
      const carsResponse = await request(app)
        .get("/api/cars")
        .set(TestSession.getAuthHeaders());

      if (carsResponse.body.cars.length > 0) {
        testCarId = carsResponse.body.cars[0].id;
      }
    });

    it("should return car details for valid ID", async () => {
      if (!testCarId) {
        console.log("No cars available for testing");
        return;
      }

      const response = await request(app)
        .get(`/api/cars/${testCarId}`)
        .set(TestSession.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty("car");
      expect(response.body.car.id).toBe(testCarId);
      expect(response.body.car).toMatchObject({
        make: expect.any(String),
        model: expect.any(String),
        year: expect.any(Number),
        isAvailable: expect.any(Boolean),
      });
    });

    it("should return 404 for non-existent car ID", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      const response = await request(app)
        .get(`/api/cars/${nonExistentId}`)
        .set(TestSession.getAuthHeaders())
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        error: "NotFound",
        message: "Car not found",
      });
    });

    it("should return 401 without authentication", async () => {
      if (!testCarId) return;

      const response = await request(app)
        .get(`/api/cars/${testCarId}`)
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        error: "Unauthorized",
      });
    });
  });
});
