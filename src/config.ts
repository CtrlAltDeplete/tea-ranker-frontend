import {Backend} from "./services/backend/Backend";
import {mockBackend} from "./services/backend/MockBackend";
import {PocketBaseBackend} from "./services/backend/PocketBase";

export let backend: Backend;
switch (process.env.REACT_APP_STAGE) {
    case 'dev':
        backend = mockBackend;
        break;
    case 'local':
        backend = PocketBaseBackend('http://127.0.0.1:8090', 'http://127.0.0.1:3000/redirect');
        break;
    case 'prod':
        backend = PocketBaseBackend('https://tearanker.com/api', 'https://tearanker.com/redirect');
        break;
    default:
        throw Error(`No configuration for ${process.env.REACT_APP_STAGE} environment`);
}