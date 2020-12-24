import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";



function DifficultyView() {
    const filter = useSelector((state: RootState) => state.filter);

    return (
        <h1>
            You are guessing {filter.genre?.name} videogames
            from {filter.yearFrom} to {filter.yearTo}
        </h1>
    )
}

export default DifficultyView;