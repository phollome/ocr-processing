const { promisify } = require("util");
const { resolve } = require("path");
const mkdirp = promisify(require("mkdirp"));
const { TMP_DIR } = require("./globals");

async function setup() {
  await mkdirp(resolve(__dirname, TMP_DIR));
}

module.exports = setup;
