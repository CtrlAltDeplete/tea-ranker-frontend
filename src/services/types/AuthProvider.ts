export type AuthProvider = {
    name: string
    authURL: string
    state: string
    codeVerifier: string
}