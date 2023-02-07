import React, {FunctionComponent} from "react";

import './TeaListing.css';

import {Tea} from "../../services/types/Tea";
import {TeaImage, TeaImageProps} from "../tea-image/TeaImage";

type TeaListingProp = {
    tea: Tea,
    teaImageProps: TeaImageProps,
}

export const TeaListing: FunctionComponent<TeaListingProp> = (props: TeaListingProp): JSX.Element => {
    let tags: string[] | undefined = props.tea.expand?.tags?.map((tag) => tag.name);
    return (
        <li className={"tea-listing"}>
            <div className={"tea-img"}>
                <TeaImage teaImage={props.teaImageProps.teaImage}
                          scaleX={props.teaImageProps.scaleX}
                          scaleY={props.teaImageProps.scaleY} />
            </div>
            <div className={"tea-name"}><a href={`/tea/${props.tea.id}`}>{props.tea.name}</a></div>
            <div className={"tea-tags"}>{tags === undefined ? 'No Tags' : tags.join(', ')}</div>
        </li>
    );
}