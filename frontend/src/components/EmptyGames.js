import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Box, Container, VStack, Button } from "@chakra-ui/react"
import { create as createGame } from "../api/game";
import UserContext from "../contexts/UserContext";

function EmptyGames() {
    const { user, _updateUser } = useContext(UserContext)
    let history = useHistory();

    function createRoom() {
        const game = createGame({ user: user }).then(function (response) {
            history.push(`/game/${response.data.code}`)
        });
    }

    return (
        <Box border="1px" borderRadius="5px" h="50vh" w="60vw" p={4}>
            <VStack>
                <Container> There are currently no open games, but you can start your own! </Container>
                <Button colorScheme="teal" size="sm" onClick={createRoom}>Create New Room</Button>
            </VStack>
        </Box>
    )
}

export default EmptyGames