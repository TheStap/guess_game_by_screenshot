import { RouteProps } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Redirect, Route } from "react-router-dom";
import React from "react";
import Start from "./features/start";
import Game from "./features/game";
import Finish from "./features/finish";

interface RouteConfig {
    path: string,
    component: () => JSX.Element,
    isPrivate?: boolean
}

interface RoutesDictionary {
    [key: string]: RouteConfig
}

export const routes: RoutesDictionary = {
    start: {
        path: '/',
        component: Start
    },
    game: {
        path: '/game',
        component: Game,
        isPrivate: true
    },
    finish: {
        path: '/finish',
        component: Finish,
        isPrivate: true
    }
};

export const routesAsArray = Object.values(routes);

export function ProtectedRoute({ children, ...rest }: RouteProps) {
    const game = useSelector((state: RootState) => state.game);


    return (
        <Route
            {...rest}
            render={({ location }) =>
                game.difficulty ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: routes.start.path,
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}