import React, {ChangeEvent, Component} from "react";
import {Tea} from '../../services/types/Tea';

import './TeaMasterlist.css';
import {backend} from "../../config";
import {TeaListing} from "./TeaListing";
import {ToastableProps} from "../toast/ToastableProps";
import {TeaImage} from "../tea-image/TeaImage";

type TeaMasterlistState = {
    isLoaded: boolean
    teas: Tea[]
    teaImgs: JSX.Element[]
    filteredTeaIds: number[]
    searchQuery?: string
}

export default class TeaMasterlist extends Component<ToastableProps, TeaMasterlistState> {
    state: Readonly<TeaMasterlistState> = {
        isLoaded: false,
        teas: [],
        teaImgs: [],
        filteredTeaIds: [],
        searchQuery: undefined
    };

    componentDidMount() {
        backend.listTeas(true, false, false, false).then((teas) => {
            const teaImgs: JSX.Element[] = [];
            for (let i = 0; i < teas.length; i++) {
                teaImgs.push(<TeaImage/>);
            }

            this.setState({
                isLoaded: true,
                teas: teas,
                teaImgs: teaImgs,
                filteredTeaIds: Array.from(Array(teas.length).keys()),
            });
        }).catch((err) => {
            this.setState({
                isLoaded: true,
            });
            this.props.toastError(err);
        });
    }

    handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const searchQuery = event.target.value;
        if (searchQuery === undefined || searchQuery === "") {
            this.setState({
                filteredTeaIds: Array.from(Array(this.state.teas.length).keys()),
            });
            return
        }

        this.setState({
            filteredTeaIds: Array.from(Array(this.state.teas.length).keys()).filter((index: number) => {
                const tea = this.state.teas[index];
                return tea.name.includes(searchQuery) || tea.description.includes(searchQuery);
            })
        });
    }

    render() {
        return (
            <section id={"tea-masterlist"}>
                <input type={"text"} placeholder={"Search..."} onChange={this.handleSearchChange}
                       value={this.state.searchQuery}/>
                {this.state.isLoaded &&
                    <ul>
                        {this.state.filteredTeaIds.map((teaIndex: number) => {
                            const tea = this.state.teas[teaIndex];
                            return <TeaListing key={tea.id} tea={tea} teaImg={this.state.teaImgs[teaIndex]}/>;
                        })}
                    </ul>
                }
            </section>
        );
    }
}