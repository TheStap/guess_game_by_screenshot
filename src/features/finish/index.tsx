import React, { useCallback, useMemo } from 'react';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import config from '../../config';
import { Button, Container } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { clearFilterState } from "../filter/slice";
import { clearState, Difficulty, fetchVideoGames, setDifficulty } from "../game/slice";

const { maxGamesToAnswer } = config;

export default function Finish() {
    const history = useHistory();
    const dispatch = useAppDispatch();

    const { correct } = useSelector((state: RootState) => state.game.answersCount);

    const message = useMemo(() => {
        const half = maxGamesToAnswer / 2;

        if (correct === maxGamesToAnswer) {
            return 'Wow you are true gamer!';
        } else if (correct > half) {
            return 'You are real gamer.';
        } else if (correct === half) {
            return 'You are average gamer.';
        } else if (correct < half) {
            return 'You don\'t often playing videogames.';
        }
    }, [correct])



    const playAgain = useCallback(() => {
        dispatch(clearState());
        dispatch(clearFilterState());
        dispatch(setDifficulty(Difficulty.Hardcore));
        dispatch(fetchVideoGames()).then(() => {
            history.push('/game');
        });
    }, [dispatch, history]);


    return (
        <Container maxWidth="md">
            <h1>{message}</h1>
            <h2>Games answered {correct} out of {maxGamesToAnswer}</h2>
            <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={playAgain}
            >
                Play again
            </Button>
        </Container>
    );
}