import React, { useCallback } from 'react';
import Button from "@material-ui/core/Button";
import { useHistory } from 'react-router-dom';
import { Difficulty, fetchVideoGames, setDifficulty } from '../game/slice';
import { useAppDispatch } from "../../store";
import { setFilterStateToDefault, } from '../filter/slice';

function DifficultySelect() {
    const history = useHistory();
    const dispatch = useAppDispatch();

    const goToHardcore = useCallback(() => {
        dispatch(setFilterStateToDefault());
        dispatch(setDifficulty(Difficulty.Hardcore));
        dispatch(fetchVideoGames()).then(() => {
            history.push('/game');
        })
    }, [dispatch, history]);

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
        <>
            <h2>Select difficulty:</h2>
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
            <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={goToHardcore}
            >
                Hardcore
            </Button>
        </>
    )
}

export default DifficultySelect;