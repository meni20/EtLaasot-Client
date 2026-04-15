import { createContext, useContext } from "react";

export interface IAuthContext {
    user: { userId: string; name: string; roles: { role: string; roleId: number; branchId: string; branchName: string }[]; activeBranch: string } | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (userId: string, captchaToken: string) => Promise<void>;
    logout: () => void;
    isSuperAdmin: boolean;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
