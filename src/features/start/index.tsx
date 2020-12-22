import React from 'react';
import DifficultySelect from "../difficulty";

function StartScreen() {
    return (
        <>
            <h1>How good do you know videogames? Guess the videogame from the screenshot!</h1>
            <DifficultySelect/>
        </>
    )
}

export default StartScreen;