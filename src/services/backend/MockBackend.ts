import {Backend} from "./Backend";
import {Tea} from "../types/Tea";
import {Note} from "../types/Note";
import {AuthResponse} from "../types/AuthResponse";
import {Match} from "../types/Match";
import {AuthProvider} from "../types/AuthProvider";
import {GlobalRank} from "../types/GlobalRank";
import {LocalRank} from "../types/LocalRank";

const mockTeas: Tea[] = [
    {
        id: '0',
        name: 'Spiral Jade (pi-lo-chun)',
        description: 'Traditionally grown among apricot, peach, orange, and plum trees, Spiral Jade is famous for its tender sweet taste and fruity aroma.',
        expand: {
            tags: [
                {
                    id: '0',
                    name: 'China'
                },
                {
                    id: '1',
                    name: 'Green Tea'
                },
            ],
            globalRank: {
                id: '0',
                rank: 1000
            }
        },
    },
    {
        id: '1',
        name: 'Honey Chrysanthemum',
        description: 'Chinese white chrysanthemum and goji berries deliver unique sweet floral notes and provide soothing, cleansing, and detoxifying properties.',
        expand: {
            tags: [
                {
                    id: '2',
                    name: 'Herbal Tea'
                }
            ],
            globalRank: {
                id: '1',
                rank: 1000
            }
        },
    },
    {
        id: '2',
        name: 'Lady Londonderry',
        description: 'Subtle strawberry and lemon deliver an irresistible aroma and taste.',
        expand: {
            tags: [
                {
                    id: '3',
                    name: 'Royal Tea'
                },
                {
                    id: '4',
                    name: 'Black Tea'
                },
            ],
            globalRank: {
                id: '2',
                rank: 1000
            }
        },
    },
    {
        id: '3',
        name: 'Glorious Paradise',
        description: 'A blend of tropical fruits with a prominent hibiscus flavor, this makes an excellent iced tea choice!',
        expand: {
            tags: [
                {
                    id: '5',
                    name: 'Germany'
                },
                {
                    id: '4',
                    name: 'Black Tea'
                },
            ],
            globalRank: {
                id: '3',
                rank: 1000
            }
        },
    },
    {
        id: '4',
        name: 'Cardamon Ginger',
        description: 'Spicy ginger with crushed cardamom blended with a strong full body black tea. A classic Arabic style.',
        expand: {
            tags: [
                {
                    id: '6',
                    name: 'Middle East'
                },
                {
                    id: '4',
                    name: 'Black Tea'
                },
            ],
            globalRank: {
                id: '4',
                rank: 1000
            }
        },
    },
    {
        id: '5',
        name: 'Nile Breeze',
        description: 'A blend of black currant, pineapple, papaya, mango, and strawberry.',
        expand: {
            tags: [
                {
                    id: '7',
                    name: 'Africa'
                },
                {
                    id: '8',
                    name: 'Rooibos Red Tea'
                },
            ],
            globalRank: {
                id: '5',
                rank: 1000
            }
        },
    },
    {
        id: '6',
        name: 'Traditional Mate',
        description: 'A national drink in countries like Argentina, Brazil, and Chile, Yerba Mate carries a high level of caffeine and an earthy, stimulating taste.',
        expand: {
            tags: [
                {
                    id: '9',
                    name: 'South America'
                },
                {
                    id: '2',
                    name: 'Herbal Tea'
                },
            ],
            globalRank: {
                id: '6',
                rank: 1000
            }
        },
    },
    {
        id: '7',
        name: 'Raspberry Mint',
        description: 'A unique blend of raspberries, blackberry leaves, peppermint, and apple bits gives a sweet, refreshing aroma with a lightly tart, fruity flavor and a beautiful, light, ruby-red color.',
        expand: {
            tags: [
                {
                    id: '2',
                    name: 'Herbal Tea'
                },
            ],
            globalRank: {
                id: '7',
                rank: 1000
            }
        },
    },
    {
        id: '8',
        name: 'Strawberry Valley',
        description: 'Dried strawberries with a unique honey-sweet note. Great for an afternoon dessert tea option.',
        expand: {
            tags: [
                {
                    id: '5',
                    name: 'Germany'
                },
                {
                    id: '4',
                    name: 'Black Tea'
                },
            ],
            globalRank: {
                id: '8',
                rank: 1000
            }
        },
    },
    {
        id: '9',
        name: 'Hazelnut Chai',
        description: 'Toasted hazelnut aroma with a rich, creamy, and full-bodied Assam tea.',
        expand: {
            tags: [
                {
                    id: '10',
                    name: 'Chai Latte'
                },
            ],
            globalRank: {
                id: '9',
                rank: 1000
            }
        },
    },
];

