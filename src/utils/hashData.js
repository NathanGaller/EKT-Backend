const bcrypt = require('bcrypt');

async function hashData(data, saltRounds = 10) {
  const hashedData = await bcrypt.hash(data, saltRounds);
  return hashedData;
}

async function compareData(data, hashedData) {
  const result = await bcrypt.compare(data, hashedData);
  return result;
}

module.exports = { hashData, compareData };
