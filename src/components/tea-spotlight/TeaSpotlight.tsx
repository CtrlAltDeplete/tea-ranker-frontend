import React, {FunctionComponent, useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import {backend} from "../../config";
import {RandomTeaImageProps} from "../tea-image/TeaImage";
import {Tea} from "../../services/types/Tea";
import {TeaNotes} from "./TeaNotes";
import {ToastableProps} from "../toast/ToastableProps";

import './TeaSpotlight.css';

export const TeaSpotlight: FunctionComponent<ToastableProps> = (props: ToastableProps): JSX.Element => {
    const [isLoaded, setLoaded] = useState(false);
    const [isSignedIn, setSignedIn] = useState(backend.signedIn());
    const [tea, setTea] = useState<undefined | Tea>(undefined);
    const teaId = useParams().id;

    useEffect(() => {
        if (teaId === undefined) {
            return;
        }

        backend.viewTea(teaId, true, true, true, true).then((tea) => {
            setTea(tea);
        }).catch((err) => {
            props.toastError(err);
        }).finally(() => {
            setLoaded(true);
        });

        return backend.onAuthChange(() => {
            setSignedIn(backend.signedIn());
            if (teaId === undefined) {
                return;
            }

            backend.viewTea(teaId, true, true, true, true).then((tea) => {
                setTea(tea);
            }).catch((err) => {
                props.toastError(err);
            }).finally(() => {
                setLoaded(true);
            });
        });
    }, [props, teaId]);

    if (isLoaded) {
        const tags: string[] | undefined = tea?.expand?.tags === undefined ? undefined : tea.expand.tags.map((tag) => tag.name);
        const teaImageProps = RandomTeaImageProps();
        return (
            <div className={"tea-spotlight"}>
                <div className={"tea-details"}>
                    <div className={"tea-name"}>{tea?.name}</div>
                    <div
                        className={"tea-tags"}>{tags === undefined ? 'No Tags' : tags.join(', ')}</div>
                    <div className={"tea-description"}>{tea?.description}</div>
                    <div className={"tea-rank"}>
                        Global Rank: {tea?.expand?.globalRank === undefined ?
                        'No Global Rank' : tea.expand.globalRank.rank}
                    </div>
                    {isSignedIn &&
                        <div style={{width: "100%"}}>
                            <div className={"tea-rank"}>
                                Personal Rank: {tea?.expand?.localRank === undefined ?
                                'No Personal Rank' : tea.expand.localRank.rank}
                            </div>
                            <TeaNotes note={tea?.expand?.notes}
                                      teaId={tea?.id ? tea.id : ""}
                                      toastableProps={props}/>
                            {/*<div className={"match-history"}>Match History:</div>*/}
                        </div>
                    }
                </div>
                <div className={"tea-img"}>
                    <img src={teaImageProps.teaImage} alt={"Tea"}
                         style={{transform: `scaleX(${teaImageProps.scaleX}) scaleY(${teaImageProps.scaleY})`}}/>
                </div>
            </div>
        );
    } else {
        return <div>Loading...</div>
    }
}