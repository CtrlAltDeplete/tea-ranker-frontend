import React, {FunctionComponent, useState, useEffect} from "react";

import {backend} from "../../config";
import {Match} from "../../services/types/Match";
import {MatchListing} from "./MatchListing";
import {ToastableProps} from "../toast/ToastableProps";

import "./Matches.css";

export const Matches: FunctionComponent<ToastableProps> = (props: ToastableProps): JSX.Element => {
    const [isLoaded, setLoaded] = useState(false);
    const [isSignedIn, setSignedIn] = useState(backend.signedIn());
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        backend.listMatches(true, true, false).then((matches: Match[]) => {
            setMatches(matches);
        }).catch((err) => {
            props.toastError(err);
        }).finally(() => {
            setLoaded(true);
        });

        return backend.onAuthChange(() => {
            setSignedIn(backend.signedIn());
        });
    }, [props]);

    if (!isSignedIn) {
        return (
            <section id={"matches"}>
                <header>
                    <h1>
                        Sign In to View Matches
                    </h1>
                </header>
            </section>
        );
    }

    if (!isLoaded) {
        return (
            <section id={"matches"}>
                <header>
                    <h1>
                        Matches
                    </h1>
                </header>
                <div className={"list-container"}>
                    <ul>
                        Loading...
                    </ul>
                </div>
            </section>
        );
    }

    return (
        <section id={"matches"}>
            <header>
                <h1>
                    Matches
                </h1>
            </header>
            <div className={"list-container"}>
                <ul>
                    {matches.map((match: Match) => {
                        return <MatchListing key={match.id} match={match}/>;
                    })}
                </ul>
            </div>
        </section>
    );
}