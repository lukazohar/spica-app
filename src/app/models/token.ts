export interface Token {
    readonly access_token: string;
    readonly expires_in: number;
    readonly token_type: string;
    readonly scope: string;
}
