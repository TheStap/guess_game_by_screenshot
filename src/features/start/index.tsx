import React from 'react';
import DifficultySelect from "../difficulty";
import { Container } from '@material-ui/core';

function StartScreen() {
    return (
        <Container fixed maxWidth="md">
            <h1>
                How good do you know videogames? <br/>
                Guess the videogame from the screenshot!
            </h1>
            <DifficultySelect/>
        </Container>
    )
}

export default StartScreen;