export let mockSignedIn = JSON.parse(localStorage.getItem("mockSignedIn") || "false");

let authCallback: undefined | (() => void);

export const mockBackend: Backend = {
    /* Authentication */
    getDiscordProvider: async (): Promise<AuthProvider> => {
        return {
            name: "discord",
            authURL: "#",
            state: "state",
            codeVerifier: "",
        };
    },
    finishDiscordSignIn: async(state: string, code: string): Promise<AuthResponse> => {
        localStorage.setItem("mockSignedIn", "true");
        mockSignedIn = "true";
        if (authCallback !== undefined) {
            authCallback();
        }
        return {
            user: {
                id: "-1",
                username: "mockUser"
            },
            token: ""
        };
    },
    signOut: (): void => {
        localStorage.setItem("mockSignedIn", "false");
        mockSignedIn = "false";
        if (authCallback !== undefined) {
            authCallback();
        }
    },
    signedIn: (): boolean => {
        return mockSignedIn === "true";
    },
    onAuthChange: (callback: () => void): (() => void) => {
        authCallback = callback;
        return () => {
            return;
        };
    },

    /* Teas */
    listTeas: async (): Promise<Tea[]> => {
        return mockTeas;
    },
    viewTea: async (id: string, tags: boolean = false, globalRank: boolean = false, localRank: boolean = false, notes: boolean = false): Promise<Tea> => {
        const filtered = mockTeas.filter((tea) => tea.id === id);
        if (filtered.length > 0) {
            if (notes) {
                if (filtered[0].expand === undefined) {
                    filtered[0].expand = {};
                }
                filtered[0].expand.notes = {
                    id: "-1",
                    notes: ""
                };
            }
            return filtered[0];
        } else {
            return Promise.reject(Error(`No tea found for id ${id}.`));
        }
    },
    founderFavoriteTeas: async (): Promise<Tea[]> => {
        return mockTeas.slice(7, 10);
    },

    /* Notes */
    createNote: async (notes: string, teaId: string): Promise<Note> => {
        if (notes.startsWith("error")) {
            return Promise.reject(Error("Artificial error."));
        }
        return {
            id: "0",
            notes: notes
        };
    },
    updateNote: async (note: Note): Promise<Note> => {
        if (note.notes.startsWith("error")) {
            return Promise.reject(Error("Artificial error."));
        }
        return note;
    },

    /* Matches */
    createMatch: async (loserId: string, winnerId: string): Promise<Match> => {
        if (loserId.startsWith("error") || winnerId.startsWith("error")) {
            return Promise.reject(Error("Artificial error."));
        }
        return {
            id: "0",
            rankChange: 0,
            date: ""
        }
    },
    listMatches:(winner?: boolean, loser?: boolean, user?: boolean): Promise<Match[]> => {
        return Promise.reject(Error("Unimplemented"));
    },
    listMatchesForTea:(teaId: string, winner?: boolean, loser?: boolean, user?: boolean): Promise<Match[]> => {
        return Promise.reject(Error("Unimplemented"));
    },

    /* Rankings */
    listGlobalRanks: async (tea?: boolean): Promise<GlobalRank[]> => {
        return Promise.reject(Error("Unimplemented"));
    },
    listLocalRanks:(tea?: boolean, user?: boolean): Promise<LocalRank[]> => {
        return Promise.reject(Error("Unimplemented"));
    }
}