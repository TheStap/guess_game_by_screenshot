import React, { useCallback, useMemo, useState } from 'react';
import { GameModel } from '../../interfaces/Games';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Box from '@material-ui/core/Box';
import './index.scss';
import { CircularProgress, Container } from "@material-ui/core";
import { setFilterState, setFilterStateToIncreaseGameDifficulty } from "../filter/slice";
import {
    clearState,
    fetchVideoGames, incrementCorrectAnswersCount, incrementWrongAnswersCount
} from "./slice";
import { FetchStatus } from '../../interfaces/common';
import { useHistory } from "react-router-dom";
import config from "../../config";
import Answer from "./answer";
import DifficultyView from "./difficulty";
import { useSnackbar, VariantType } from 'notistack';

const { maxPageSize, maxGamesToAnswer } = config;

function Game() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const [imageLoaded, setImageLoaded] = useState(false);

    const game = useSelector((state: RootState) => state.game);

    const filter = useSelector((state: RootState) => state.filter);

    const isLoading = useMemo(() => {
        return game.videoGames.status === FetchStatus.Pending || !imageLoaded;
    }, [game.videoGames.status, imageLoaded])

    const screenshotClassName = useMemo(() => {
        return imageLoaded ? 'game__screenshot' : 'game__screenshot game__screenshot--hidden';
    }, [imageLoaded]);

    const { correct, wrong } = game.answersCount;

    const answersCount = useMemo(() => correct + wrong, [correct, wrong])

    const needToRestart = useMemo(() => answersCount === maxGamesToAnswer, [answersCount])

    const showMessage = useCallback((message: string, variant: VariantType) => {
        if (!needToRestart) enqueueSnackbar(message, { variant })
    }, [enqueueSnackbar, needToRestart])

    const restartGame = useCallback(() => {
        alert(`Game finished correct: ${correct} wrong: ${wrong}`);
        dispatch(clearState());
        history.push('/');
    }, [correct, dispatch, history, wrong]);

    const vote = useCallback((answer: GameModel) => {
        if (!answersCount) dispatch(setFilterState({ ...filter, pageSize: maxPageSize }));

        if (answer.id === game.videoGameToAnswerId) {
            showMessage('You are right!', 'success');
            dispatch(incrementCorrectAnswersCount());
            dispatch(setFilterStateToIncreaseGameDifficulty(
                { videogamesCount: game.videoGames.count, correctAnswersCount: correct }
            ));
        } else {
            showMessage('Nope', 'error');
            dispatch(incrementWrongAnswersCount());
            dispatch(setFilterState({ ...filter, page: filter.page + 1 }));
        }

        if (needToRestart) {
            restartGame();
        } else {
            setImageLoaded(false);
            dispatch(fetchVideoGames());
        }
    }, [
        answersCount,
        correct,
        dispatch,
        filter,
        game.videoGameToAnswerId,
        game.videoGames.count,
        needToRestart,
        restartGame,
        showMessage
    ]);

    return (
        <Container className="game" maxWidth="md">
            <Box className="game__wrap">
                <DifficultyView/>
                <h2 className="game__games-count">{answersCount}/{maxGamesToAnswer}</h2>
                {isLoading ?
                    <Box className="game__loader-wrap">
                        <CircularProgress/>
                    </Box>
                    :
                    <Box className="game__answers">
                        {game.answers.map(a => <Answer key={a.id} model={a} onClick={vote}/>)}
                    </Box>
                }
                <Box>
                    <img onLoad={() => setImageLoaded(true)}
                         alt=""
                         className={screenshotClassName}
                         src={game.videoGameScreen}/>
                </Box>
            </Box>
        </Container>
    )
}

export default Game;