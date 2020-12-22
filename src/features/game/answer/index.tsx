import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import { GameModel } from "../../../interfaces/Games";

const AnswerButton = withStyles({
    root: { marginRight: '10px', marginBottom: '10px' }
})(Button)

function Answer({ model, onClick }: { model: GameModel, onClick: Function}) {
    return (
        <AnswerButton
            key={model.id}
            onClick={() => onClick(model)}
            variant="outlined"
            size="large"
            color="primary"
        >
            {model.name}
        </AnswerButton>
    )
}

export default Answer