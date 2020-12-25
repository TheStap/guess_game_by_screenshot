import { Container } from "@material-ui/core";
import React from "react";
import './index.scss';

export default function StretchContainer({ children }: { children: any }) {
    return (
        <Container className="stretchContainer" maxWidth="md">
            {children}
        </Container>
    )
}