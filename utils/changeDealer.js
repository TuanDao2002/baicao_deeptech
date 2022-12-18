const changeDealer = async (room) => {
	const { players } = room;

    room.dealer = null;
    let newDealer = players[0];

    players.remove(newDealer);
    room.players = players;
    room.dealer = newDealer;

    return room;
}

module.exports = changeDealer;