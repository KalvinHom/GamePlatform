import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { Box, Container, Center, Heading, Button, Stack, VStack, Flex} from "@chakra-ui/react"
import "./Home.scss"

const Home = () => {
   let history = useHistory();
  
    return (
        <Box
            width="100vw"
            height="100vh"
            backgroundImage="url('/images/background.png')"
            backgroundPosition="right top"
            backgroundRepeat="no-repeat">
           <Center width="60vw" height="70vh">
               <VStack>
                   <Heading as="h1" size="2xl">Hello, I am Kalvin</Heading>
                   <Heading as="h3" size="md">Software Enginner, Photographer, Rockclimber, Corgi Owner</Heading>
                   
                   
                   <Stack direction="row" spacing={4} pt="40px">
                    <Button pr="10px">
                        Photography
                    </Button>
                    <Button onClick={() => history.push("/login")}>
                        Games
                    </Button>
                    <Button p="10px">
                        About
                    </Button>
                </Stack>
                </VStack>
                
            </Center>
        </Box>
    );
};



export default Home;