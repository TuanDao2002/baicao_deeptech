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

        cards: {
            type: [String],
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

module.exports = mongoose.model("Room", RoomSchema);
