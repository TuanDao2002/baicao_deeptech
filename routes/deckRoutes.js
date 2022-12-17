const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
	shuffleDeck,
	drawn,
	reveal,
	reset,
} = require("../controllers/deckController");

router.patch("/shuffle/:deckId", authenticateUser, shuffleDeck);
router.patch("/drawn/:deckId", authenticateUser, drawn);
router.patch("/reveal/:deckId", authenticateUser, reveal);
router.patch("/reset/:deckId", authenticateUser, reset);

module.exports = router;
