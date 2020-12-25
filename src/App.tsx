import React from 'react';
import './App.scss';
import Filter from "./features/filter";
import Game from "./features/game";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Start from './features/start';
import Finish from "./features/finish";


function App() {

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Start/>
                </Route>
                {/*<Route path="/filter">
                    <Filter genresList={genres}/>
                </Route>*/}
                <Route path="/game">
                    <Game/>
                </Route>
                <Route path="/finish">
                    <Finish/>
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
