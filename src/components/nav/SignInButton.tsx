import React, {Component} from "react";
import {ToastableProps} from "../toast/ToastableProps";
import {backend} from "../../config";
import {AuthProvider} from "../../services/types/AuthProvider";

type SignInButtonState = {
    signedIn: boolean
    discordProvider?: AuthProvider
}

function signOut() {
    setTimeout(backend.signOut, 500);
}

export default class SignInButton extends Component<ToastableProps, SignInButtonState> {
    state: Readonly<SignInButtonState> = {
        signedIn: backend.signedIn(),
        discordProvider: undefined
    }

    authListener: undefined | (() => void) = undefined;

    componentDidMount() {
        this.authListener = backend.onAuthChange(() => {
            this.setState({
                signedIn: backend.signedIn()
            });
        });

        backend.getDiscordProvider().then((provider: AuthProvider) => {
            this.setState({
                discordProvider: provider
            });
        }).catch((err) => {
            this.props.toastError(err);
        });
    }

    componentWillUnmount() {
        if (this.authListener !== undefined) {
            this.authListener();
        }
    }

    render() {
        if (this.state.signedIn) {
            return (
                <li>
                    <a href={"#"} onClick={() => signOut()}>Sign Out</a>
                </li>
            );
        }

        if (this.state.discordProvider === undefined) {
            return (
                <li></li>
            );
        }

        return (
            <li>
                <a href={this.state.discordProvider.authURL}>Sign In</a>
            </li>
        );
    }
};