import React, {Component, FunctionComponent} from "react";
import {useParams} from "react-router-dom";
import {backend} from "../../config";

import {Tea} from "../../services/types/Tea";

import './TeaSpotlight.css';

import teaImg0 from '../tea-image/tea-0.png';
import teaImg1 from '../tea-image/tea-1.png';
import teaImg2 from '../tea-image/tea-2.png';
import TeaNotes from "./TeaNotes";
import {ToastableProps} from "../toast/ToastableProps";

type TeaSpotlightProps = {
    id?: string
    toastableProps: ToastableProps
}

type TeaSpotlightState = {
    isLoaded: boolean
    id: string
    tea?: Tea
    teaImg: string
    scaleX: number
    scaleY: number
    signedIn: boolean
}

class TeaSpotlightClass extends Component<TeaSpotlightProps, TeaSpotlightState> {
    state: Readonly<TeaSpotlightState> = {
        isLoaded: false,
        id: "",
        tea: undefined,
        teaImg: teaImg0,
        scaleX: 1,
        scaleY: 1,
        signedIn: backend.signedIn()
    };

    authListener: undefined | (() => void) = undefined;

    componentDidMount() {
        this.authListener = backend.onAuthChange(() => {
            backend.viewTea(this.state.id, true, true, true, true).then((tea) => {
                this.setState({
                    signedIn: backend.signedIn(),
                    isLoaded: true,
                    tea: tea
                });
            }).catch((err) => {
                this.setState({
                    signedIn: backend.signedIn(),
                    isLoaded: true
                });
                this.props.toastableProps.toastError(err);
            });
        });

        if (this.props.id === undefined) {
            this.setState({
                isLoaded: true
            });
            this.props.toastableProps.toastError(Error("No ID given, no tea found"));
            return;
        }

        const id = this.props.id;
        backend.viewTea(id, true, true, true, true).then((tea) => {
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

            this.setState({
                isLoaded: true,
                id: id,
                tea: tea,
                teaImg: teaImg,
                scaleX: scaleX,
                scaleY: scaleY,
            });
        }).catch((err) => {
            this.setState({
                isLoaded: true
            });
            this.props.toastableProps.toastError(err);
        });
    }

    componentWillUnmount() {
        if (this.authListener !== undefined) {
            this.authListener();
        }
    }

    render() {
        if (this.state.isLoaded) {
            let tags: string[] | undefined = this.state.tea?.expand?.tags === undefined ? undefined : this.state.tea.expand.tags.map((tag) => tag.name);

            return (
                <div className={"tea-spotlight"}>
                    <div className={"tea-details"}>
                        <div className={"tea-name"}>{this.state.tea?.name}</div>
                        <div
                            className={"tea-tags"}>{tags === undefined ? 'No Tags' : tags.join(', ')}</div>
                        <div className={"tea-description"}>{this.state.tea?.description}</div>
                        <div className={"tea-rank"}>
                            Global Rank: {this.state.tea?.expand?.globalRank === undefined ?
                            'No Global Rank' : this.state.tea.expand.globalRank.rank}
                        </div>
                        {this.state.signedIn &&
                            <div style={{width: "100%"}}>
                                <div className={"tea-rank"}>
                                    Personal Rank: {this.state.tea?.expand?.localRank === undefined ?
                                    'No Personal Rank' : this.state.tea.expand.localRank.rank}
                                </div>
                                <TeaNotes note={this.state.tea?.expand?.notes} teaId={this.state.tea?.id} toastableProps={this.props.toastableProps} />
                                {/*<div className={"match-history"}>Match History:</div>*/}
                            </div>
                        }
                    </div>
                    <div className={"tea-img"}>
                        <img src={this.state.teaImg} alt={"Tea"}
                             style={{transform: `scaleX(${this.state.scaleX}) scaleY(${this.state.scaleY})`}}/>
                    </div>
                </div>
            )
        } else {
            return <div>Loading...</div>
        }
    }
}

export const TeaSpotlight: FunctionComponent<ToastableProps> = (props: ToastableProps): JSX.Element => {
    const params = useParams();
    return (
        <TeaSpotlightClass id={params.id} toastableProps={props}/>
    );
}