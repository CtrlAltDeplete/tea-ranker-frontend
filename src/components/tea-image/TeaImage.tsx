import React, {FunctionComponent} from "react";

import teaImg0 from './tea-0.png';
import teaImg1 from './tea-1.png';
import teaImg2 from './tea-2.png';

export type TeaImageProps = {
    teaImage: string
    scaleX: number
    scaleY: number
}

export function RandomTeaImageProps(): TeaImageProps {
    let teaImage: string;
    switch (Math.floor(Math.random() * 3.0)) {
        case 0:
            teaImage = teaImg0;
            break;
        case 1:
            teaImage = teaImg1;
            break;
        default:
            teaImage = teaImg2;
            break;
    }

    let scaleX = 1;
    let scaleY = 1;
    if (Math.random() > 0.5) {
        scaleX = -1;
    }
    if (Math.random() > 0.5) {
        scaleY = -1;
    }

    return {
        teaImage: teaImage,
        scaleX: scaleX,
        scaleY: scaleY
    };
}

export const TeaImage: FunctionComponent<TeaImageProps> = (props: TeaImageProps): JSX.Element => {
    return <img src={props.teaImage} alt={"Tea"} style={{transform: `scaleX(${props.scaleX}) scaleY(${props.scaleY})`}}/>;
}