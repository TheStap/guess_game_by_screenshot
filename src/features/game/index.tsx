import React, { useCallback, useMemo, useState } from 'react';
import { GameModel } from '../../interfaces/Games';
import { useDispatch, useSelector } from "react-redux";
import Box from '@material-ui/core/Box';
import './index.scss';
import { getFilterState,
    setFilterState,
    setFilterStateToMakeGameMoreDifficult
} from "../filter/slice";
import {
    fetchVideoGames, getGameState,
    incrementCorrectAnswersCount, incrementWrongAnswersCount, isVideoGamesLoading
} from "./slice";
import { useHistory } from "react-router-dom";
import config from "../../config";
import Answer from "./answer";
import { useSnackbar, VariantType } from 'notistack';
import LoaderContainer from "../ui/loaderContainer";
import StretchContainer from "../ui/stretchContainer";
import { routes } from '../../routes';

const { maxPageSize, maxGamesToAnswer } = config;

export default function Game() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const [imageLoaded, setImageLoaded] = useState(false);

    const game = useSelector(getGameState);

    const filter = useSelector(getFilterState);

    const loading = useSelector(isVideoGamesLoading);

    const screenshotClassName = useMemo(() => {
        return imageLoaded ? 'game__screenshot' : 'game__screenshot game__screenshot--hidden';
    }, [imageLoaded]);

    const { correct, wrong } = game.answersCount;

    const answersCount = useMemo(() => correct + wrong, [correct, wrong])

    const needToFinish = useMemo(() => answersCount === maxGamesToAnswer - 1, [answersCount])

    const showMessage = useCallback((message: string, variant: VariantType) => {
        if (!needToFinish) enqueueSnackbar(message, { variant })
    }, [enqueueSnackbar, needToFinish])

    const vote = useCallback((answer: GameModel) => {
        if (!answersCount) dispatch(setFilterState({ ...filter, pageSize: maxPageSize }));

        if (answer.id === game.videoGameToAnswerId) {
            showMessage('You are right!', 'success');
            dispatch(incrementCorrectAnswersCount());
            dispatch(setFilterStateToMakeGameMoreDifficult(
                { videogamesCount: game.videoGames.count, correctAnswersCount: correct }
            ));
        } else {
            showMessage('Nope', 'error');
            dispatch(incrementWrongAnswersCount());
            dispatch(setFilterState({ ...filter, page: filter.page + 1 }));
        }

        if (needToFinish) {
            history.push(routes.finish.path);
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
        needToFinish,
        history,
        showMessage
    ]);

    return (
        <StretchContainer>
            <Box className="game">
                {/*<DifficultyView/>*/}
                <h2 className="game__games-count">{answersCount + 1}/{maxGamesToAnswer}</h2>
                <LoaderContainer isLoading={loading || !imageLoaded}>
                    <Box className="game__answers">
                        {game.answers.map(a => <Answer key={a.id} model={a} onClick={vote}/>)}
                    </Box>
                </LoaderContainer>
                <Box>
                    <img onLoad={() => setImageLoaded(true)}
                         alt=""
                         className={screenshotClassName}
                         src={game.videoGameScreen}/>
                </Box>
            </Box>
        </StretchContainer>
    )
}