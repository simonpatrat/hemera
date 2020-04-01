/*

  DEPRECATED FOR NOW because I am using parcel to bundle css
  FIXME: check for dependencies and then remove unused tasks
*/

const cssTasks = require("./cssTasks");

const { compile: compileCss } = cssTasks;

module.exports = async function() {
  await compileCss();
};
