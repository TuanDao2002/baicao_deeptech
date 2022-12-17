const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const Room = require("../models/Room");
const Deck = require("../models/Deck");

const { changeDealer, shuffle, allCardsInDeck, constant } = require("../utils");
const mongoose = require("mongoose");
const { MAX_NUM_CARDS_IN_DECK, MAX_NUM_PLAYERS, DEFAULT_COINS, DEDUCT_COINS } =
	constant;

const shuffleDeck = async (req, res) => {
	let {
		user: { userId },
		params: { deckId },
	} = req;

	const findRoom = await Room.findOne({ dealer: userId, deck: deckId });
	if (!findRoom) {
		throw new CustomError.BadRequestError(
			"You are not the dealer of this room"
		);
	}

	let deck = await Deck.findOne({ _id: deckId }).populate({
		path: "hands.player",
		select: "-email -password",
	});

	if (!deck) {
		throw new CustomError.BadRequestError("This deck does not exist");
	}

	deck.remainingCards = shuffle(deck.remainingCards);
	deck.remaining = MAX_NUM_CARDS_IN_DECK;
	for (let hand of deck.hands) {
		hand.cards = [];
		hand.point = 0;
	}

	await deck.save();
	res.status(StatusCodes.OK).json({ deck });
};

const drawn = async (req, res) => {};

const reveal = async (req, res) => {};

const reset = async (req, res) => {};

module.exports = {
	shuffleDeck,
	drawn,
	reveal,
	reset,
};
