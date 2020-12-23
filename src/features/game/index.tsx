import React, { useCallback, useMemo, useState } from 'react';
import { GameModel } from '../../interfaces/Games';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Box from '@material-ui/core/Box';
import {
    getRandomIndexFromArray,
    getRandomItemFromArray,
    getRandomNumber
} from '../../common/utils';
import './index.scss';
import { CircularProgress, Container } from "@material-ui/core";
import { setFilterState } from "../filter/slice";
import {
    clearState,
    fetchVideoGames, incrementCorrectAnswersCount, incrementWrongAnswersCount
} from "./slice";
import { FetchStatus } from '../../interfaces/common';
import { useHistory } from "react-router-dom";
import config from "../../config";
import Answer from "./answer";
import DifficultyView from "./difficulty";
import { useSnackbar } from 'notistack';

const { maxPageSize, maxGamesToAnswer, maxAnswers } = config;

export function getRandomGames(array: GameModel[], except: GameModel): GameModel[] {
    const size = maxAnswers - 1;
    if (!array.length) return [];
    if (array.length === size) return array;

    const result = new Set<GameModel>();
    while (result.size < size) {
        const item = getRandomItemFromArray(array);
        if (item.id === except.id) continue;
        result.add(item);
    }
    return Array.from(result);
}

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

    const videoGameToAnswer = useMemo(() => {
        const gameId = game.videoGameToAnswerId;
        return game.videoGames.items.find(({ id }) => id === gameId);
    }, [game.videoGameToAnswerId, game.videoGames.items]);

    const screenshotSource = useMemo(() => {
        if (!videoGameToAnswer) return;

        setImageLoaded(false);
        const screens = [...videoGameToAnswer.short_screenshots];
        // first screen is always poster
        screens.splice(0, 1);
        return getRandomItemFromArray(screens).image;
    }, [videoGameToAnswer]);

    const screenshotClassName = useMemo(() => {
        return imageLoaded ? 'game__screenshot' : 'game__screenshot game__screenshot--hidden';
    }, [imageLoaded])

    const answers = useMemo(() => {
        if (!videoGameToAnswer) return [];
        const gameAnswers = getRandomGames(game.videoGames.items, videoGameToAnswer);
        gameAnswers.splice(getRandomIndexFromArray(gameAnswers), 0, videoGameToAnswer);
        return gameAnswers;
    }, [game.videoGames.items, videoGameToAnswer]);

    const { correct, wrong } = game.answersCount;

    const answersCount = useMemo(() => correct + wrong, [correct, wrong])

    const needToRestart = useMemo(() => answersCount === maxGamesToAnswer, [correct, wrong])

    const restartGame = useCallback(() => {
        alert(`Game finished correct: ${correct} wrong: ${wrong}`);
        dispatch(clearState());
        history.push('/');
    }, [correct, dispatch, history, wrong])

    const getFormulaNumbers = useMemo(() => {
        let { count } = game.videoGames;

        // API can't show more than 10k games, bug reported, wait till fixed
        if (count > 1e4) count = 1e4;

        const gap = Math.floor(count / maxPageSize / maxGamesToAnswer);
        const gapStep = Math.floor(gap / maxGamesToAnswer) * (correct + 1);
        return { gap, gapStep }
    }, [correct, game.videoGames])

    const calculateNewFilter = useCallback((increaseDifficulty = false) => {
        const { page: currentPage } = filter.state;
        const { gap, gapStep } = getFormulaNumbers;
        
        const page = increaseDifficulty ?
            currentPage + getRandomNumber(gapStep, gap) : currentPage + 1;
        return { pageSize: maxPageSize, page }
    }, [filter.state, getFormulaNumbers])

    const vote = useCallback((answer: GameModel) => {
        if (!videoGameToAnswer) return;

        let newFilter;
        if (answer.id === videoGameToAnswer.id) {
            enqueueSnackbar('You are right!', { variant: "success" })
            dispatch(incrementCorrectAnswersCount());
            newFilter = { ...filter.state, ...calculateNewFilter(true) };
        } else {
            enqueueSnackbar('Nope', { variant: 'error' })
            dispatch(incrementWrongAnswersCount());
            newFilter = { ...filter.state, ...calculateNewFilter() };
        }

        if (needToRestart) {
            restartGame();
        } else {
            dispatch(setFilterState(newFilter));
            dispatch(fetchVideoGames());
        }
    }, [
        calculateNewFilter,
        dispatch,
        enqueueSnackbar, filter.state, needToRestart, restartGame, videoGameToAnswer]);

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
                        {answers.map(a => <Answer key={a.id} model={a} onClick={vote}/>)}
                    </Box>
                }
                <Box>
                    <img onLoad={() => setImageLoaded(true)}
                         alt=""
                         className={screenshotClassName}
                         src={screenshotSource}/>
                </Box>
            </Box>
        </Container>
    )
}

export default Game;