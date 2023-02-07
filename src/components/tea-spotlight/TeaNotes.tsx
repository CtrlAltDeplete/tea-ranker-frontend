import React, {FunctionComponent, useEffect, useState} from "react";

import './TeaNotes.css';
import {backend} from "../../config";
import {Note} from "../../services/types/Note";
import {ToastableProps} from "../toast/ToastableProps";

type TeaNotesProp = {
    teaId: string
    note?: Note
    toastableProps: ToastableProps
};

export const TeaNotes: FunctionComponent<TeaNotesProp> = (props: TeaNotesProp): JSX.Element => {
    const [lastChanged, setLastChanged] = useState(Date.now());
    const [lastSaved, setLastSaved] = useState(Date.now());
    const [note, setNote] = useState(props.note);

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setNote({
            id: note === undefined ? "" : note.id,
            notes: event.target.value
        });
        setLastChanged(Date.now());
    }

    useEffect(() => {
        function handleSave() {
            if (note === undefined) {
                return;
            }

            // Has the user made changes since the last save?
            if (lastSaved >= lastChanged) {
                return;
            }

            // Has the user stopped typing for more than 5 seconds?
            if (Date.now() - lastChanged > 3000) {
                // If the note has no ID, create a new note
                if (note.id === "") {
                    backend.createNote(note.notes, props.teaId).then((note: Note) => {
                        setNote(note);
                        props.toastableProps.toastMessage("Saved!");
                    }).catch((err) => {
                        props.toastableProps.toastError(err);
                    }).finally(() => {
                        setLastSaved(Date.now());
                    });
                } else {
                    // Otherwise, we update the existing note
                    backend.updateNote(note).then(() => {
                        props.toastableProps.toastMessage("Saved!");
                    }).catch((err) => {
                        props.toastableProps.toastError(err);
                    }).finally(() => {
                        setLastSaved(Date.now());
                    });
                }
            }
        }

        const saveTimer = setInterval(() => {
            handleSave();
        }, 1000);

        return () => {
            clearInterval(saveTimer);
        };
    }, [lastChanged, lastSaved, note, props]);

    return (
        <div className={"tea-notes"}>
                <textarea placeholder={"Notes/Comments..."}
                          value={note?.notes} onChange={handleChange}/>
        </div>
    );
}