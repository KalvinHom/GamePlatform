import React, { useContext } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import Whiteboard from "./Whiteboard";
import Players from "./Players";
import UserContext from "../contexts/UserContext";
import ImposterVote from "./ImposterVote";
function Game({ game, channel }) {
    const { user, _ } = useContext(UserContext);
    return (
        <Flex
            // alignItems="center"
            justifyContent="center"
            margin="20px"
            height="90vh"
            flexWrap= "wrap"
            alignContent="flex-start"
            sx={{
                gap:"10px"}
            }>
            <Flex
                flexDirection="column"
                width="70vw"
                mt="50px"
                alignItems="center"
                justifyContent="center"
            >
                <Heading size="lg">Theme: {game.theme}</Heading>
                {game.imposter.uuid == user.uuid ? <Heading color="red">You are the imposter</Heading> : <Heading>Word: {game.word}</Heading>}                
                <Players game={game} mt="20px" />
                <ImposterVote game={game} mt="20px" />
            </Flex>
            <Whiteboard game={game} channel={channel} />

        </Flex>

    )
}

export default Game;