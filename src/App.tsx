import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ProtectedRoute, routesAsArray } from './routes';


function App() {

    return (
        <Router>
            <Switch>
                {routesAsArray.map(({ component: C, path, isPrivate }) => {
                    const ResultRoute = isPrivate ? ProtectedRoute : Route;
                    return <ResultRoute path={path}><C/></ResultRoute>;
                })}
            </Switch>
        </Router>
    );
};

export default App;
