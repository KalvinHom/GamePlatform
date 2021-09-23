import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Flex, Box, Button } from "@chakra-ui/react";
import UserContext from "../contexts/UserContext";
import { start } from "../api/game";
import socket from "../socket"
import Game from "./Game";
import "./game-lobby.scss";

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
        channelRef.current = socket.channel(`game:${code}`, {user: user});
        channelRef.current.join().receive("ok", payload => {
            console.log(payload);
            updateGame(payload);
            updateLoading(false);
        });
        channelRef.current.on("player_joined", onPlayerJoined);
        channelRef.current.on("player_left", onPlayerLeft);

        channelRef.current.on("game_started", onStartGame);
        channelRef.current.on("next_turn", onNextTurn);

        return () => {
            console.log("leaving");
            channelRef.current.push("player_left", user)
            channelRef.current.leave()
        }
    }, [])

        
    function onPlayerJoined(payload) {
        console.log("player joined?");
        updateGame(payload)
    }

    function onNextTurn(payload) {
        console.log("broadcast next turn")
        console.log(payload)
        updateGame(payload)
    }

    function onPlayerLeft(payload) {
        console.log("player left")
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
                <Game game={game} channel={channelRef.current}/>

        )
        console.log(game.host);
        console.log(user);
    return (
     <Flex
        flexDirection="row"
        width="100vw"
        // height="100vh"
        mt="50px"
        justifyContent="center"
        // alignItems="center"
        key={game.code}>
            <Flex  
                border="1px"
                borderRadius="5px"
                flexDirection="column"
                padding="20px"
            >
            <div className="game-room-data">Host:{game.host.username}</div>
            <div className="game-room-data">Room code:{game.code}</div>
            <div className="game-room-data">Players: 
            {game.players.map(player => {
                return <div key={player.username}>{player.username}</div>
            })}</div>
            {game.host.username == user.username &&
                <Button onClick={startGame}>Start Game</Button>
            }
            </Flex>
        </Flex>
    );
}
   


export default GameLobby