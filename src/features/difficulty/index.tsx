import React, { useCallback, useEffect } from 'react';
import Button from "@material-ui/core/Button";
import { useHistory } from 'react-router-dom';
import { Difficulty, fetchVideoGames, setDifficulty } from '../game/slice';
import { RootState, useAppDispatch } from "../../store";
import { clearFilterState, } from '../filter/slice';
import { Box } from "@material-ui/core";
import './index.scss';
import { routes } from '../../routes';
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

function DifficultySelect() {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const error = useSelector((state: RootState) => state.game.videoGames.error);
    const { enqueueSnackbar } = useSnackbar();

    const goToHardcore = useCallback(() => {
        dispatch(clearFilterState());
        dispatch(setDifficulty(Difficulty.Hardcore));
        dispatch(fetchVideoGames()).then(() => {
            history.push(routes.game.path);
        })
    }, [dispatch, history]);

    // TODO: refactor to deal with multiple errors
    useEffect(() => {
        if (error) enqueueSnackbar(error, { variant: 'error' })
    }, [enqueueSnackbar, error])

    /*const goToMedium = useCallback(() => {
        dispatch(setDifficulty(Difficulty.Medium));
        // todo generate random values there
        dispatch(setFilterState(
            {
                yearFrom: 2000, yearTo: 2004,
                genre: { id: 4, name: 'Action' }, page: 1, pageSize: 6
            }))
        dispatch(fetchVideoGames()).then(() => {
            history.push('/game');
        })
    }, [dispatch, history]);*/


    return (
        <Box className="difficulty">
            {/*<h2 className="difficulty__heading">Select difficulty:</h2>*/}
            {/*<Button
                variant="outlined"
                size="large"
                color="primary"
            >
                Easy
            </Button>*/}
            {/*<Button
                variant="contained"
                size="large"
                color="primary"
                onClick={goToMedium}
            >
                Medium
            </Button>*/}
            {/*<Tooltip title="Guess from all existing games">*/}
            <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={goToHardcore}
            >
                Start
            </Button>
            {/*</Tooltip>*/}
        </Box>
    )
}

export default DifficultySelect;