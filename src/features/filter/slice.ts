import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { SimpleGenre } from "../../interfaces/Genres";
import config from '../../config';
import api from "../../common/api";
import { Genre } from '../../interfaces/Games';
import { FetchStatus } from '../../interfaces/common';
import { getRandomNumber } from "../../common/utils";

const { maxPageSize, maxGamesToAnswer, maxAnswers } = config;

export const THIS_YEAR = new Date().getFullYear();

export interface GenresState {
    items: Genre[],
    status: FetchStatus,
    error: string
}

export interface FilterState {
    genre: SimpleGenre | null,
    yearFrom: number | null,
    yearTo: number | null,
    page: number,
    pageSize: number,
}

export interface AdditionalDataState {
    genres: GenresState
}

type CommonFilterState = FilterState & { additionalData: AdditionalDataState }

const initialState: CommonFilterState = {
    genre: null,
    yearFrom: config.earliestReleaseYearInBase,
    yearTo: THIS_YEAR,
    page: 1,
    pageSize: maxAnswers,
    additionalData: {
        genres: {
            items: [],
            status: FetchStatus.Idle,
            error: ''
        }
    }
};

const name = 'filter';

export const fetchGenres = createAsyncThunk(
    `${name}/fetchGenres`,
    async () => {
        const result = await api.getGenres();
        return result.data.results;
    })

export const filterSlice = createSlice({
    name,
    initialState,
    reducers: {
        setFilterState: (state, action: PayloadAction<FilterState>) => {
            return { ...state, ...action.payload }
        },
        clearFilterState: state => {
            const filterInitialState = { ...initialState };
            delete filterInitialState.additionalData;
            return { ...state, ...filterInitialState };
        },
        setFilterStateToIncreaseGameDifficulty: (
            state,
            action: PayloadAction<{ videogamesCount: number, correctAnswersCount: number }>) => {
            let { videogamesCount, correctAnswersCount } = action.payload;

            // API can't show more than 10k games, bug reported, wait till fixed
            if (videogamesCount > 1e4) videogamesCount = 1e4;

            const gap = Math.floor(videogamesCount / maxPageSize / maxGamesToAnswer);
            const gapStep = Math.floor(gap / maxGamesToAnswer) * (correctAnswersCount + 1);

            state.page = state.page + getRandomNumber(gapStep, gap);
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchGenres.fulfilled, (state, { payload }) => {
            state.additionalData.genres.status = FetchStatus.Finished;
            state.additionalData.genres.items = payload;
        });

        builder.addCase(fetchGenres.pending, (state) => {
            state.additionalData.genres.status = FetchStatus.Pending;
        });

        builder.addCase(fetchGenres.rejected, (state) => {
            state.additionalData.genres.status = FetchStatus.Finished;
        })
    }

});

export const {
    setFilterState, clearFilterState,
    setFilterStateToIncreaseGameDifficulty
} = filterSlice.actions;

export const selectFilter = (state: RootState) => state.filter;

export default filterSlice.reducer;
