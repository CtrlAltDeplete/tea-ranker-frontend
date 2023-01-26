import PocketBase, {AuthProviderInfo, Record, RecordAuthResponse} from 'pocketbase';

import {Backend} from "./Backend";
import {Tea} from "../types/Tea";
import {GlobalRank} from "../types/GlobalRank";
import {LocalRank} from "../types/LocalRank";
import {Note} from "../types/Note";
import {Tag} from "../types/Tag";
import {User} from "../types/User";
import {AuthResponse} from "../types/AuthResponse";
import {Match} from "../types/Match";
import {AuthProvider} from "../types/AuthProvider";

const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);

function authProviderFromAuthProviderInfo(authProviderInfo: AuthProviderInfo): AuthProvider {
    return {
        name: authProviderInfo.name,
        authURL: authProviderInfo.authUrl,
        state: authProviderInfo.state,
        codeVerifier: authProviderInfo.codeVerifier
    };
}

function globalRankFromRecord(record: Record): GlobalRank {
    const globalRank: GlobalRank = {
        id: record.id,
        rank: record['rank']
    };
    if (record.expand !== undefined) {
        globalRank.expand = {};
        if (record.expand['teas(global_rank)'] !== undefined) {
            const teas = record.expand['teas(global_rank)'].map((teaRecord: Record) => {
                return teaFromRecord(teaRecord);
            });
            globalRank.expand.tea = teas[0];
        }
    }
    return globalRank;
}

function localRankFromRecord(record: Record): LocalRank {
    const localRank: LocalRank = {
        id: record.id,
        rank: record['rank']
    };
    if (record.expand !== undefined) {
        localRank.expand = {};
        if (record.expand['user'] !== undefined) {
            localRank.expand.user = userFromRecord(record.expand['user'] as Record);
        }
        if (record.expand['tea'] !== undefined) {
            localRank.expand.tea = teaFromRecord(record.expand['tea'] as Record);
        }
    }
    return localRank;
}

function matchFromRecord(record: Record): Match {
    const match: Match = {
        id: record.id,
        rankChange: record['rank_change'],
        date: record.created
    }
    if (record.expand !== undefined) {
        match.expand = {};
        if (record.expand['user'] !== undefined) {
            match.expand.user = userFromRecord(record.expand['user'] as Record);
        }
        if (record.expand['winner'] !== undefined) {
            match.expand.winner = teaFromRecord(record.expand['winner'] as Record);
        }
        if (record.expand['loser'] !== undefined) {
            match.expand.loser = teaFromRecord(record.expand['loser'] as Record);
        }
    }
    return match;
}

function noteFromRecord(record: Record): Note {
    const note: Note = {
        id: record.id,
        notes: record['notes']
    };
    if (record.expand !== undefined) {
        note.expand = {};
        if (record.expand['user'] !== undefined) {
            note.expand.user = userFromRecord(record.expand['user'] as Record);
        }
        if (record.expand['tea'] !== undefined) {
            note.expand.tea = teaFromRecord(record.expand['tea'] as Record);
        }
    }
    return note;
}

function tagFromRecord(record: Record): Tag {
    const tag: Tag = {
        id: record.id,
        name: record.name
    };
    if (record.expand !== undefined) {
        tag.expand = {};
        if (record.expand['tea_to_tag(tag)'] !== undefined) {
            let teaToTagRecords = record.expand['tea_to_tag(tag)'] as Record[];
            let teas = Array<Tea>();
            teaToTagRecords.forEach((teaToTagRecord) => {
                if (teaToTagRecord.expand !== undefined && teaToTagRecord.expand['tea'] !== undefined) {
                    teas.push(teaFromRecord(teaToTagRecord.expand['tea'] as Record));
                }
            });

            tag.expand.teas = teas;
        }
    }
    return tag;
}

