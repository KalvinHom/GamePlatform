import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import socket from "../socket";
import { join } from "../api/game";

function GameListSummary(props) {
    let history = useHistory();
    const channelRef = useRef(null);
    const [game, updateGame] = useState(props.game);
    const { user } = props;

    useEffect(() => {
        channelRef.current = socket.channel(`game_summary:${game.code}`, {});
        channelRef.current.join().receive("ok", payload => {
            console.log(payload);
        });
        channelRef.current.on("player_left", updateGameState);
        channelRef.current.on("player_joined", updateGameState);
        channelRef.current.on("game_started", updateGameState);


        return () => {
            channelRef.current.leave();
        }

    }, [])

    function updateGameState(payload) {
        updateGame(payload)
    }
    function joinGame(code) {
        // join(game.code, user).then(function(response) {
            history.push(`/game/${code}`)
        // })
    }
    console.log(`re-rendering ${game.code}`)
    return (
        <div key={game.code} className="game-room">
        <div className="game-room-data">Host:{game.host.username}</div>
        <div className="game-room-data">Room code:{game.code}</div>
        <div className="game-room-data">Player count: {game.players.length}</div>
        {game.game_state == "new" ? 
            <Button onClick={() => {
            joinGame(game.code)
            }}>Join</Button>
            :  <div>Game in progress</div>
        }
    </div>
    );
}

export default GameListSummary