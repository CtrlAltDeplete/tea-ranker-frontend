import {Tag} from "./Tag";
import {GlobalRank} from "./GlobalRank";
import {LocalRank} from "./LocalRank";
import {Note} from "./Note";

export type Tea = {
    id: string,
    name: string,
    description: string,
    expand?: {
        tags?: Tag[],
        globalRank?: GlobalRank,
        localRank?: LocalRank,
        notes?: Note
    }
}