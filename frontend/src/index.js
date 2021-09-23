import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";

import AuthedRoute from './AuthedRoute';
import Home from './Home';
import Login from "./components/Login";
import Games from "./components/Games"
import GameLobby from "./components/GameLobby";
import Game from "./components/Game";
import AppContextProvider from "./AppContextProvider";
import "./index.scss"

render(
    <AppContextProvider>
<BrowserRouter>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <AuthedRoute exact path="/games" component={Games} />
        <AuthedRoute exact path="/game/:code" component={GameLobby} />
        <AuthedRoute exact path="/game" component={Game} />
    </Switch>
</BrowserRouter>
</AppContextProvider>, document.getElementById('root'));