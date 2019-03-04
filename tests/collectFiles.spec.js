const { promisify } = require("util");
const { resolve } = require("path");
const { writeFile } = require("fs").promises;
const mkdirp = promisify(require("mkdirp"));
const rimraf = promisify(require("rimraf"));

const collectFiles = require("../src/collectFiles");
const sourceDir = resolve(__dirname, "tmp/testsource");

beforeAll(async () => {
  const dir1 = await mkdirp(resolve(sourceDir, randomString()));
  const dir2 = await mkdirp(resolve(sourceDir, randomString()));
  await writeFile(resolve(dir1, `${randomString()}.png`), "");
  await writeFile(resolve(dir1, `${randomString()}.jpg`), "");
  await writeFile(resolve(dir2, `${randomString()}.jpeg`), "");
  await writeFile(resolve(dir2, `${randomString()}.txt`), "");
});

test("Collect all files of given location", async () => {
  const results = await collectFiles(sourceDir);
  expect(results).toHaveLength(3);
});

test("Collect all files with given extensions", async () => {
  const results = await collectFiles(sourceDir, "jpg", "png");
  expect(results).toHaveLength(2);
});

afterAll(async () => {
  await rimraf(sourceDir);
});

function randomString() {
  return Math.random()
    .toString(36)
    .substr(2, 5);
}
