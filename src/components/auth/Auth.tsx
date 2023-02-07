import React, {FunctionComponent, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import {backend} from "../../config";
import {ToastableProps} from "../toast/ToastableProps";

function useQuery() {
    const {search} = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const Auth: FunctionComponent<ToastableProps> = (props: ToastableProps): JSX.Element => {
    const query = useQuery();
    const navigate = useNavigate();

    useEffect(() => {
        const state = query.get('state');
        const code = query.get('code');

        if (state && code) {
            // Finish the login process
            backend.finishDiscordSignIn(state, code).then(() => {
                props.toastMessage("Signed in!");
            }).catch((err) => {
                props.toastError(err);
            }).finally(() => {
                navigate('/');
            });
        }
    });

    return <div/>;
}