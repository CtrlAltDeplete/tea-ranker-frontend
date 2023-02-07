import React, {FunctionComponent, useState, useEffect} from "react";

import {backend} from "../../config";
import {AuthProvider} from "../../services/types/AuthProvider";
import {ToastableProps} from "../toast/ToastableProps";

export const SignInButton: FunctionComponent<ToastableProps> = (props: ToastableProps): JSX.Element => {
    const [isSignedIn, setSignedIn] = useState(backend.signedIn());
    const [discordProvider, setDiscordProvider] = useState<undefined | AuthProvider>(undefined);

    useEffect(() => {
        backend.getDiscordProvider().then((provider: AuthProvider) => {
            setDiscordProvider(provider);
        }).catch((err) => {
            props.toastError(err);
        });

        return backend.onAuthChange(() => {
            setSignedIn(backend.signedIn());
        });
    }, [props]);

    function signOut() {
        setTimeout(backend.signOut, 500);
    }

    if (isSignedIn) {
        return (
            <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href={"#"} onClick={() => signOut()}>Sign Out</a>
            </li>
        );
    }

    if (discordProvider === undefined) {
        return (
            <li></li>
        );
    }

    return (
        <li>
            <a href={discordProvider.authURL}>Sign In</a>
        </li>
    );
}