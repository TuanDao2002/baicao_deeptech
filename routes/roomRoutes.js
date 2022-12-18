const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
	getRooms,
	viewRoom,
	createRoom,
	generateShareLink,
	generateSubscriptionToken,
	joinRoom,
	leaveRoom,
} = require("../controllers/roomController");

router.get("/all", getRooms);
router.get("/view/:roomId", viewRoom);
router.post("/create", authenticateUser, createRoom);
router.post("/share/:roomId", generateShareLink);
router.get("/subscribe", authenticateUser, generateSubscriptionToken);
router.patch("/join/:roomId", authenticateUser, joinRoom);
router.patch("/leave/:roomId", authenticateUser, leaveRoom);

module.exports = router;
