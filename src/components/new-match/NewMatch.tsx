import React, {FunctionComponent, useEffect, useState} from "react";

import {backend} from "../../config";
import {Tea} from "../../services/types/Tea";
import {TeaSelection} from "./TeaSelection";
import {ToastableProps} from "../toast/ToastableProps";

import "./NewMatch.css";

export const NewMatch: FunctionComponent<ToastableProps> = (props: ToastableProps): JSX.Element => {
    const [isLoaded, setLoaded] = useState(false);
    const [teas, setTeas] = useState<undefined | Tea[]>(undefined);
    const [winner, setWinner] = useState<undefined | Tea>(undefined);
    const [loser, setLoser] = useState<undefined | Tea>(undefined);

    useEffect(() => {
        backend.listTeas(false, false, false, false).then((teas: Tea[]) => {
            setTeas(teas);
        }).catch((err) => {
            props.toastError(err);
        }).finally(() => {
            setLoaded(true);
        });
    }, [props]);

    function handleSubmit() {
        const loserId = loser?.id;
        const winnerId = winner?.id;

        if (loserId === undefined || winnerId === undefined) {
            props.toastError(Error("Must choose two teas for winner and loser."));
            return;
        }

        if (loserId === winnerId) {
            props.toastError(Error("Must choose different teas for winner and loser."));
            return;
        }

        backend.createMatch(loserId, winnerId).then(() => {
            props.toastMessage("Submitted match!");
        }).catch((err) => {
            props.toastError(err);
        });
    }

    if (!isLoaded) {
        return <h1>Loading...</h1>
    }

    const canSubmit = winner !== undefined &&
        loser !== undefined &&
        winner !== loser;

    return (
        <div id={"new-match"}>
            <h1>New Match</h1>
            <div className={"tea-selection-section"}>
                <TeaSelection teas={teas}
                              selected={winner}
                              placeholder={"Select Winner..."}
                              selectionChangeCallback={setWinner}/>
                <div id={"vs"}>vs.</div>
                <TeaSelection teas={teas}
                              selected={loser}
                              placeholder={"Select Loser..."}
                              selectionChangeCallback={setLoser}/>
            </div>
            <div className={canSubmit ? "submit-link" : "submit-link disabled"}
                 onClick={canSubmit ? handleSubmit : () => {
                 }}>
                Submit
            </div>
        </div>
    );
}