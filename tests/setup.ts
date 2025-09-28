import { config } from "dotenv";
import { jest } from "@jest/globals";

config({ path: ".env.test", override: true });

jest.setTimeout(10000);

export const createTestUser = (overrides = {}) => {
  const uniqueId = `${Date.now()}${Math.random().toString(36).substring(2, 8)}`;

  return {
    firstName: "Test",
    lastName: "User",
    email: `test${uniqueId}@example.com`,
    phoneNumber: `+1${uniqueId.slice(-10)}`,
    password: "StrongPass123!",
    ...overrides,
  };
};

// Session-based auth utility with explicit state management
export class TestSession {
  private static sessionCookie: string | null = null;

  static setSession(cookie: string) {
    this.sessionCookie = cookie;
  }

  static getAuthHeaders(): { Cookie: string } | {} {
    return this.sessionCookie ? { Cookie: this.sessionCookie } : {};
  }

  static clearSession() {
    this.sessionCookie = null;
  }

  static hasSession(): boolean {
    return this.sessionCookie !== null;
  }

  static getSession(): string | null {
    return this.sessionCookie;
  }
}

// Helper function to extract session cookie safely
export const getSessionCookie = (headers: {
  [key: string]: string | string[] | undefined;
}) => {
  const setCookieHeader = headers["set-cookie"];

  if (!setCookieHeader) {
    throw new Error("No set-cookie header found in response");
  }

  if (Array.isArray(setCookieHeader)) {
    return setCookieHeader[0] ?? "";
  }

  return setCookieHeader;
};
