import React, {Component} from "react";

import {backend} from "../../config";
import {ToastableProps} from "../toast/ToastableProps";
import {Match} from "../../services/types/Match";
import {MatchListing} from "./MatchListing";

import "./Matches.css";

type MatchesState = {
    signedIn: boolean
    isLoaded: boolean
    matches: Match[]
}

export default class Matches extends Component<ToastableProps, MatchesState> {
    state: Readonly<MatchesState> = {
        signedIn: backend.signedIn(),
        isLoaded: false,
        matches: []
    };

    authListener: undefined | (() => void) = undefined;

    componentDidMount() {
        backend.listMatches(true, true, false).then((matches: Match[]) => {
            this.setState({
                matches: matches,
                isLoaded: true,
                signedIn: backend.signedIn()
            });
        }).catch((err) => {
            this.props.toastError(err);
        });

        this.authListener = backend.onAuthChange(() => {
            this.setState({
                signedIn: backend.signedIn()
            });
        });
    }

    render() {
        return (
            <section id={"matches"}>
                <header>
                    <h1>
                        Matches
                    </h1>
                </header>
                <div className={"list-container"}>
                    <ul>
                        {this.state.matches.map((match: Match) => {
                            return <MatchListing match={match}/>;
                        })}
                    </ul>
                </div>
            </section>
        );
    }
}