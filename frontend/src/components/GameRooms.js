import React, { useEffect, useContext, useRef, useState } from "react";
import socket from "../socket";
import UserContext from "../contexts/UserContext";
import GameListSummary from "./GameListSummary";
import { create as createGame } from "../api/game";
import { Route } from "react-router";
import { useHistory } from "react-router-dom";
import GameLobby from "./GameLobby";

import  "./game-rooms.scss"
function GameRooms() {
    // connect to the game rooms socket to receive updates on current games
    const channelRef = useRef(null);
    const { user, updateUser } = useContext(UserContext)
    console.log(user);
    let history = useHistory();

    const [gameRooms, setGameRooms] = useState(null);
    useEffect(() => {
        channelRef.current = socket.channel("games:lobby", user);
        console.log(channelRef.current.join().receive("ok", ({games}) => {
            console.log(games);
            setGameRooms(_previousRooms => games)
        } )
        );
        channelRef.current.on('new_game', onNewRoom);
        // channelRef.current.on("player_joined", onPlayerJoined);

        return () => {
            channelRef.current.leave();
        }

    }, [])

    function onNewRoom(newRoom) {    
        setGameRooms(previousRooms => [...previousRooms, newRoom])
    }

    // function onPlayerJoined(payload) {
    //     console.log(payload)
    // }
    function createRoom() {
        const game = createGame({user: user}).then(function(response) {
            history.push(`/game/${response.data.code}`)
        });
        

    }

  
    console.log("rendered")
    return (
        <div className="game-rooms">
            {gameRooms && gameRooms.map(game => (
                <GameListSummary game={game}  user={user} key ={game.code}/>
            ))} 
            <button onClick={createRoom}>Create New Room</button>
        </div>
    )
}

export default GameRooms;