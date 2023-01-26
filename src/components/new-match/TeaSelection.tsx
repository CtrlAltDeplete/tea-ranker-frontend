import {Component} from "react";
import {Tea} from "../../services/types/Tea";

import "./TeaSelection.css";
import closeImg from "./close.svg";

type TeaSelectionProps = {
    teas?: Tea[]
    selected?: Tea
    placeholder: string
    selectionChangeCallback: (tea?: Tea) => void
}

type TeaSelectionState = {
    teas?: Tea[]
    selected?: Tea
    dropdownVisible: boolean
    placeholder: string
    selectionChangeCallback: (tea?: Tea) => void
}

export class TeaSelection extends Component<TeaSelectionProps, TeaSelectionState> {
    state: Readonly<TeaSelectionState> = {
        teas: this.props.teas,
        selected: this.props.selected,
        dropdownVisible: false,
        placeholder: this.props.placeholder,
        selectionChangeCallback: this.props.selectionChangeCallback
    }

    handleSelectionOpen = () => {
        this.setState({
            dropdownVisible: this.state.teas !== undefined && this.state.teas.length > 0,
        });
    }

    handleSelectionClose = () => {
        this.setState({
            dropdownVisible: false,
        });
    }

    handleSelectionChanged = (newSelection?: Tea) => {
        this.setState({
            selected: newSelection,
            dropdownVisible: false
        });
        this.state.selectionChangeCallback(newSelection);
    }

    render() {
        const classNames: string[] = ["mock-option-list"];
        if (!this.state.dropdownVisible) {
            classNames.push("hidden");
        } else {
            classNames.push("visible");
        }
        return (
            <div className={"tea-selection"}>
                <ul className={classNames.join(" ")}>
                    <li className={"close-dropdown"} onClick={this.handleSelectionClose}>
                        <img src={closeImg} alt={"Close"} />
                    </li>
                    {this.state.teas?.map((tea: Tea) => {
                        return <li key={tea.id}
                                   onClick={() => this.handleSelectionChanged(tea)}
                                   className={this.state.selected?.id === tea.id ? "selected" : ""}>
                            {tea.name}
                        </li>;
                    })}
                </ul>
                <div className={"mock-select"} onClick={this.handleSelectionOpen}>
                    {this.state.selected ? this.state.selected.name : this.state.placeholder}
                </div>
            </div>
        )
    }
}