import React, {FunctionComponent, useState, useEffect} from "react";

import {backend} from "../../config";
import {GlobalRank} from "../../services/types/GlobalRank";
import {LocalRank} from "../../services/types/LocalRank";
import {RankListing} from "./RankListing";
import {ToastableProps} from "../toast/ToastableProps";

import "./Rankings.css";

export const Rankings: FunctionComponent<ToastableProps> = (props: ToastableProps): JSX.Element => {
    const [isSignedIn, setSignedIn] = useState(backend.signedIn());
    const [isLocalLoaded, setLocalLoaded] = useState(false);
    const [isGlobalLoaded, setGlobalLoaded] = useState(false);
    const [localRanks, setLocalRanks] = useState<LocalRank[]>([]);
    const [globalRanks, setGlobalRanks] = useState<GlobalRank[]>([]);
    const [showGlobal, setShowGlobal] = useState(true);

    useEffect(() => {
        if (!isGlobalLoaded) {
            backend.listGlobalRanks(true).then((globalRanks: GlobalRank[]) => {
                setGlobalRanks(globalRanks);
            }).catch((err) => {
                props.toastError(err);
            }).finally(() => {
                setGlobalLoaded(true);
            });
        }

        if (isSignedIn && !isLocalLoaded) {
            backend.listLocalRanks(true, false).then((localRanks: LocalRank[]) => {
                setLocalRanks(localRanks);
            }).catch((err) => {
                props.toastError(err);
            }).finally(() => {
                setLocalLoaded(true);
            });
        }

        if (!isSignedIn && !showGlobal) {
            setShowGlobal(true);
        }

        return backend.onAuthChange(() => {
            setSignedIn(backend.signedIn());
        });
    }, [props, isSignedIn, isGlobalLoaded, isLocalLoaded, showGlobal]);

    let rankings: GlobalRank[] | LocalRank[] = [];
    if (showGlobal && isGlobalLoaded) {
        rankings = globalRanks;
    } else if (!showGlobal && isLocalLoaded) {
        rankings = localRanks;
    }

    return (
        <section id={"rankings"}>
            <header>
                <h1>
                    <span className={"rank-type"}>{showGlobal ? "Global" : "Personal"}</span> Ranking
                </h1>
                <label className="switch">
                    <input type="checkbox" onChange={() => setShowGlobal(!showGlobal)} checked={!showGlobal}
                           disabled={!isSignedIn}/>
                    <span className="slider round"></span>
                </label>
            </header>
            <div className={"list-container"}>
                <ul>
                    {rankings.map((rank: GlobalRank | LocalRank, index: number) => {
                        return <RankListing key={index} rank={rank} index={index}/>;
                    })}
                </ul>
            </div>
        </section>
    );
}