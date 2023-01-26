import React, {FunctionComponent} from "react";
import {GlobalRank} from "../../services/types/GlobalRank";
import {LocalRank} from "../../services/types/LocalRank";

import "./RankListing.css";

type RankListingProps = {
    rank: GlobalRank | LocalRank,
    index: number
}

export const RankListing: FunctionComponent<RankListingProps> = (props: RankListingProps): JSX.Element => {
    return (
        <li className={"rank-listing"}>
            <div className={"rank-index"}>{props.index + 1}.</div>
            <div className={"rank-tea-name"}>
                <a href={`/tea/${props.rank.expand?.tea?.id}`}>{props.rank.expand?.tea?.name}</a>
            </div>
            <div className={"rank"}>#{props.rank.rank}</div>
        </li>
    );
}