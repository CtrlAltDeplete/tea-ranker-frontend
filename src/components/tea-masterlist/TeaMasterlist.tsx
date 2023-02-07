import React, {ChangeEvent, FunctionComponent, useState, useEffect} from "react";

import {backend} from "../../config";
import {RandomTeaImageProps, TeaImageProps} from "../tea-image/TeaImage";
import {Tea} from '../../services/types/Tea';
import {TeaListing} from "./TeaListing";
import {ToastableProps} from "../toast/ToastableProps";

import './TeaMasterlist.css';

export const TeaMasterlist: FunctionComponent<ToastableProps> = (props: ToastableProps): JSX.Element => {
    const [isLoaded, setLoaded] = useState(false);
    const [teas, setTeas] = useState<Tea[]>([]);
    const [teaImageProps, setTeaImageProps] = useState<TeaImageProps[]>([]);
    const [filteredIds, setFilteredIds] = useState<number[]>([]);

    useEffect(() => {
        backend.listTeas(true, false, false, false).then((teas) => {
            const teaImageProps: TeaImageProps[] = [];
            for (let i = 0; i < teas.length; i++) {
                teaImageProps.push(RandomTeaImageProps());
            }

            setTeas(teas);
            setTeaImageProps(teaImageProps);
            setFilteredIds(Array.from(Array(teas.length).keys()));
        }).catch((err) => {
            props.toastError(err);
        }).finally(() => {
            setLoaded(true);
        });
    }, [props]);

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        const newSearchQuery = event.target.value;
        if (newSearchQuery === undefined || newSearchQuery === "") {
            setFilteredIds(Array.from(Array(teas.length).keys()));
            return
        }

        setFilteredIds(Array.from(Array(teas.length).keys()).filter((index: number) => {
            const tea = teas[index];
            return tea.name.includes(newSearchQuery) || tea.description.includes(newSearchQuery);
        }));
    }

    return (
        <section id={"tea-masterlist"}>
            <input type={"text"} placeholder={"Search..."} onChange={handleSearchChange}/>
            {isLoaded &&
                <ul>
                    {filteredIds.map((teaIndex: number) => {
                        const tea = teas[teaIndex];
                        return <TeaListing key={tea.id} tea={tea} teaImageProps={teaImageProps[teaIndex]}/>;
                    })}
                </ul>
            }
        </section>
    );
}
