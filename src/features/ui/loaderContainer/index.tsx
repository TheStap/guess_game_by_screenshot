import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React from "react";
import './index.scss';

function Loader() {
    return (
        <Box className="loader">
            <CircularProgress/>
        </Box>
    )
}

export default function LoaderContainer({ children, isLoading }: LoaderContainerPropTypes) {
    return isLoading ? <Loader/> : <>{children}</>;

}

interface LoaderContainerPropTypes {
    children: any,
    isLoading: boolean
}
