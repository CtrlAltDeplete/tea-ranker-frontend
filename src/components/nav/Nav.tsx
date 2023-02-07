import React, {Component} from "react";

/* Local Imports */
import {backend} from "../../config";
import {SignInButton} from "./SignInButton";
import {ToastableProps} from "../toast/ToastableProps";

/* CSS */
import './Nav.css';

/* Images */
import menuIcon from './menu_icon.svg';
import xIcon from "./x_icon.svg";
import teaIcon from "./tea_icon.svg";

type NavState = {
    menuVisible: boolean
    signedIn: boolean
}

export default class Nav extends Component<ToastableProps, NavState> {
    state: Readonly<NavState> = {
        menuVisible: false,
        signedIn: backend.signedIn()
    }

    authListener: undefined | (() => void) = undefined;

    componentDidMount() {
        this.authListener = backend.onAuthChange(() => {
            this.setState({
                signedIn: backend.signedIn()
            });
        });
    }

    componentWillUnmount() {
        if (this.authListener !== undefined) {
            this.authListener();
        }
    }

    render() {
        const classNames = "side-menu " + (this.state.menuVisible ? "show" : "hide");
        const sideMenu =
            <div className={classNames}>
                <ul>
                    <li>
                        <button onClick={() => {
                            this.setState({menuVisible: false});
                        }}>
                            <img src={xIcon} alt={"Close Menu Icon"} id={"close-menu-button"}/>
                        </button>
                    </li>
                    <li>
                        <a href={"/"}>Home</a>
                    </li>
                    <li>
                        <a href={"/tea-masterlist"}>Tea Masterlist</a>
                    </li>
                    <li>
                        <a href={"/rankings"}>Rankings</a>
                    </li>
                    <li>
                        <a href={"/about-us"}>About Us</a>
                    </li>
                    {this.state.signedIn &&
                        <div>
                            <li>
                                <a href={"/matches"}>Matches</a>
                            </li>
                            <li>
                                <a href={"/new-match"}>New Match</a>
                            </li>
                        </div>
                    }
                    <SignInButton toastError={this.props.toastError} toastMessage={this.props.toastMessage} />
                </ul>
                <img src={teaIcon} alt={"Cup of Tea"} id={"tea-icon"}/>
            </div>;

        return (
            <div className={"nav"}>
                <div className={"nav-bar"}>
                    <button onClick={() => {
                        this.setState({menuVisible: true});
                    }}>
                        <img src={menuIcon} alt={"Menu Icon"} id={"open-menu-button"}/>
                    </button>
                </div>
                {sideMenu}
            </div>
        );
    }
}
