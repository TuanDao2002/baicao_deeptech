const specialRanks = require("./specialRanks");
let ranks = specialRanks;
for (let i = 2; i <= 10; i++) {
	ranks.push(i);
}

module.exports = ranks;
