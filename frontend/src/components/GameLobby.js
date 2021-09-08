import React, { useEffect, useState, useRef, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { useParams, useHistory } from "react-router-dom";
import { start } from "../api/game";
import socket from "../socket"
import Whiteboard from "./Whiteboard";

function GameLobby() {
    const channelRef = useRef(null);
    const { user, updateUser } = useContext(UserContext)
    console.log(user);
    let { code } = useParams();
    let history = useHistory();
    console.log(code)
    const [game, updateGame] = useState(null);
    const [loading, updateLoading] = useState(true);
    // const { user } = props;

    useEffect(() => {
        console.log("useEffect")
        channelRef.current = socket.channel(`game:${code}`, {});
        channelRef.current.join().receive("ok", payload => {
            console.log(payload);
            updateGame(payload);
            updateLoading(false);
        });
        channelRef.current.on("player_joined", onPlayerJoined);
        channelRef.current.on("game_started", onStartGame);

        return () => {
            channelRef.current.leave();
        }

    }, [])

    function onPlayerJoined(payload) {
        updateGame(payload)
    }
    function joinGame() {
        join(game.code, user)
    }

    function onStartGame(payload) {
        console.log('starting game');
        updateGame(payload)
    }

    function startGame() {
        start(game.code)
    }
    
    if(loading) 
        return (<div>Loading</div>);
    if(!game)
        return (<div>Invalid code</div>)
    if(game.game_state == "in_progress") 
        return (
            <Whiteboard game={game} channel={channelRef.current}/>
        )
        console.log(game.host);
        console.log(user);
    return (
        <div key={game.code} className="game-lobby">
        <div className="game-room-data">Host:{game.host.username}</div>
        <div className="game-room-data">Room code:{game.code}</div>
        <div className="game-room-data">Players: 
        {game.players.map(player => {
            return <div key={player.username}>{player.username}</div>
        })}</div>
        {game.host.username == user.username &&
            <button onClick={startGame}>Start Game</button>
        }
    </div>
    );
}
   


export default GameLobby