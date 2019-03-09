require("dotenv").config();

const { promisify } = require("util");
const debug = require("debug");
const figlet = promisify(require("figlet"));
const yargs = require("yargs");
const { collectFiles, combineResult, storeResults } = require("./src");
const { name } = require("./package.json");
const { Storage } = require("@google-cloud/storage");
const readline = require("readline");
const { join } = require("path");
const { ImageAnnotatorClient } = require("@google-cloud/vision");

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

  console.log("\nUpload images");
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

  console.log("\nProcess images");
  counter(true);
  const client = new ImageAnnotatorClient();
  const detections = files.map(file => {
    return new Promise(resolve => {
      client.documentTextDetection(`gs://${bucket}/${file}`).then(result => {
        const combinedResult = combineResult(result);
        // @ts-ignore
        process.stdout.clearLine();
        // @ts-ignore
        process.stdout.cursorTo(0);
        process.stdout.write(
          `${file} processed (${counter()}/${files.length})`
        );
        resolve({ source: file, data: combinedResult });
      });
    });
  });
  const results = await Promise.all(detections);

  console.log("\nStore results");
  await storeResults(output, results);
}

const counter = (() => {
  let count = 0;
  return (reset = false) => {
    return (count = reset ? 0 : count + 1);
  };
})();

run().then(() => console.log("\nDone!"));
