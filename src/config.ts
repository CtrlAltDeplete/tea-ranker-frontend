import {Backend} from "./services/backend/Backend";
import {mockBackend} from "./services/backend/MockBackend";
import {pocketBaseBackend} from "./services/backend/PocketBase";

export let backend: Backend;
switch (process.env.REACT_APP_STAGE) {
    case 'dev':
        backend = mockBackend;
        break;
    case 'local':
        backend = pocketBaseBackend;
        break;
    default:
        throw Error(`No configuration for ${process.env.REACT_APP_STAGE} environment`);
}