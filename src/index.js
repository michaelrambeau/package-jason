const scan = require("./scan");

module.exports = async function(packageName) {
  const cache = new Map();
  return scan({
    packageName,
    cache
  });
};
