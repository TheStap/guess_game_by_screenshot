import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import filterReducer from './features/filter/slice';
import gameReducer from './features/game/slice';
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        filter: filterReducer,
        game: gameReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;