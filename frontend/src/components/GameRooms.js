import React, { useEffect, useContext, useRef, useState } from "react";
import socket from "../socket";
import UserContext from "../contexts/UserContext";
import { create as createGame } from "../api/game";
import  "./game-rooms.scss"
function GameRooms() {
    // connect to the game rooms socket to receive updates on current games
    const channelRef = useRef(null);
    const { user, updateUser } = useContext(UserContext)

    const [gameRooms, setGameRooms] = useState(null);
    useEffect(() => {
        channelRef.current = socket.channel("games:lobby", user);
        console.log(channelRef.current.join().receive("ok", ({games}) => {
            console.log(games);
            setGameRooms(_previousRooms => games)
        } )
        );
        channelRef.current.on('new_game', onNewRoom);

        return () => {
            channelRef.current.leave();
        }

    }, [])

    function onNewRoom(newRoom) {    
        setGameRooms(previousRooms => [...previousRooms, newRoom])
    }
    function createRoom() {
        createGame({user: user})
    }
    console.log("rendered")
    return (
        <div className="game-rooms">
            {gameRooms && gameRooms.map((room, idx) => (
                <div key={idx} className="game-room">
                    <div className="game-room-data">Host:{room.host.username}</div>
                    <div className="game-room-data">Room code:{room.code}</div>
                    <div className="game-room-data">Player count: {room.players.length}</div>
                </div>)

            ) }
            <button onClick={createRoom}>Create New Room</button>
        </div>
    )
}

export default GameRooms;