function teaFromRecord(record: Record): Tea {
    const tea: Tea = {
        id: record.id,
        name: record['name'],
        description: record['description']
    };
    if (record.expand !== undefined) {
        tea.expand = {};
        if (record.expand['tea_to_tag(tea)'] !== undefined) {
            let teaToTagRecords = record.expand['tea_to_tag(tea)'] as Record[];
            let tags = Array<Tag>();
            teaToTagRecords.forEach((teaToTagRecord) => {
                if (teaToTagRecord.expand !== undefined && teaToTagRecord.expand['tag'] !== undefined) {
                    tags.push(tagFromRecord(teaToTagRecord.expand['tag'] as Record));
                }
            });

            tea.expand.tags = tags;
        }
        if (record.expand['global_rank'] !== undefined) {
            tea.expand.globalRank = globalRankFromRecord(record.expand['global_rank'] as Record);
        }
        if (record.expand['local_ranks(tea)'] !== undefined) {
            const localRanks = record.expand['local_ranks(tea)'] as Record[];
            if (localRanks.length > 0) {
                tea.expand.localRank = localRankFromRecord(localRanks[0]);
            }
        }
        if (record.expand['notes(tea)'] !== undefined) {
            const notes = record.expand['notes(tea)'] as Record[];
            if (notes.length > 0) {
                tea.expand.notes = noteFromRecord(notes[0]);
            }
        }
    }
    return tea;
}

function userFromRecord(record: Record): User {
    return {
        id: record.id,
        username: record['username']
    };
}

const redirectUrl = 'http://127.0.0.1:3000/redirect';
let discordProvider: AuthProvider | undefined = undefined;

