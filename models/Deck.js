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

		playerHands: {
			type: [handSchema],
			required: true,
			default: [],
		},

		dealerHand: {
			type: handSchema,
			default: null,
		},

		remaining: {
			type: Number,
			required: true,
			default: MAX_NUM_CARDS_IN_DECK,
		},
	},
	{ timestamps: true }
);

DeckSchema.methods.getPublicFields = function () {
	var returnObject = {
		remaining: this.remaining,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
	};
	return returnObject;
};

module.exports = mongoose.model("Deck", DeckSchema);
