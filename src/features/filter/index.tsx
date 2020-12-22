import React, { useCallback, useMemo } from 'react';
import './index.scss';
import Button from '@material-ui/core/Button';
import { Box, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import { Autocomplete } from '@material-ui/lab';
import config from '../../config';
import { SimpleGenre } from '../../interfaces/Genres';
import { useDispatch } from "react-redux";
import { FilterState, setFilterState, THIS_YEAR } from './slice';
import { fetchVideoGames } from "../game/slice";

const yearsList = generateYears(config.earliestReleaseYearInBase, THIS_YEAR);

function generateYears(from: number, to: number): number[] {
    const result = [];
    for (let year = from; year <= to; ++year) result.push(year);
    return result;
}

function Filter({ genresList }: SearchFilterPropTypes) {
    const dispatch = useDispatch();

    const initialValues: FilterState = {
        yearFrom: yearsList[0],
        yearTo: yearsList[yearsList.length - 1],
        genre: null,
        page: 1,
        pageSize: 6
    };

    const {
        handleSubmit,
        handleChange, values: {
            genre, yearTo, yearFrom,
        },
    } = useFormik({
        initialValues,
        onSubmit: (values) => {
            dispatch(setFilterState(values));
            dispatch(fetchVideoGames());
        },
    });

    const yearsToList: number[] = useMemo(() => {
        return yearFrom ? [...yearsList].splice(yearsList.indexOf(yearFrom)) : yearsList
    }, [yearFrom]);

    const yearsFromList: number[] = useMemo(() => {
        if (yearTo) {
            const list = [...yearsList];
            list.splice(yearsList.indexOf(yearTo) + 1);
            return list;
        }
        return yearsToList;
    }, [yearTo, yearsToList]);

    const onAutocompleteChange = useCallback((id: string, value: any) => {
        return handleChange({ target: { value, id } })
    }, [handleChange]);

    return (
        <form onSubmit={handleSubmit} className="search-filter">
            <Autocomplete
                className="search-filter__genres"
                options={genresList}
                getOptionLabel={(option: SimpleGenre) => option.name}
                onChange={(_, v) => onAutocompleteChange('genre', v)}
                value={genre}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Genre"
                    />
                )}
            />
            <Box className="search-filter__years">
                <Autocomplete
                    className="search-filter__year"
                    options={yearsFromList}
                    getOptionLabel={(option: number) => option.toString()}
                    value={yearFrom}
                    onChange={(_, v) => onAutocompleteChange('yearFrom', v)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Release year (from)"
                        />
                    )}
                />
                <Autocomplete
                    className="search-filter__year"
                    options={yearsToList}
                    getOptionLabel={(option: number) => option.toString()}
                    value={yearTo}
                    onChange={(_, v) => onAutocompleteChange('yearTo', v)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Release year (to)"
                        />
                    )}
                />
            </Box>
            <Button
                variant="contained"
                color="primary"
                type="submit"
            >
                Find
            </Button>
        </form>
    );
}

interface SearchFilterPropTypes {
    genresList: SimpleGenre[]
}

export default Filter;
