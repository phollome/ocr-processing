/**
 * Create random string
 * @returns {string}
 */
function randomString() {
  return Math.random()
    .toString(36)
    .substr(2, 5);
}

module.exports = {
  randomString
};
