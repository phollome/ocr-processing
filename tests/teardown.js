const { promisify } = require("util");
const { resolve } = require("path");
const rimraf = promisify(require("rimraf"));
const { TMP_DIR } = require("./globals");

async function teardown() {
  console.log("teardown!!!");
  await rimraf(resolve(__dirname, TMP_DIR));
}

module.exports = teardown;
