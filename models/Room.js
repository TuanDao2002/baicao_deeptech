const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
	{
		dealer: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},

		players: {
			type: [mongoose.Types.ObjectId],
			ref: "User",
			required: true,
		},

		deck: {
			type: mongoose.Types.ObjectId,
			ref: "Deck",
			required: true,
		},

		isFull: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

RoomSchema.pre("remove", async function () {
	await this.model("Deck").deleteOne({ _id: this.deck });
});

module.exports = mongoose.model("Room", RoomSchema);
