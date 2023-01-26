import {Tea} from "./Tea";

export type Tag = {
    id: string,
    name: string,
    expand?: {
        teas?: Tea[]
    }
}