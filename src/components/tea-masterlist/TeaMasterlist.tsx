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
    const [searchQuery, setSearchQuery] = useState<undefined | string>(undefined);
    const [hideTried, setHideTried] = useState(false);

    useEffect(() => {
        if (!isLoaded) {
            backend.listTeas(true, false, true, false).then((teas) => {
                const teaImageProps: TeaImageProps[] = [];
                for (let i = 0; i < teas.length; i++) {
                    teaImageProps.push(RandomTeaImageProps());
                }

                setTeas(teas);
                setTeaImageProps(teaImageProps);
            }).catch((err) => {
                props.toastError(err);
            }).finally(() => {
                setLoaded(true);
            });
        }

        setFilteredIds(Array.from(Array(teas.length).keys()).filter((index: number) => {
            const tea = teas[index];
            const okSearch = searchQuery === undefined ||
                searchQuery === "" ||
                tea.name.includes(searchQuery) ||
                tea.description.includes(searchQuery);
            const okTried = !hideTried || tea.expand?.localRank === undefined;
            return okSearch && okTried;
        }));
    }, [props, searchQuery, hideTried, teas, isLoaded]);

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearchQuery(event.target.value);
    }

    function handleHideTriedChange() {
        setHideTried(!hideTried);
    }

    return (
        <section id={"tea-masterlist"}>
            <input type={"text"} placeholder={"Search..."} onChange={handleSearchChange}/>
            <div className={"hide-tried"}>
                <label>Hide Tried:</label>
                <input type={"checkbox"} onChange={handleHideTriedChange} checked={hideTried}/>
            </div>
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
