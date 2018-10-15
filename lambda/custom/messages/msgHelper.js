const util = require("util");
module.exports = {
  pickOne: (array, ...strings) => util.format(array[Math.floor(Math.random() * array.length)], ...strings)
};
