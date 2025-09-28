export default {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "ESNext",
        },
      },
    ],
  },
  testMatch: ["**/tests/**/*.(test|spec).ts", "**/*.(test|spec).ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};
