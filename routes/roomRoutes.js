const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
    getRooms,
    createRoom,
    joinRoom,
    leaveRoom,
} = require("../controllers/roomController");

router.get("/all", getRooms);
router.post("/create", authenticateUser, createRoom);
router.patch("/join/:roomId", authenticateUser, joinRoom);
router.patch("/leave", authenticateUser, leaveRoom);

module.exports = router;
