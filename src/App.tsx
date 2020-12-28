import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ProtectedRoute, routesAsArray } from './routes';


function App() {

    return (
        <Router>
            <Switch>
                {routesAsArray.map(({ component: C, isPrivate, ...rest }, i) => {
                    const ResultRoute = isPrivate ? ProtectedRoute : Route;
                    return <ResultRoute key={i} {...rest}><C/></ResultRoute>;
                })}
            </Switch>
        </Router>
    );
};

export default App;
