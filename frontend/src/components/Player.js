import React from "react";
import { Flex, Heading, Text} from "@chakra-ui/react" 
function Player({player, current}) {
    const TextComponent = current ? Heading : Text;
    const size = current ? "md" : "sm";
        return (
            <Flex  justifyContent="center" alignItems="center" minWidth="200px" padding="10px" paddingRight="10px">
                <TextComponent size={size}>{player.username}</TextComponent>
            </Flex>
        );

}

export default Player;