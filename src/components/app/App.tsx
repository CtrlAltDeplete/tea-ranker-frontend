import React, {Component} from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from "../home/Home";
import TeaMasterlist from "../tea-masterlist/TeaMasterlist";
import {AboutUs} from "../about-us/AboutUs";
import {TeaSpotlight} from "../tea-spotlight/TeaSpotlight";
import {NewMatch} from "../new-match/NewMatch";
import {Nav} from "../nav/Nav";
import {Toast} from "../toast/Toast";
import {Auth} from "../auth/Auth";

import './App.css';
import {Rankings} from "../rankings/Rankings";
import {Matches} from "../matches/Matches";

type AppState = {
    error?: Error
    msg?: string
    visible: boolean
};

export default class App extends Component<{}, AppState> {
    state: Readonly<AppState> = {
        error: undefined,
        msg: undefined,
        visible: false
    };

    clearToast = () => {
        this.setState({
            error: undefined,
            msg: undefined,
            visible: false
        });
    }

    toastMessage = (msg: string, delay: number = 3000) => {
        this.setState({
            error: undefined,
            msg: msg,
            visible: true
        });

        setTimeout(() => {
            this.clearToast();
        }, delay);
    }

    toastError = (err: Error, delay: number = 3000) => {
        this.setState({
            error: err,
            msg: undefined,
            visible: true
        });

        setTimeout(() => {
            this.clearToast();
        }, delay);
    }

    router = createBrowserRouter([
        {
            path: "/tea-masterlist",
            element: <TeaMasterlist toastMessage={this.toastMessage} toastError={this.toastError}/>
        },
        {
            path: "/rankings",
            element: <Rankings toastMessage={this.toastMessage} toastError={this.toastError}/>
        },
        {
            path: "/about-us",
            element: <AboutUs toastMessage={this.toastMessage} toastError={this.toastError}/>
        },
        {
            path: "/tea/:id",
            element: <TeaSpotlight toastMessage={this.toastMessage} toastError={this.toastError}/>
        },
        {
            path: "/matches",
            element: <Matches toastMessage={this.toastMessage} toastError={this.toastError}/>
        },
        {
            path: "/new-match",
            element: <NewMatch toastMessage={this.toastMessage} toastError={this.toastError}/>
        },
        {
            path: '/redirect',
            element: <div><Home/><Auth toastMessage={this.toastMessage} toastError={this.toastError}/></div>
        },
        {
            path: "*",
            element: <Home/>,
        },
    ]);

    render() {
        return (
            <React.StrictMode>
                <Nav toastMessage={this.toastMessage} toastError={this.toastError}/>
                <RouterProvider router={this.router}/>
                <Toast visible={this.state.visible} msg={this.state.msg} err={this.state.error}/>
            </React.StrictMode>
        );
    }
}