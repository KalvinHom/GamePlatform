import React, { useContext } from 'react';
import { Stack, Button } from "@chakra-ui/react";
import UserContext from '../contexts/UserContext';
import GameListSummary from './GameListSummary';

function GameList({ games }) {
    const {user, _} = useContext(UserContext);
    return (
        <Stack direction="column" width="60vw">
        {games.map(game => (
            <GameListSummary game={game}  user={user} key ={game.code}/>
           )
        )}
        </Stack>
    )

}

export default GameList