require("dotenv").config();

const { promisify } = require("util");
const chalk = require("chalk");
const debug = require("debug");
const figlet = promisify(require("figlet"));
const yargs = require("yargs");
const { collectFiles } = require("./src");
const { name } = require("./package.json");

const log = debug("main");

console.clear();

async function run() {
  const title = name.toUpperCase();
  console.log(await figlet(title));
  const argv = yargs
    .option("input", { alias: "i", default: "./in" })
    .option("output", { alias: "o", default: "./out" })
    .env("OCR")
    .locale("en")
    .wrap(80).argv;
  log("argv:", { ...argv });
  const files = await collectFiles(argv.input);
  log("files:", files);
}

run().then(() => console.log("Done!"));
