import React, {FunctionComponent} from "react";

import teaImg0 from './tea-0.png';
import teaImg1 from './tea-1.png';
import teaImg2 from './tea-2.png';

export const TeaImage: FunctionComponent = (): JSX.Element => {
    let teaImg: string;
    switch (Math.floor(Math.random() * 3.0)) {
        case 0:
            teaImg = teaImg0;
            break;
        case 1:
            teaImg = teaImg1;
            break;
        default:
            teaImg = teaImg2;
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

    return <img src={teaImg} alt={"Tea"} style={{transform: `scaleX(${scaleX}) scaleY(${scaleY})`}}/>;
}