import React from "react";
import { Box, Heading } from "@chakra-ui/react" 
function CurrentPlayer({player, current}) {
    return (
        <Box>
            <Heading size="md">{player.username}</Heading>
        </Box>
    );

}

export default CurrentPlayer;