import {User} from "./User";
import {Tea} from "./Tea";

export type Note = {
    id: string,
    notes: string,
    expand?: {
        user?: User,
        tea?: Tea,
    }
}