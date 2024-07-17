// @ts-check

const { scryptSync } = require("crypto");

/**
 * @param {string} password
 * @param {string} salt
 */
function scryptPassword(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

module.exports = { scryptPassword };
