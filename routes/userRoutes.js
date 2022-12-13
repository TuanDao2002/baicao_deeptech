const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
	editUserProfile,
	getUserProfile,
} = require("../controllers/userController");

router.put("/edit", authenticateUser, editUserProfile);
router.get("/view/:userId", getUserProfile);

module.exports = router;
