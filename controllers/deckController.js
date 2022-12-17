const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const Room = require("../models/Room");
const Deck = require("../models/Deck");

const specialRanks = require("../enum/specialRanks");
const { changeDealer, shuffle, allCardsInDeck, constant } = require("../utils");
const mongoose = require("mongoose");
const { handle } = require("express/lib/router");
const {
	MAX_NUM_CARDS_IN_DECK,
	MAX_NUM_CARDS_IN_HAND,
	MAX_NUM_PLAYERS,
	DEFAULT_COINS,
	DEDUCT_COINS,
} = constant;

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

	let deck = await Deck.findOne({ _id: deckId });
	if (!deck) {
		throw new CustomError.BadRequestError("This deck does not exist");
	}

	deck.remainingCards = shuffle(allCardsInDeck);
	deck.remaining = MAX_NUM_CARDS_IN_DECK;
	for (let hand of deck.playerHands) {
		hand.cards = [];
		hand.point = 0;
	}

	if (deck.dealerHand) {
		deck.dealerHand.cards = [];
		deck.dealerHand.point = 0;
	}

	deck = await deck.save();
	// deck = await deck
	// 	.select("-remainingCards")
	// 	.populate({
	// 		path: "dealerHand.player",
	// 		select: "-email -password",
	// 	})
	// 	.populate({
	// 		path: "playerHands.player",
	// 		select: "-email -password",
	// 	})
	// 	.execPopulate();

	let result = deck.getPublicFields();
	res.status(StatusCodes.OK).json({ result });
};

const dealCards = (deck, id, isDealer) => {
	const cards = deck.remainingCards.splice(0, MAX_NUM_CARDS_IN_HAND);
	let totalPoints = 0;
	for (let card of cards) {
		const [rank, suite] = card.split(" of ");
		if (specialRanks.includes(rank)) {
			if (rank === "A") {
				totalPoints += 1;
			} else {
				totalPoints += 10;
			}
		} else {
			totalPoints += parseInt(rank);
		}
	}

	if (isDealer && deck.dealerHand) {
		deck.dealerHand.cards = cards;
		deck.dealerHand.point = totalPoints % 10;
		deck.remaining -= MAX_NUM_CARDS_IN_HAND;

		return deck;
	}

	for (let hand of deck.playerHands) {
		if (!isDealer && hand.player.equals(id)) {
			hand.cards = cards;
			hand.point = totalPoints % 10;
			deck.remaining -= MAX_NUM_CARDS_IN_HAND;

			return deck;
		}
	}

	return deck;
};

const drawn = async (req, res) => {
	let {
		user: { userId },
		params: { deckId },
	} = req;

	const room = await Room.findOne({ dealer: userId, deck: deckId });
	if (!room) {
		throw new CustomError.BadRequestError(
			"You are not the dealer of this room"
		);
	}

	let deck = await Deck.findOne({ _id: deckId });
	if (!deck) {
		throw new CustomError.BadRequestError("This deck does not exist");
	}

	const { players } = room;
	let numOfPlayers = players.length + 1;
	if (deck.remaining < numOfPlayers * MAX_NUM_CARDS_IN_HAND) {
		throw new CustomError.BadRequestError(
			"Not enough cards for all players, please shuffle again"
		);
	}

	if (numOfPlayers === 1) {
		throw new CustomError.BadRequestError(
			"Must have at least 2 players in the room to play"
		);
	}

	for (let player of players) {
		deck = dealCards(deck, player, false);
	}

	deck = dealCards(deck, userId, true);

	deck = await deck.save();
	// deck = await deck
	// 	.populate({
	// 		path: "dealerHand.player",
	// 		select: "-email -password",
	// 	})
	// 	.populate({
	// 		path: "playerHands.player",
	// 		select: "-email -password",
	// 	})
	// 	.execPopulate();

	let result = deck.getPublicFields();
	res.status(StatusCodes.OK).json({ result });
};

const reveal = async (req, res) => {
	let {
		user: { userId },
		params: { deckId },
	} = req;

	const room = await Room.findOne({ dealer: userId, deck: deckId });
	if (!room) {
		throw new CustomError.BadRequestError(
			"You are not the dealer of this room"
		);
	}

	let deck = await Deck.findOne({ _id: deckId }, { remainingCards: 0 });
	if (!deck) {
		throw new CustomError.BadRequestError("This deck does not exist");
	}

    for (let hand of deck.playerHands) {
        if (hand.point > deck.dealerHand.point) {
            hand.coins += DEDUCT_COINS;
            deck.dealerHand.coins -= DEDUCT_COINS;
        } else if (hand.point < deck.dealerHand.point) {
            hand.coins -= DEDUCT_COINS;
            deck.dealerHand.coins += DEDUCT_COINS;
        }
    }

    deck = await deck.save();
	deck = await deck
		.populate({
			path: "dealerHand.player",
			select: "-email -password",
		})
		.populate({
			path: "playerHands.player",
			select: "-email -password",
		})
		.execPopulate();

	res.status(StatusCodes.OK).json({ deck });
};

const reset = async (req, res) => {};

module.exports = {
	shuffleDeck,
	drawn,
	reveal,
	reset,
};
