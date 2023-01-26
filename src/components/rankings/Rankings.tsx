import React, {ChangeEvent, Component} from "react";

import {backend} from "../../config";
import {ToastableProps} from "../toast/ToastableProps";
import {LocalRank} from "../../services/types/LocalRank";
import {GlobalRank} from "../../services/types/GlobalRank";

import "./Rankings.css";
import {RankListing} from "./RankListing";

type RankingsState = {
    signedIn: boolean
    localLoaded: boolean
    globalLoaded: boolean
    localRanks: LocalRank[]
    globalRanks: GlobalRank[]
    showGlobal: boolean
}

export default class Rankings extends Component<ToastableProps, RankingsState> {
    state: Readonly<RankingsState> = {
        signedIn: backend.signedIn(),
        localLoaded: false,
        globalLoaded: false,
        localRanks: [],
        globalRanks: [],
        showGlobal: true
    };

    authListener: undefined | (() => void) = undefined;

    componentDidMount() {
        backend.listGlobalRanks(true).then((globalRanks: GlobalRank[]) => {
            this.setState({
                globalRanks: globalRanks,
                globalLoaded: true
            });
        }).catch((err) => {
            this.props.toastError(err);
        });

        if (backend.signedIn()) {
            backend.listLocalRanks(true, false).then((localRanks: LocalRank[]) => {
                this.setState({
                    localRanks: localRanks,
                    localLoaded: true
                });
            }).catch((err) => {
                this.props.toastError(err);
            });
        }

        this.authListener = backend.onAuthChange(() => {
            this.setState({
                localLoaded: false,
                signedIn: backend.signedIn(),
                showGlobal: true
            });

            if (this.state.signedIn) {
                backend.listLocalRanks(true, false).then((localRanks: LocalRank[]) => {
                    this.setState({
                        localRanks: localRanks,
                        localLoaded: true
                    });
                }).catch((err) => {
                    this.props.toastError(err);
                });
            } else {
                this.setState({
                    localRanks: [],
                    localLoaded: true
                });
            }
        });
    }

    handleRankingTypeChange = () => {
        this.setState({
            showGlobal: !this.state.showGlobal
        });
    }

    render() {
        let rankings: GlobalRank[] | LocalRank[] = [];
        if (this.state.showGlobal && this.state.globalLoaded) {
            rankings = this.state.globalRanks;
        } else if (!this.state.showGlobal && this.state.localLoaded) {
            rankings = this.state.localRanks;
        }

        return (
            <section id={"rankings"}>
                <header>
                    <h1>
                        <span className={"rank-type"}>{this.state.showGlobal ? "Global" : "Personal"}</span> Ranking
                    </h1>
                    <label className="switch">
                        <input type="checkbox" onChange={this.handleRankingTypeChange} checked={!this.state.showGlobal}
                               disabled={!this.state.signedIn}/>
                        <span className="slider round"></span>
                    </label>
                </header>
                <div className={"list-container"}>
                    <ul>
                        {rankings.map((rank: GlobalRank | LocalRank, index: number) => {
                            return <RankListing rank={rank} index={index}/>;
                        })}
                    </ul>
                </div>
            </section>
        );
    }
}