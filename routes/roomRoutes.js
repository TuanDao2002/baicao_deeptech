const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
	getRooms,
	viewRoom,
	createRoom,
	generateShareLink,
	joinRoom,
	leaveRoom,
} = require("../controllers/roomController");

router.get("/all", getRooms);
router.get("/view/:roomId", viewRoom);
router.post("/create", authenticateUser, createRoom);
router.post("/share/:roomId", generateShareLink);
router.patch("/join/:roomId", authenticateUser, joinRoom);
router.patch("/leave", authenticateUser, leaveRoom);

module.exports = router;
