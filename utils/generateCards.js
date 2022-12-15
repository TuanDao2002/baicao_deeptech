const ranks = require("../enum/ranks");
const suites = require("../enum/suites");

const cards = [];

for (let rank of ranks) {
    for (let suite of suites) {
        cards.push(rank + " of " + suite);
    }
}

module.exports = cards;