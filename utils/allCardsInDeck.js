const ranks = require("../enum/ranks");
const suites = require("../enum/suites");

// Fisher–Yates Shuffle
const shuffle = (array) => {
	var m = array.length,
		t,
		i;

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
};

let cards = [];
for (let rank of ranks) {
	for (let suite of suites) {
		cards.push(rank + " of " + suite);
	}
}

cards = shuffle(cards);
module.exports = cards;
