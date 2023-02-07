import React, {FunctionComponent} from "react";

import {Match} from "../../services/types/Match";

import "./MatchListing.css";

export const MatchListing: FunctionComponent<{ match: Match }> = (props: { match: Match }): JSX.Element => {
    const date = new Date(props.match.date);
    return (
        <li className={"match-listing"}>
            <div className={"match-date"}>{`${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`}</div>
            <div className={"match-tea-name"}>
                <a href={`/tea/${props.match.expand?.winner?.id}`}>{props.match.expand?.winner?.name}</a> vs <a href={`/tea/${props.match.expand?.loser?.id}`}>{props.match.expand?.loser?.name}</a>
            </div>
        </li>
    );
}