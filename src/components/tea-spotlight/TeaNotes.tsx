import React, {Component} from "react";

import './TeaNotes.css';
import {backend} from "../../config";
import {Toast} from "../toast/Toast";
import {Note} from "../../services/types/Note";
import {ToastableProps} from "../toast/ToastableProps";

type TeaNotesProp = {
    teaId?: string
    note?: Note
    toastableProps: ToastableProps
};

type TeaNotesState = {
    teaId: string
    note?: Note
    notesLastChanged: number
    notesLastSaved: number
};

export default class TeaNotes extends Component<TeaNotesProp, TeaNotesState> {
    state: Readonly<TeaNotesState> = {
        teaId: this.props.teaId === undefined ? "" : this.props.teaId,
        note: undefined,
        notesLastChanged: Date.now(),
        notesLastSaved: Date.now()
    };

    saveTimer?: NodeJS.Timer;

    componentDidMount() {
        this.setState({
            teaId: this.props.teaId === undefined ? "" : this.props.teaId,
            note: this.props.note
        });

        // Check if notes need saved every second
        this.saveTimer = setInterval(() => {
            this.handleSave();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.saveTimer);
    }

    handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (this.state.note === undefined) {
            this.setState({
                note: {
                    id: "",
                    notes: event.target.value
                },
                notesLastChanged: Date.now()
            });
            return;
        }

        const note = this.state.note;
        note.notes = event.target.value;

        this.setState({
            note: note,
            notesLastChanged: Date.now()
        });
    }

    handleSave = () => {
        if (this.state.note === undefined) {
            return;
        }

        // Has the user made changes since the last save?
        if (this.state.notesLastSaved >= this.state.notesLastChanged) {
            return;
        }

        // Has the user stopped typing for more than 5 seconds?
        if (Date.now() - this.state.notesLastChanged > 3000) {
            // If the note has no ID, create a new note
            if (this.state.note.id === "") {
                backend.createNote(this.state.note.notes, this.state.teaId).then((note: Note) => {
                    this.setState({
                        note: note,
                        notesLastSaved: Date.now()
                    });
                    this.props.toastableProps.toastMessage("Saved!");
                }).catch((err) => {
                    this.setState({
                        notesLastSaved: Date.now()
                    });
                    this.props.toastableProps.toastError(err);
                });
                // Otherwise, we update the existing note
            } else {
                backend.updateNote(this.state.note).then(() => {
                    this.setState({
                        notesLastSaved: Date.now()
                    });
                    this.props.toastableProps.toastMessage("Saved!");
                }).catch((err) => {
                    this.setState({
                        notesLastSaved: Date.now()
                    });
                    this.props.toastableProps.toastError(err);
                });
            }
        }
    }

    render() {
        return (
            <div className={"tea-notes"}>
                <textarea placeholder={"Notes/Comments..."}
                          value={this.state.note?.notes} onChange={this.handleChange}/>
            </div>
        );
    }
}