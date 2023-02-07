import {FunctionComponent, useState, useEffect} from "react";
import {Tea} from "../../services/types/Tea";

import "./TeaSelection.css";
import closeImg from "./close.svg";

type TeaSelectionProps = {
    teas?: Tea[]
    selected?: Tea
    placeholder: string
    selectionChangeCallback: (tea?: Tea) => void
}

export const TeaSelection: FunctionComponent<TeaSelectionProps> = (props: TeaSelectionProps): JSX.Element => {
    const [selected, setSelected] = useState<undefined | Tea>(undefined);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        setSelected(props.selected);
    }, [props]);

    function handleSelectionChanged(newSelection?: Tea) {
        setSelected(newSelection);
        setDropdownVisible(false);
        props.selectionChangeCallback(newSelection);
    }

    const classNames: string[] = ["mock-option-list"];
    if (!isDropdownVisible) {
        classNames.push("hidden");
    } else {
        classNames.push("visible");
    }
    return (
        <div className={"tea-selection"}>
            <ul className={classNames.join(" ")}>
                <li className={"close-dropdown"} onClick={() => setDropdownVisible(false)}>
                    <img src={closeImg} alt={"Close"} />
                </li>
                {props.teas?.map((tea: Tea) => {
                    return <li key={tea.id}
                               onClick={() => handleSelectionChanged(tea)}
                               className={selected?.id === tea.id ? "selected" : ""}>
                        {tea.name}
                    </li>;
                })}
            </ul>
            <div className={"mock-select"} onClick={() => setDropdownVisible(props.teas !== undefined && props.teas.length > 0)}>
                {selected ? selected.name : props.placeholder}
            </div>
        </div>
    )
}