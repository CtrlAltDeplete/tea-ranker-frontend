import React, {FunctionComponent} from "react";

import './TeaListing.css';

import {Tea} from "../../services/types/Tea";

type TeaListingProp = {
    tea: Tea,
    teaImg: JSX.Element,
}

export const TeaListing: FunctionComponent<TeaListingProp> = (props: TeaListingProp): JSX.Element => {
    let tags: string[] | undefined = props.tea.expand?.tags?.map((tag) => tag.name);
    return (
        <li className={"tea-listing"}>
            <div className={"tea-img"}>
                {props.teaImg}
            </div>
            <div className={"tea-name"}><a href={`/tea/${props.tea.id}`}>{props.tea.name}</a></div>
            <div className={"tea-tags"}>{tags === undefined ? 'No Tags' : tags.join(', ')}</div>
        </li>
    );
}