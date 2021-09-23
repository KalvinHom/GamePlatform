import React, { useEffect, useContext, useRef, useState } from "react";
import { Flex, Text, Container, Button } from "@chakra-ui/react"

import socket from "../socket";
import UserContext from "../contexts/UserContext";
import { create as createGame } from "../api/game";
import { useHistory } from "react-router-dom";
import GameList from "./GameList";
import EmptyGames from "./EmptyGames";


import  "./game-rooms.scss"
function Games() {
    // connect to the game rooms socket to receive updates on current games
    const channelRef = useRef(null);
    const { user, updateUser } = useContext(UserContext)

    let history = useHistory();

    const [games, setGames] = useState(null);
    useEffect(() => {
        channelRef.current = socket.channel("games:lobby", user);
       
        console.log(channelRef.current.join().receive("ok", ({games}) => {
            setGames(_previousRooms => games)
        } )
        );
        channelRef.current.on('new_game', onNewRoom);
        channelRef.current.on('refresh_games', onRefreshGames);
       
        // channelRef.current.on("player_joined", onPlayerJoined);

        return () => {
            channelRef.current.leave();
        }

    }, [])

    function onRefreshGames({games}) {
        console.log("refreshing games!")
        console.log(games)
        setGames(_prev => games)
    }
    function onNewRoom(newRoom) {    
        console.log("got new game")
        setGames(previousRooms => [...previousRooms, newRoom])
    }

    // function onPlayerJoined(payload) {
    //     console.log(payload)
    // }
    function createRoom() {
        const game = createGame({user: user}).then(function(response) {
            history.push(`/game/${response.data.code}`)
        });
    }

  
    console.log(user)
    return (
        <Flex
        flexDirection="column"
        width="70vw"
        height="100vh"
        mt="50px"
        // justifyContent="center"
        alignItems="center"
    >            <Flex width="60vw" alignItems="left">
                    <Text>Welcome {user.username}</Text>
                    {!games || !!games.length && <Button marginLeft="auto">Create Game</Button>}
                </Flex>
            {games && !!games.length ? <GameList games={games} /> : <EmptyGames />} 
        </Flex>
    )
}

export default Games;