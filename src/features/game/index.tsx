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

function calculateNewFilter(totalGames: number, currentPage: number, increaseDifficulty = false) {
    let gap: number;
    let pageSize: number;
    const minimumGap = 3;
    // API can't show more than 10k games, bug reported, wait till fixed
    if (totalGames > 1e4) totalGames = 1e4;
    if (totalGames / maxPageSize >= maxGamesToAnswer * minimumGap) {
        pageSize = maxPageSize;
        gap = Math.floor(totalGames / maxPageSize / maxGamesToAnswer);
    } else {
        // TODO: think about this case after adding new difficulty
        // if (totalGames / maxGamesToAnswer < maxAnswers)
        pageSize = totalGames / maxGamesToAnswer;
        gap = 1;
    }
    const page = increaseDifficulty ? currentPage + getRandomNumber(2, gap) : currentPage + 1;
    return { pageSize, page }
}

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

    const needToRestart = useMemo(() => correct + wrong === maxGamesToAnswer, [correct, wrong])

    const restartGame = useCallback(() => {
        alert(`Game finished correct: ${correct} wrong: ${wrong}`);
        dispatch(clearState());
        history.push('/');
    }, [correct, dispatch, history, wrong])

    const vote = useCallback((answer: GameModel) => {
        if (!videoGameToAnswer) return;

        const calculateFilter = calculateNewFilter
            .bind(null, game.videoGames.count!, filter.state.page)

        let newFilter;
        if (answer.id === videoGameToAnswer.id) {
            enqueueSnackbar('You are right!', { variant: "success" })
            dispatch(incrementCorrectAnswersCount());
            newFilter = { ...filter.state, ...calculateFilter(true) };
        } else {
            enqueueSnackbar('Nope', { variant: 'error' })
            dispatch(incrementWrongAnswersCount());
            newFilter = { ...filter.state, ...calculateFilter() };
        }

        if (needToRestart) {
            restartGame();
        } else {
            dispatch(setFilterState(newFilter));
            dispatch(fetchVideoGames());
        }
    }, [dispatch,
        enqueueSnackbar,
        filter.state,
        game.videoGames.count,
        needToRestart,
        restartGame,
        videoGameToAnswer
    ]);

    return (
        <Container className="game" maxWidth="md">
            <Box className="game__wrap">
                <DifficultyView/>
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