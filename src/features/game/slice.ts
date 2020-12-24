import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import config from "../../config";
import { GameModel, GamesRequestParams } from "../../interfaces/Games";
import { FilterState, THIS_YEAR } from "../filter/slice";
import api from '../../common/api';
import { getRandomIndexFromArray,
    getRandomItemFromArray, getRandomNumber } from "../../common/utils";
import { FetchStatus } from '../../interfaces/common';

const { maxAnswers } = config;

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
    answers: GameModel[];
    videoGameScreen: string;
}

interface VideoGamesState {
    items: GameModel[];
    count: number;
    status: FetchStatus;
    error: string;
}

const initialState: GameState = {
    videoGames: {
        items: [],
        count: 0,
        status: FetchStatus.Idle,
        error: ''
    },
    difficulty: null,
    answersCount: {
        correct: 0,
        wrong: 0
    },
    videoGameToAnswerId: null,
    answers: [],
    videoGameScreen: ''
};

const name = 'game';

export const fetchVideoGames = createAsyncThunk(
    `${name}/fetchGames`,
    async (_, thunkApi) => {
        const state = thunkApi.getState() as RootState;
        const result = await api.getGames(buildGamesRequestParams(
            { ...state.filter }));
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
    name,
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
        clearState: () => initialState
    },
    extraReducers: builder => {
        builder
            .addCase(fetchVideoGames.fulfilled, (state, { payload: { results, count } }) => {
                state.videoGames.status = FetchStatus.Finished;
                state.videoGames.items = results;
                state.videoGames.count = count;

                const game = getRandomItemFromArray(results);
                state.videoGameToAnswerId = game.id;

                const answers = getRandomGames(results, game);
                answers.splice(getRandomIndexFromArray(answers), 0, game);
                state.answers = answers;

                const screens = game.short_screenshots;
                // first screen is always poster
                state.videoGameScreen = screens[getRandomNumber(1, screens.length - 1)].image
            })
            .addCase(fetchVideoGames.pending, (state) => {
                state.videoGames.status = FetchStatus.Pending;
                state.videoGameToAnswerId = null;
                state.videoGames.items = [];
            })
            .addCase(fetchVideoGames.rejected, (state) => {
                state.videoGames.status = FetchStatus.Finished;
            });
    }
});

export const {
    incrementCorrectAnswersCount, incrementWrongAnswersCount, setDifficulty, clearState
} = gameSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: RootState) => state.game.videoGameToAnswerId;

export default gameSlice.reducer;