export const pocketBaseBackend: Backend = {
    /* Authentication */
    getDiscordProvider: async (): Promise<AuthProvider> => {
        if (discordProvider === undefined) {
            const providerString = localStorage.getItem("provider");
            const providerJSON = JSON.parse(providerString ? providerString : "");
            if (providerJSON.hasOwnProperty("name") &&
                providerJSON.hasOwnProperty("authURL") &&
                providerJSON.hasOwnProperty("state") &&
                providerJSON.hasOwnProperty("codeVerifier")) {
                discordProvider = providerJSON as AuthProvider;
                return discordProvider;
            }

            const authMethods = await pb.collection('users').listAuthMethods();
            for (let provider of authMethods.authProviders) {
                if (provider.name === 'discord') {
                    discordProvider = {
                        name: provider.name,
                        authURL: provider.authUrl + redirectUrl,
                        state: provider.state,
                        codeVerifier: provider.codeVerifier
                    };
                    localStorage.setItem('provider', JSON.stringify(discordProvider));
                    return discordProvider;
                }
            }
        } else {
            return discordProvider;
        }

        return Promise.reject(Error("Unable to load discord provider."));
    },
    finishDiscordSignIn: async (state: string, code: string): Promise<AuthResponse> => {
        const providerString = localStorage.getItem('provider');
        const provider = JSON.parse(providerString === null ? "" : providerString);

        if (provider.state !== state) {
            return Promise.reject(Error('state mismatch'));
        }

        return pb.collection('users').authWithOAuth2(
            provider.name,
            code,
            provider.codeVerifier,
            redirectUrl
        ).then((response: RecordAuthResponse) => {
            return {
                user: userFromRecord(response.record),
                token: response.token,
                meta: response.meta
            };
        });
    },
    signOut: (): void => {
        pb.authStore.clear();
    },
    signedIn: (): boolean => {
        return pb.authStore.isValid;
    },
    onAuthChange: (callback: () => void): () => void => {
        return pb.authStore.onChange(callback);
    },

    /* Teas */
    listTeas: async (tags: boolean = false, globalRank: boolean = false, localRank: boolean = false, notes: boolean = false): Promise<Tea[]> => {
        const expand = Array<string>();
        if (tags) {
            expand.push('tea_to_tag(tea).tag');
        }
        if (globalRank) {
            expand.push('global_rank');
        }
        if (localRank) {
            expand.push('local_ranks(tea)');
        }
        if (notes) {
            expand.push('notes(tea)')
        }

        const queryParams = {
            sort: '-created,id',
            expand: expand.length === 0 ? undefined : expand.join(','),
        };

        return pb.collection('teas').getFullList(200, queryParams).then((teaRecords: Record[]) => {
            return teaRecords.map((teaRecord: Record) => {
                return teaFromRecord(teaRecord);
            });
        });
    },
    viewTea: async (id: string, tags: boolean = false, globalRank: boolean = false, localRank: boolean = false, notes: boolean = false): Promise<Tea> => {
        const expand = Array<string>();
        if (tags) {
            expand.push('tea_to_tag(tea).tag');
        }
        if (globalRank) {
            expand.push('global_rank');
        }
        if (localRank) {
            expand.push('local_ranks(tea)');
        }
        if (notes) {
            expand.push('notes(tea)')
        }

        const queryParams = {
            expand: expand.length === 0 ? undefined : expand.join(','),
        };

        return pb.collection('teas').getOne(id, queryParams).then((record: Record) => {
            return teaFromRecord(record);
        });
    },
    founderFavoriteTeas: async (): Promise<Tea[]> => {
        return pb.send('/api/founder_favorites', {});
    },

    /* Notes */
    createNote: async (notes: string, teaId: string): Promise<Note> => {
        const data = {
            user: pb.authStore.model?.id,
            notes: notes,
            tea: teaId
        };

        return pb.collection('notes').create(data).then((record: Record) => {
            return noteFromRecord(record);
        });
    },
    updateNote: async (note: Note): Promise<Note> => {
        const data = {
            user: pb.authStore.model?.id,
            notes: note.notes
        };

        return pb.collection('notes').update(note.id, data).then((record: Record) => {
            return noteFromRecord(record);
        });
    },

    /* Matches */
    createMatch: async (loserId: string, winnerId: string): Promise<Match> => {
        const data = {
            user: pb.authStore.model?.id,
            loser: loserId,
            winner: winnerId
        };

        return pb.collection('matches').create(data).then((record: Record) => {
            return matchFromRecord(record);
        });
    },
    listMatches: async (winner?: boolean, loser?: boolean, user?: boolean) => {
        const expand = Array<string>();
        if (winner) {
            expand.push('winner');
        }
        if (loser) {
            expand.push('loser');
        }
        if (user) {
            expand.push('user');
        }

        const queryParams = {
            sort: '-created,id',
            expand: expand.length === 0 ? undefined : expand.join(',')
        };

        return pb.collection('matches').getFullList(200, queryParams).then((matches: Record[]) => {
            return matches.map((matchRecord: Record) => {
                return matchFromRecord(matchRecord);
            });
        });
    },

    /* Rankings */
    listGlobalRanks: async (tea?: boolean): Promise<GlobalRank[]> => {
        const expand = Array<string>();
        if (tea) {
            expand.push('teas(global_rank)');
        }

        const queryParams = {
            sort: '-rank,id',
            expand: expand.length === 0 ? undefined : expand.join(','),
        };

        return pb.collection('global_ranks').getFullList(200, queryParams).then((ranks: Record[]) => {
            return ranks.map((rankRecord: Record) => {
                return globalRankFromRecord(rankRecord);
            });
        });
    },
    listLocalRanks: (tea?: boolean, user?: boolean): Promise<LocalRank[]> => {
        const expand = Array<string>();
        if (tea) {
            expand.push('tea');
        }
        if (user) {
            expand.push('user');
        }

        const queryParams = {
            sort: '-rank,id',
            expand: expand.length === 0 ? undefined : expand.join(','),
        };

        return pb.collection('local_ranks').getFullList(200, queryParams).then((ranks: Record[]) => {
            return ranks.map((rankRecord: Record) => {
                return localRankFromRecord(rankRecord);
            });
        });
    }
}