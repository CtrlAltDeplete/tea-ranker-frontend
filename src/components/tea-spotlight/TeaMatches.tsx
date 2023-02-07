import {FunctionComponent, useEffect, useState} from "react";
import {ToastableProps} from "../toast/ToastableProps";
import {Match} from "../../services/types/Match";
import {backend} from "../../config";
import {MatchListing} from "../matches/MatchListing";

type TeaMatchesProps = {
    toastableProps: ToastableProps
    teaId: string
}

export const TeaMatches: FunctionComponent<TeaMatchesProps> = (props: TeaMatchesProps): JSX.Element => {
    const [isLoaded, setLoaded] = useState(false);
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        backend.listMatchesForTea(props.teaId, true, true, false).then((matches: Match[]) => {
            setMatches(matches);
        }).catch((err) => {
            props.toastableProps.toastError(err);
        }).finally(() => {
            setLoaded(true);
        });
    }, [props]);

    return (
        <section id={"matches"}>
            <div className={"match-history"}>Match History:</div>
            {!isLoaded &&
                <div>Loading...</div>
            }
            <div className={"list-container"}>
                <ul>
                    {matches.map((match: Match) => {
                        return <MatchListing key={match.id} match={match}/>;
                    })}
                </ul>
            </div>
        </section>
    );
}