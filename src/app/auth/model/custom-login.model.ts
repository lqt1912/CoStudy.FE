
export interface LoginResult {
    id: string;
    email: string;
    role: string;
    created: Date;
    updated?: any;
    isVerified: boolean;
    jwtToken: string;
}

