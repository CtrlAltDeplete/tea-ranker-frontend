import React, {FunctionComponent} from "react";

import './Toast.css';

type ToastProp = {
    visible: boolean
    msg?: string
    err?: Error
}

export const Toast: FunctionComponent<ToastProp> = (props: ToastProp): JSX.Element => {
    let className = "toast " + (props.err === undefined ? "confirmation" : "error");
    if (props.visible) {
        className += " show";
    }

    return (
        <div className={className}>
            {props.err === undefined ? props.msg : `Error: ${props.err.message}`}
        </div>
    );
}