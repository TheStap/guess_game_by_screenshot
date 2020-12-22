import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  RootState } from '../../store';
import config from "../../config";
import { GameModel, GamesRequestParams } from "../../interfaces/Games";
import { FilterState, THIS_YEAR } from "../filter/slice";
import api from '../../common/api';
import { getRandomItemFromArray } from "../../common/utils";
import { FetchStatus } from '../../interfaces/common';

export enum Difficulty {
    Easy = 'easy',
    Medium = 'medium',
    Hardcore = 'hardcore'
}

interface GameState {
    videoGames: VideoGamesState;
    difficulty: Difficulty | null;
    answersCount: { correct: number, wrong: number };
    videoGameToAnswerId: number | null;
}

interface VideoGamesState {
    items: GameModel[];
    count: number | null;
    status: FetchStatus;
    error: string | null;
}

const initialState: GameState = {
    videoGames: {
        items: [],
        count: null,
        status: FetchStatus.Idle,
        error: null
    },
    difficulty: null,
    answersCount: {
        correct: 0,
        wrong: 0
    },
    videoGameToAnswerId: null
};

export const fetchVideoGames = createAsyncThunk(
    'game/fetchGames',
    async (increaseDifficulty, thunkApi) => {
        const store = thunkApi.getState() as RootState;
        const result = await api.getGames(buildGamesRequestParams(
            { ...store.filter.state }));
        return result.data
    })

function buildGamesRequestParams
({
     genre,
     yearFrom = config.earliestReleaseYearInBase,
     yearTo = THIS_YEAR,
     page = 1,
     pageSize = 6
 }: FilterState): GamesRequestParams {

    const PC_PLATFORM = '4';

    const params: GamesRequestParams = {
        page_size: pageSize,
        dates: `${yearFrom}-01-01,${yearTo}-12-31`,
        platforms: PC_PLATFORM,
        page
    };
    if (genre) params.genres = genre.id.toString();
    return params;
}

export const gameSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        incrementCorrectAnswersCount: state => {
            state.answersCount.correct++
        },
        incrementWrongAnswersCount: state => {
            state.answersCount.wrong++
        },
        setDifficulty: (state, { payload }: PayloadAction<Difficulty | null>) => {
            state.difficulty = payload;
        },
        clearVideoGameData: state => {
            state.videoGames.items = [];
            state.videoGames.count = null;
            state.videoGameToAnswerId = null;

        }
    },
    extraReducers: builder => {
        builder.addCase(fetchVideoGames.fulfilled, (state, { payload: { results, count } }) => {
            state.videoGames.status = FetchStatus.Finished;
            state.videoGames.items = results;
            state.videoGames.count = count;
            state.videoGameToAnswerId = getRandomItemFromArray(results).id;
        });

        builder.addCase(fetchVideoGames.pending, (state) => {
            state.videoGames.status = FetchStatus.Pending;
            state.videoGameToAnswerId = null;
            state.videoGames.items = [];
        });

        builder.addCase(fetchVideoGames.rejected, (state) => {
            state.videoGames.status = FetchStatus.Finished;
        });
    }
});

export const {
    incrementCorrectAnswersCount, incrementWrongAnswersCount, setDifficulty, clearVideoGameData
} = gameSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: RootState) => state.game.videoGameToAnswerId;

export default gameSlice.reducer;
