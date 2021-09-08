import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import Home from './Home';
import GameRooms from "./components/GameRooms"
import GameLobby from "./components/GameLobby";
import Game from "./components/Game";
import AppContextProvider from "./AppContextProvider";
render(
    <AppContextProvider>
<BrowserRouter>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/games" component={GameRooms} />
        <Route exact path="/game/:code" component={GameLobby} />
        <Route exact path="/game/" component={Game} />
    </Switch>
</BrowserRouter>
</AppContextProvider>, document.getElementById('root'));