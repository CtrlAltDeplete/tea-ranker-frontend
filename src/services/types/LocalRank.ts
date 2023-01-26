import {User} from "./User";
import {Tea} from "./Tea";

export type LocalRank = {
    id: string,
    rank: number,
    expand?: {
        user?: User,
        tea?: Tea
    }
}