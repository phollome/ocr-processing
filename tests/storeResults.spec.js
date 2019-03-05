const { resolve, join } = require("path");
const { promisify } = require("util");
const { randomString } = require("./utils");
const { readFile } = require("fs").promises;
const { TMP_DIR } = require("./globals");
const rimraf = promisify(require("rimraf"));

const { storeResults } = require("../src");
const targetDir = resolve(__dirname, TMP_DIR, "testtarget");

test("Store results in given folder", async () => {
  const dir = randomString();
  const fileName = randomString();
  const source = join(dir, `${fileName}.png`);
  const data = {
    [randomString()]: randomString(),
    [randomString()]: randomString()
  };
  await storeResults(targetDir, [{ source, data }]);
  const storedData = await readFile(
    resolve(targetDir, dir, `${fileName}.json`),
    {
      encoding: "utf8"
    }
  );
  expect(storedData).toEqual(JSON.stringify(data));
});

afterAll(async () => {
  await rimraf(targetDir);
});
