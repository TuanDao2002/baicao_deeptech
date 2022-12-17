const changeDealer = async (room) => {
	const { players } = room;

    room.dealer = null;
    let newDealer = players[0];
    for (let player of room.players) {
        if (player.coins > newDealer.coins) {
            newDealer = player;
        }
    }

    players.remove(newDealer);
    room.players = players;
    room.dealer = newDealer;

    return room;
}

module.exports = changeDealer;