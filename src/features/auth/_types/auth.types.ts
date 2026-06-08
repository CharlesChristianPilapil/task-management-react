export type UserRole = 'admin' | 'manager' | 'team_member';

export type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    is_active: boolean;
};

export type AuthTokens = {
    access_token: string;
    token_type: string;
    expires_in: number;
};
