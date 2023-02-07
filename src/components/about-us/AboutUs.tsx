import React, {FunctionComponent, useState, useEffect} from 'react';

import {backend} from "../../config";
import {Tea} from "../../services/types/Tea";
import {ToastableProps} from "../toast/ToastableProps";

import './AboutUs.css';
import carissaImg from './carissa.png';
import gavynImg from './gavyn.png';
import kenzieImg from './kenzie.png';

export const AboutUs: FunctionComponent<ToastableProps> = (props: ToastableProps): JSX.Element => {
    const [isLoaded, setLoaded] = useState(false);
    const [gavynTea, setGavynTea] = useState<undefined | Tea>(undefined);
    const [carissaTea, setCarissaTea] = useState<undefined | Tea>(undefined);
    const [kenzieTea, setKenzieTea] = useState<undefined | Tea>(undefined);

    useEffect(() => {
        backend.founderFavoriteTeas().then((teas) => {
            if (teas.length !== 3) {
                setLoaded(true);
                props.toastError(Error(`Expected 3 teas for founders, got ${teas.length}`));
                return;
            }

            setGavynTea(teas[0]);
            setCarissaTea(teas[1]);
            setKenzieTea(teas[2]);
            setLoaded(true);
        }).catch((err) => {
            setLoaded(true);
            props.toastError(err);
        });
    }, [props]);

    if (isLoaded) {
        return (
            <div className={"about-us"}>
                <div className={"founder-card"}>
                    <img className={"founder-img"} src={gavynImg} alt={"Gavyn Partlow"}/>
                    <div className={"founder-name"}>
                        <a href={"https://www.instagram.com/gavynpartlow/"}>Gavyn Partlow</a>
                    </div>
                    <div className={"founder-bio"}>
                        is a software engineer. His current favorite tea is <a
                        href={`/tea/${gavynTea?.id}`}>{gavynTea?.name}</a>.
                    </div>
                </div>
                <div className={"founder-card"}>
                    <img className={"founder-img"} src={carissaImg} alt={"Carissa Gooding"}/>
                    <div className={"founder-name"}>
                        <a href={"https://www.instagram.com/onmydeathbread/"}>Carissa Gooding</a>
                    </div>
                    <div className={"founder-bio"}>
                        is a ___________. Her current favorite tea is <a
                        href={`/tea/${carissaTea?.id}`}>{carissaTea?.name}</a>.
                    </div>
                </div>
                <div className={"founder-card"}>
                    <img className={"founder-img"} src={kenzieImg} alt={"Mickenzie Willars"}/>
                    <div className={"founder-name"}>
                        <a href={"https://www.instagram.com/kenzo.png/"}>Mickenzie Willars</a>
                    </div>
                    <div className={"founder-bio"}>
                        is a graphic designer. Her current favorite tea is <a
                        href={`/tea/${kenzieTea?.id}`}>{kenzieTea?.name}</a>.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id={"founder-row"}>
            <div className={"founder-card"}>
                <img className={"founder-img"} src={gavynImg} alt={"Gavyn Partlow"}/>
                <div className={"founder-name"}>
                    <a href={"https://www.instagram.com/gavynpartlow/"}>Gavyn Partlow</a>
                </div>
                <div className={"founder-bio"}>
                    is a software engineer. His current favorite tea is <a
                    href={`/tea/#`}>[LOADING]</a>.
                </div>
            </div>
            <div className={"founder-card"}>
                <img className={"founder-img"} src={carissaImg} alt={"Carissa Gooding"}/>
                <div className={"founder-name"}>
                    <a href={"https://www.instagram.com/onmydeathbread/"}>Carissa Gooding</a>
                </div>
                <div className={"founder-bio"}>
                    is a ___________. Her current favorite tea is <a
                    href={`/tea/#`}>[LOADING]</a>.
                </div>
            </div>
            <div className={"founder-card"}>
                <img className={"founder-img"} src={kenzieImg} alt={"Mickenzie Willars"}/>
                <div className={"founder-name"}>
                    <a href={"https://www.instagram.com/kenzo.png/"}>Mickenzie Willars</a>
                </div>
                <div className={"founder-bio"}>
                    is a graphic designer. Her current favorite tea is <a
                    href={`/tea/#`}>[LOADING]</a>.
                </div>
            </div>
        </div>
    );
}