export type Team = {
    id: number;
    name: string;
    description: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
};

export type TeamMember = {
    id: number;
    team_id: number;
    user_id: number;
    role: 'leader' | 'member';
};
