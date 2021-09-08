import React, { createContext, useEffect, useState } from "react";
import UserContext from "./contexts/UserContext";
import GameContext from "./contexts/GameContext";


const AppContextProvider = ({ children }) => {
    const [ user, updateUser ] = useState(null);
    const [ game, updateGame ] = useState(null);

  
    const values = {
        user,
        updateUser
    };

  return (
    <UserContext.Provider value={{user, updateUser}}>
        <GameContext.Provider value={{game, updateGame}}>
            {children}
        </GameContext.Provider>
    </UserContext.Provider>
  );
};

export default AppContextProvider;