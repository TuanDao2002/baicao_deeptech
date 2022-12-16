const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const Room = require("../models/Room");

const { generateCards, changeDealer } = require("../utils");
const mongoose = require("mongoose");
const MAX_NUM_PLAYERS = 3;

const getRooms = async (req, res) => {
	let {
		query: { next_cursor },
	} = req;

	const queryObject = {};

	const resultsLimitPerLoading = 10;
	if (next_cursor) {
		const [createdAt, _id] = Buffer.from(next_cursor, "base64")
			.toString("ascii")
			.split("_");

		queryObject.createdAt = { $lte: createdAt };
		queryObject._id = { $lt: _id };
	}

	let rooms = Room.find(queryObject, { players: 0, cards: 0 }).populate({
		path: "dealer",
		select: "-email -password",
	});

	rooms = rooms.sort("-createdAt -_id");
	rooms = rooms.limit(resultsLimitPerLoading);
	const results = await rooms;

	const count = await Room.countDocuments(queryObject);
	next_cursor = null;

	// if the there are still remaining results, create a cursor to load the next ones
	if (count !== results.length) {
		const lastResult = results[results.length - 1];
		next_cursor = Buffer.from(
			lastResult.createdAt.toISOString() + "_" + lastResult._id
		).toString("base64");
	}

	res.status(StatusCodes.OK).json({ results, next_cursor });
};

const viewRoom = async (req, res) => {
	let {
		params: { roomId },
	} = req;

	const room = await Room.findOne({ _id: roomId })
		.populate({
			path: "dealer",
			select: "-email -password",
		})
		.populate({
			path: "players",
			select: "-email -password",
		});

	if (!room) {
		throw new CustomError.BadRequestError("This room does not exist");
	}

	res.status(StatusCodes.OK).json({ room });
};

const createRoom = async (req, res) => {
	let {
		user: { userId },
	} = req;

	const findRoom = await Room.findOne({
		$or: [{ dealer: userId }, { players: userId }],
	});

	if (findRoom) {
		if (findRoom.dealer.toString() === userId) {
			throw new CustomError.BadRequestError(
				"You are already a dealer in another room"
			);
		}

		if (findRoom.players.includes(mongoose.Types.ObjectId(userId))) {
			throw new CustomError.BadRequestError(
				"You are already a player in another room"
			);
		}
	}

	const newRoom = {
		dealer: userId,
		cards: generateCards,
	};

	const room = await Room.create(newRoom);
	res.status(StatusCodes.OK).json({ room });
};

const generateShareLink = async (req, res) => {
	let {
		params: { roomId },
	} = req;

	const room = await Room.findOne({ _id: roomId });
	if (!room) {
		throw new CustomError.BadRequestError("This room does not exist");
	}

	res.status(StatusCodes.OK).json({
		shareLink:
			req.protocol + "://" + req.get("host") + "/api/room/view/" + roomId,
	});
};

const joinRoom = async (req, res) => {
	let {
		user: { userId },
		params: { roomId },
	} = req;

	let room = await Room.findOne({ _id: roomId });
	if (!room) {
		throw new CustomError.BadRequestError("This room does not exist");
	}

	const { dealer, players, isFull } = room;
	if (isFull) throw new CustomError.BadRequestError("This room is full");

	if (dealer.toString() === userId) {
		throw new CustomError.BadRequestError(
			"You are already a dealer in this room"
		);
	}

	if (players.includes(mongoose.Types.ObjectId(userId))) {
		throw new CustomError.BadRequestError("You already joined this room");
	}

	const findRoom = await Room.findOne({
		$or: [{ dealer: userId }, { players: userId }],
	});

	if (findRoom) {
		if (findRoom.dealer.toString() === userId) {
			throw new CustomError.BadRequestError(
				"You are already a dealer in another room"
			);
		}

		if (findRoom.players.includes(mongoose.Types.ObjectId(userId))) {
			throw new CustomError.BadRequestError(
				"You are already a player in another room"
			);
		}
	}

	players.push(userId);
	room.players = players;
	if (room.players.length >= MAX_NUM_PLAYERS) {
		room.isFull = true;
	}

	room = await room.save();
	room = await room
		.populate({
			path: "players",
			select: "-email -password",
		})
		.populate({
			path: "dealer",
			select: "-email -password",
		})
		.execPopulate();

	res.status(StatusCodes.OK).json({ room });
};

const leaveRoom = async (req, res) => {
	let {
		user: { userId },
		params: { roomId },
	} = req;

	let room = await Room.findOne({ _id: roomId }).populate({
		path: "players",
		select: "-email -password",
	});

	if (!room) {
		throw new CustomError.BadRequestError("This room does not exist");
	}

	const { dealer, players } = room;
	let isPlayer = false;
	for (let player of players) {
		if (player._id.toString() === userId) {
			isPlayer = true;
			break;
		}
	}

	if (!isPlayer && dealer.toString() !== userId) {
		throw new CustomError.BadRequestError("You have not joined this room");
	}

	if (dealer.toString() === userId) {
		room = await changeDealer(room);
		if (!room) {
			res.status(StatusCodes.OK).json({ msg: "This room is removed" });
			return;
		}
	} else if (isPlayer) {
		players.remove(mongoose.Types.ObjectId(userId));
		room.players = players;
	}

	if (room.players.length < MAX_NUM_PLAYERS) {
		room.isFull = false;
	}

	await room.save();
	res.status(StatusCodes.OK).json({ room });
};

module.exports = {
	getRooms,
	viewRoom,
	createRoom,
	generateShareLink,
	joinRoom,
	leaveRoom,
};
