const mongoose = require("mongoose");
const { MAX_NUM_CARDS_IN_DECK, DEFAULT_COINS } = require("../utils/constant");

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

	point: {
		type: Number,
		required: true,
		default: 0,
	},

	coins: {
		type: Number,
		required: true,
		default: DEFAULT_COINS,
	},
});

const DeckSchema = new mongoose.Schema(
	{
		remainingCards: {
			type: [String],
			required: true,
			default: [],
		},

		hands: {
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
