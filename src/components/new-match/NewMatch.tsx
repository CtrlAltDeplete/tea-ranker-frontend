import React, {Component} from "react";

import {backend} from "../../config";
import {Tea} from "../../services/types/Tea";
import {TeaSelection} from "./TeaSelection";
import {ToastableProps} from "../toast/ToastableProps";

import "./NewMatch.css";

type NewMatchState = {
    isLoaded: boolean
    teas?: Tea[]
    winner?: Tea
    loser?: Tea
}

export class NewMatch extends Component<ToastableProps, NewMatchState> {
    state: Readonly<NewMatchState> = {
        isLoaded: false,
        teas: undefined,
        winner: undefined,
        loser: undefined
    };

    componentDidMount() {
        backend.listTeas(false, false, false, false).then((teas: Tea[]) => {
            this.setState({
                isLoaded: true,
                teas: teas
            });
        }).catch((err) => {
            this.setState({
                isLoaded: true
            });

            this.props.toastError(err);
        });
    }

    handleWinnerChange = (tea?: Tea) => {
        this.setState({
            winner: tea
        });
    }

    handleLoserChange = (tea?: Tea) => {
        this.setState({
            loser: tea
        });
    }

    handleSubmit = () => {
        const loserId = this.state.loser?.id;
        const winnerId = this.state.winner?.id;

        if (loserId === undefined || winnerId === undefined) {
            this.props.toastError(Error("Must choose two teas for winner and loser."));
            return;
        }

        if (loserId === winnerId) {
            this.props.toastError(Error("Must choose different teas for winner and loser."));
            return;
        }

        backend.createMatch(loserId, winnerId).then(() => {
            this.props.toastMessage("Submitted match!");
        }).catch((err) => {
            this.props.toastError(err);
        });
    }

    render() {
        if (!this.state.isLoaded) {
            return <h1>Loading...</h1>
        }

        const canSubmit = this.state.winner !== undefined &&
            this.state.loser !== undefined &&
            this.state.winner !== this.state.loser;

        return (
            <div id={"new-match"}>
                <h1>New Match</h1>
                <div className={"tea-selection-section"}>
                    <TeaSelection teas={this.state.teas}
                                  selected={this.state.winner}
                                  placeholder={"Select Winner..."}
                                  selectionChangeCallback={this.handleWinnerChange}/>
                    <div id={"vs"}>vs.</div>
                    <TeaSelection teas={this.state.teas}
                                  selected={this.state.loser}
                                  placeholder={"Select Loser..."}
                                  selectionChangeCallback={this.handleLoserChange}/>
                </div>
                <div className={canSubmit ? "submit-link" : "submit-link disabled"} onClick={canSubmit ? this.handleSubmit : () => {}}>
                    Submit
                </div>
            </div>
        );
    }
}