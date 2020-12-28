import React from 'react';
import DifficultySelect from "../difficulty";
import { useSelector } from "react-redux";
import StretchContainer from "../ui/stretchContainer";
import { isVideoGamesLoading } from '../game/slice';
import LoaderContainer from '../ui/loaderContainer';

function Start() {
    const loading = useSelector(isVideoGamesLoading);

    return (
        <StretchContainer>
            <LoaderContainer isLoading={loading}>
                <h1>
                    How good do you know videogames? <br/>
                    Guess the videogame from the screenshot!
                </h1>
                <DifficultySelect/>
            </LoaderContainer>
        </StretchContainer>
    )
}

export default Start;