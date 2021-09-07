import React, { useState } from 'react';
import GameRooms from "./components/GameRooms";
import Login from "./components/Login";
import UserContext from "./contexts/UserContext"
import "./Home.scss"
import socket from "./socket";
const Home = () => {
    // const { artist, setArtist } = useState(null);
    const [ user, updateUser ] = useState(null);
    socket.connect();

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            <div className="home">
                <h3 className="title">Imposter Artist</h3>
                {renderComponent(user)}
            </div>
        </UserContext.Provider>
    );
};

const renderComponent = (user) => {
    console.log(user)
    return (
        <div>
            {!!user ? <GameRooms /> : <Login />}
        </div>
    );
}

export default Home;