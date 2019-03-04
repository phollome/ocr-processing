module.exports = {
  globalSetup: "./tests/setup.js",
  globalTeardown: "./tests/teardown.js",
  collectCoverage: true,
  collectCoverageFrom: ["./src/*.js"]
};
