require("dotenv").config();

const { promisify } = require("util");
const debug = require("debug");
const figlet = promisify(require("figlet"));
const yargs = require("yargs");
const { collectFiles } = require("./src");
const { name } = require("./package.json");
const { Storage } = require("@google-cloud/storage");
const readline = require("readline");
const { join } = require("path");

const log = debug("main");

console.clear();

async function run() {
  const title = name.toUpperCase();
  console.log(await figlet(title));

  const argv = yargs
    .option("input", { alias: "i", default: "./in" })
    .option("output", { alias: "o", default: "./out" })
    .option("bucket", { alias: "b" })
    .option("keyFilename", { alias: "k" })
    .env()
    .locale("en")
    .wrap(80).argv;

  const { input, bucket, output, keyFilename } = argv;
  log("argv:", "-i", input, "-o", output, "-b", bucket, "-k", keyFilename);

  const files = await collectFiles(argv.input);
  const storage = new Storage({ keyFilename });
  const fileUploads = files.map(file => {
    return new Promise(resolve => {
      storage
        .bucket(bucket)
        .upload(join(input, file), {
          destination: file,
          gzip: true,
          metadata: { cacheControl: "public, max-age=31536000" }
        })
        .then(() => {
          // @ts-ignore
          process.stdout.clearLine();
          // @ts-ignore
          process.stdout.cursorTo(0);
          process.stdout.write(
            `${file} uploaded (${counter()}/${files.length})`
          );
          resolve();
        });
    });
  });
  await Promise.all(fileUploads);
}

const counter = (() => {
  let count = 0;
  return (reset = false) => {
    return (count = reset ? 0 : count + 1);
  };
})();

run().then(() => console.log("\nDone!"));
