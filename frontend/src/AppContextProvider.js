import React, { createContext, useEffect, useState } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react"


import UserContext from "./contexts/UserContext";
import GameContext from "./contexts/GameContext";


const theme = extendTheme({
  backgroundImage:"url('../public/images/background.png')"
})

const AppContextProvider = ({ children }) => {
    const [ user, updateUser ] = useState(null);
    const [ game, updateGame ] = useState(null);

  
    const values = {
        user,
        updateUser
    };

  return (
    <ChakraProvider theme={theme}>
      <UserContext.Provider value={{user, updateUser}}>
          <GameContext.Provider value={{game, updateGame}}>
              {children}
          </GameContext.Provider>
      </UserContext.Provider>
    </ChakraProvider>
  );
};

export default AppContextProvider;