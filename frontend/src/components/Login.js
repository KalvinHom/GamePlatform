import React, { useContext, useEffect, useRef } from "react";
import { Flex, Stack, Heading, FormControl, FormLabel, Input, Button } from "@chakra-ui/react"
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import { create } from "../api/game";
import "./login.scss"
const Login = (props) => {
    let history = useHistory();
    const { user, updateUser } = useContext(UserContext)
    const value = useContext(UserContext);
    const referrer = props.location.state ? props.location.state.referrer : null;
    useEffect(() => {
        const u = localStorage.getItem("user");
        if (!!u) {
            updateUser(JSON.parse(u))
            history.push(referrer || '/games');
        }
    }, [])



    const userRef = useRef(null);

    const submitUser = () => {
        const newUser = {
            uuid: uuidv4(),
            username: userRef.current.value
        };
        updateUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        history.push(referrer || '/games');
    }

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                flexDir="column"
                mb="2"
                justifyContent="center"
                alignItems="center"
            >
                <Heading color="teal.400">Welcome</Heading>
                <FormControl id="login" justifyContent="center" alignItems="center">
                    <Flex
                        flexDirection="column" justifyContent="center"
                        alignItems="center">
                        <FormLabel>Enter your display name</FormLabel>
                        <Input placeholder="Display Name" ref={userRef} />
                        <Button color="teal.400" mt="20px" onClick={submitUser}>Enter</Button>
                    </Flex>
                </FormControl>

            </Stack>
        </Flex>
    )
}

export default Login;

