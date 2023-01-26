import React, {Component} from 'react';

import {backend} from "../../config";
import {Tea} from "../../services/types/Tea";
import {ToastableProps} from "../toast/ToastableProps";

import './AboutUs.css';
import carissaImg from './carissa.png';
import gavynImg from './gavyn.png';
import kenzieImg from './kenzie.png';

type AboutUsState = {
    isLoaded: boolean
    gavynTea?: Tea,
    carissaTea?: Tea,
    kenzieTea?: Tea,
}

export default class AboutUs extends Component<ToastableProps, AboutUsState> {
    state: Readonly<AboutUsState> = {
        isLoaded: false,
        gavynTea: undefined,
        carissaTea: undefined,
        kenzieTea: undefined,
    };

    componentDidMount() {
        backend.founderFavoriteTeas().then((teas) => {
            if (teas.length !== 3) {
                this.setState({
                    isLoaded: true,
                });
                this.props.toastError(Error(`Expected 3 teas for founders, got ${teas.length}`));
                return;
            }

            this.setState({
                isLoaded: true,
                gavynTea: teas[0],
                carissaTea: teas[1],
                kenzieTea: teas[2]
            });
        }).catch((err) => {
            this.setState({
                isLoaded: true
            });
            this.props.toastError(err);
        });
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <div className={"about-us"}>
                    <div className={"founder-card"}>
                        <img className={"founder-img"} src={gavynImg} alt={"Gavyn Partlow"}/>
                        <div className={"founder-name"}>
                            <a href={"https://www.instagram.com/gavynpartlow/"}>Gavyn Partlow</a>
                        </div>
                        <div className={"founder-bio"}>
                            is a software engineer. His current favorite tea is <a
                            href={`/tea/${this.state.gavynTea?.id}`}>{this.state.gavynTea?.name}</a>.
                        </div>
                    </div>
                    <div className={"founder-card"}>
                        <img className={"founder-img"} src={carissaImg} alt={"Carissa Gooding"}/>
                        <div className={"founder-name"}>
                            <a href={"https://www.instagram.com/onmydeathbread/"}>Carissa Gooding</a>
                        </div>
                        <div className={"founder-bio"}>
                            is a ___________. Her current favorite tea is <a
                            href={`/tea/${this.state.carissaTea?.id}`}>{this.state.carissaTea?.name}</a>.
                        </div>
                    </div>
                    <div className={"founder-card"}>
                        <img className={"founder-img"} src={kenzieImg} alt={"Mickenzie Willars"}/>
                        <div className={"founder-name"}>
                            <a href={"https://www.instagram.com/kenzo.png/"}>Mickenzie Willars</a>
                        </div>
                        <div className={"founder-bio"}>
                            is a graphic designer. Her current favorite tea is <a
                            href={`/tea/${this.state.kenzieTea?.id}`}>{this.state.kenzieTea?.name}</a>.
                        </div>
                    </div>
                </div>
            );
        } else {
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
    }
};