const { promisify } = require("util");
const { resolve, extname, dirname } = require("path");
const { writeFile } = require("fs").promises;
const mkdirp = promisify(require("mkdirp"));

/**
 * Store results
 * @param {string} dir - directory to store results
 * @param {Array<{source: string, data: object}>} results - results of OCR
 * @return {Promise<void>}
 */
async function storeResults(dir, results) {
  const promises = results.map(result => {
    const { source, data } = result;
    const filePath = `${source.replace(extname(source), "")}.json`;
    const path = resolve(dir, filePath);
    return new Promise((resolve, reject) => {
      mkdirp(dirname(path))
        .then(() => writeFile(path, JSON.stringify(data)))
        .then(resolve)
        .catch(reject);
    });
  });
  await Promise.all(promises);
}

module.exports = storeResults;
