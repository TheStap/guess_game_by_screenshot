import React, { useCallback, useMemo, useState } from 'react';
import { GameModel } from '../../interfaces/Games';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "@material-ui/core/Button";
import Box from '@material-ui/core/Box';
import { getRandomIndexFromArray, getRandomItemFromArray } from '../../common/utils';
import './index.scss';
import { CircularProgress, withStyles } from "@material-ui/core";
import { setFilterState } from "../filter/slice";
import {
    fetchVideoGames,
    incrementCorrectAnswersCount, incrementWrongAnswersCount, setDifficulty, clearVideoGameData
} from "./slice";
import { FetchStatus } from '../../interfaces/common';
import { useHistory } from "react-router-dom";
import config from "../../config";

const { maxPageSize, maxGamesToAnswer, maxAnswers } = config;

function randomNumber(min: number, max: number): number {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

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
    const page = increaseDifficulty ? currentPage + randomNumber(2, gap) : currentPage + 1;
    return { pageSize, page }
}


function getRandomItemsFromArray<T>(array: T[], except: T, howMuch = maxAnswers - 1): T[] {
    if (!array.length) return [];
    if (array.length === howMuch) return array;

    const result = new Set<T>();
    while (result.size < howMuch) {
        const item = getRandomItemFromArray(array);
        if (item === except) continue;
        result.add(item);
    }
    return Array.from(result);
}

const AnswerButton = withStyles({
    root: { marginRight: '10px' }
})(Button)

function Game() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [imageLoaded, setImageLoaded] = useState(false);

    const game = useSelector((state: RootState) => state.game);

    const filter = useSelector((state: RootState) => state.filter);

    const videoGameToAnswer = useMemo(() => {
        const gameId = game.videoGameToAnswerId;
        return game.videoGames.items.find(({ id }) => id === gameId);
    }, [game.videoGameToAnswerId, game.videoGames.items]);

    const screenshotSource = useMemo(() => {
        if (!videoGameToAnswer) return;

        setImageLoaded(false);
        return getRandomItemFromArray(videoGameToAnswer.short_screenshots).image;
    }, [videoGameToAnswer])

    const answers = useMemo(() => {
        if (!videoGameToAnswer) return [];
        const gameAnswers = getRandomItemsFromArray(game.videoGames.items, videoGameToAnswer);
        gameAnswers.splice(getRandomIndexFromArray(gameAnswers), 0, videoGameToAnswer);
        return gameAnswers;
    }, [game.videoGames.items, videoGameToAnswer]);

    const vote = useCallback((answer: GameModel) => {
        if (!videoGameToAnswer) return;

        if (answer.id === videoGameToAnswer.id) {
            dispatch(incrementCorrectAnswersCount());
            const newFilter = {
                ...filter.state,
                ...calculateNewFilter(game.videoGames.count!, filter.state.page, true)
            }
            dispatch(setFilterState(newFilter));
            dispatch(fetchVideoGames());
        } else {
            dispatch(incrementWrongAnswersCount());
            const newFilter = {
                ...filter.state, ...calculateNewFilter(game.videoGames.count!, filter.state.page)
            }
            dispatch(setFilterState(newFilter));
            dispatch(fetchVideoGames());
        }
        if (game.answersCount.correct + game.answersCount.wrong === 2) {
            alert(`Game finished correct: ${game.answersCount.correct}
             wrong: ${game.answersCount.wrong}`);
            dispatch(setDifficulty(null));
            dispatch(clearVideoGameData())
            history.push('/');
        }
    }, [
        dispatch, filter.state,
        game.answersCount.correct, game.answersCount.wrong,
        game.videoGames.count, videoGameToAnswer, history]);


    if (!videoGameToAnswer) return null;

    return (
        <Box className="game">
            <h1 className="game__difficulty">
                You are now guessing
                {filter?.state?.genre?.name}
                videogames from {filter.state.yearFrom} to {filter.state.yearTo}
            </h1>
            {game.videoGames.status === FetchStatus.Pending || !imageLoaded ?
                <Box className="game__loader-wrap">
                    <CircularProgress/>
                </Box>
                : <Box className="game__answers">
                    {answers.map(answer => {
                        return (
                            <AnswerButton
                                key={answer.id}
                                onClick={() => vote(answer)}
                                variant="outlined"
                                size="large"
                                color={answer.id === videoGameToAnswer.id ? "secondary" : "primary"}
                            >
                                {answer.name}
                            </AnswerButton>
                        )
                    })}
                </Box>}
            <img style={imageLoaded ? {} : { display: 'none' }}
                 onLoad={() => {
                     console.log('loaded')
                     setImageLoaded(true)
                 }} className="game__screenshot" alt="screenshot"
                 src={screenshotSource}/>
        </Box>
    )
}

export default Game;