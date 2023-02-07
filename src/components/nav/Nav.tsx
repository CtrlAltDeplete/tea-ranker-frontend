import React, {FunctionComponent, useState, useEffect} from "react";

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

export const Nav: FunctionComponent<ToastableProps> = (props: ToastableProps): JSX.Element => {
    const [isSignedIn, setSignedIn] = useState(backend.signedIn());
    const [isMenuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        return backend.onAuthChange(() => {
            setSignedIn(backend.signedIn());
        });
    }, [props]);

    const classNames = "side-menu " + (isMenuVisible ? "show" : "hide");
    const sideMenu =
        <div className={classNames}>
            <ul>
                <li>
                    <button onClick={() => {
                        setMenuVisible(false);
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
                {isSignedIn &&
                    <div>
                        <li>
                            <a href={"/matches"}>Matches</a>
                        </li>
                        <li>
                            <a href={"/new-match"}>New Match</a>
                        </li>
                    </div>
                }
                <SignInButton toastError={props.toastError} toastMessage={props.toastMessage} />
            </ul>
            <img src={teaIcon} alt={"Cup of Tea"} id={"tea-icon"}/>
        </div>;

    return (
        <div className={"nav"}>
            <div className={"nav-bar"}>
                <button onClick={() => {
                    setMenuVisible(true);
                }}>
                    <img src={menuIcon} alt={"Menu Icon"} id={"open-menu-button"}/>
                </button>
            </div>
            {sideMenu}
        </div>
    );
}
