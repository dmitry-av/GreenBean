export interface AccountResponse {
    user: {
        id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        is_active: boolean;
    };
    access: string;
    refresh: string;
}