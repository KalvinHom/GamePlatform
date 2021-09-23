import React from "react";
import { Flex, Heading, Stack, StackDivider } from "@chakra-ui/react";
import Player from "./Player";
function Players({game: game, ...rest}) {
    return (
        <Flex flexDirection="column" alignItems="center" {...rest} >
            <Heading marginRight="10px" size="lg">Players</Heading>
            <Flex>
                <Stack 
                    direction="column"
                    divider={<StackDivider borderColor="gray.200"  />}            
                    border="1px"
                    borderRadius="5px"
                >
                    {game.players.map( player => {
                        return <Player key={player.uuid} player={player} current={!!game.current_player && (player.uuid == game.current_player.uuid)} />
                    })}
                </Stack>
            </Flex>
        </Flex>
    );

}

export default Players;