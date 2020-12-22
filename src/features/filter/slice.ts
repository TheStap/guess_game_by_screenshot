import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { SimpleGenre } from "../../interfaces/Genres";
import config from '../../config';
import api from "../../common/api";
import { Genre } from '../../interfaces/Games';
import { FetchStatus } from '../../interfaces/common';

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

export interface FilterCommonState {
    state: FilterState,
    additionalData: AdditionalDataState
}

const initialState: FilterCommonState = {
    state: {
        genre: null,
        yearFrom: config.earliestReleaseYearInBase,
        yearTo: THIS_YEAR,
        page: 1,
        pageSize: 6
    },
    additionalData: {
        genres: {
            items: [],
            status: FetchStatus.Idle,
            error: ''
        }
    }
};

export const fetchGenres = createAsyncThunk(
    'game/fetchGenres',
    async () => {
        const result = await api.getGenres();
        return result.data.results;
    })

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilterState: (state, action: PayloadAction<FilterState>) => {
            return { ...state, state: action.payload }
        },
        clearFilterState: state => {
            return { ...state, state: initialState.state}
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

export const { setFilterState, clearFilterState } = filterSlice.actions;

export const selectFilter = (state: RootState) => state.filter;

export default filterSlice.reducer;
