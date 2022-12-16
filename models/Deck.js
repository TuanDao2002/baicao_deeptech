const mongoose = require("mongoose");
const { MAX_NUM_CARDS_IN_DECK, ALL_CARDS_IN_DECK } = require("../utils/constant");

const handSchema = new mongoose.Schema({
	player: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: "User",
	},

	cards: {
		type: [String],
		required: true,
		default: [],
	},
});

const DeckSchema = new mongoose.Schema(
	{
		remainingCards: {
			type: [String],
			required: true,
            default: ALL_CARDS_IN_DECK
		},

		drawnCards: {
			type: [handSchema],
			required: true,
			default: [],
		},

		remaining: {
			type: Number,
			required: true,
			default: MAX_NUM_CARDS_IN_DECK,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Deck", DeckSchema);
