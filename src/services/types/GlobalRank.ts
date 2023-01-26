import {Tea} from "./Tea";

export type GlobalRank = {
    id: string,
    rank: number,
    expand?: {
        tea?: Tea
    }
}