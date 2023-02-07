import {Tea} from '../types/Tea';
import {Note} from "../types/Note";
import {AuthResponse} from "../types/AuthResponse";
import {Match} from "../types/Match";
import {AuthProvider} from "../types/AuthProvider";
import {GlobalRank} from "../types/GlobalRank";
import {LocalRank} from "../types/LocalRank";

export interface Backend {
    /* Authentication */
    getDiscordProvider(): Promise<AuthProvider>;
    finishDiscordSignIn(state: string, code: string): Promise<AuthResponse>,
    signOut(): void;
    signedIn(): boolean;
    onAuthChange(callback: () => void): () => void;

    /* Teas */
    listTeas(tags?: boolean, globalRank?: boolean, localRank?: boolean, notes?: boolean): Promise<Tea[]>;
    viewTea(id: string, tags?: boolean, globalRank?: boolean, localRank?: boolean, notes?: boolean): Promise<Tea>;
    founderFavoriteTeas(): Promise<Tea[]>;
    suggestOpponent(teaId: string, rank: number): Promise<Tea>;

    /* Notes */
    createNote(notes: string, teaId: string): Promise<Note>;
    updateNote(note: Note): Promise<Note>;

    /* Matches */
    createMatch(loserId: string, winnerId: string): Promise<Match>;
    listMatches(winner?: boolean, loser?: boolean, user?: boolean): Promise<Match[]>;
    listMatchesForTea(teaId: string, winner?: boolean, loser?: boolean, user?: boolean): Promise<Match[]>;

    /* Rankings */
    listGlobalRanks(tea?: boolean): Promise<GlobalRank[]>;
    listLocalRanks(tea?: boolean, user?: boolean): Promise<LocalRank[]>;
}