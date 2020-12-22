import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";



function DifficultyView() {
    const filter = useSelector((state: RootState) => state.filter);

    return (
        <h1>
            You are guessing {filter?.state?.genre?.name} videogames
            from {filter.state.yearFrom} to {filter.state.yearTo}
        </h1>
    )
}

export default DifficultyView;