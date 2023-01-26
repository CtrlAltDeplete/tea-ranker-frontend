import {Tea} from "./Tea";
import {User} from "./User";

export type Match = {
    id: string,
    rankChange: number,
    date: string,
    expand?: {
        user?: User,
        winner?: Tea,
        loser?: Tea,
    }
}