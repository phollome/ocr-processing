const glob = require("glob");

/**
 * Collect files for later OCR processing
 * @param {string} dir - directory to start search
 * @param {...string} extnames - file extensions to search for
 * @returns {Promise<Array<string>>}
 * TODO: add flag to ignore still processed files
 */
function collectFiles(dir, ...extnames) {
  return new Promise((resolve, reject) => {
    const extensions = extnames.length > 0 ? extnames : ["png", "jpg", "jpeg"];
    glob(`**/*.{${[...extensions]}}`, { cwd: dir }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

module.exports = collectFiles;
