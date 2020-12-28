import React from "react";
import { useSelector } from "react-redux";
import { getFilterState } from "../../filter/slice";



function DifficultyView() {
    const filter = useSelector(getFilterState);

    return (
        <h1>
            You are guessing {filter.genre?.name} videogames
            from {filter.yearFrom} to {filter.yearTo}
        </h1>
    )
}

export default DifficultyView;