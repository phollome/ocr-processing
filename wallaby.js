module.exports = () => {
  return {
    files: ["src/**/*.js", "app.js", "tests/**/*.js", "!tests/**/*spec.js"],
    tests: ["tests/**/*spec.js"],
    env: {
      type: "node"
    },
    testFramework: "jest"
  };
};
