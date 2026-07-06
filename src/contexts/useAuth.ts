import { createContext, useContext } from "react";

export interface IAuthContext {
    user: {
        userId: string;
        name: string;
        nationalIdLast4?: string | null;
        nationalIdMasked?: string | null;
        roles: { role: string; roleId: number; branchId: string; branchName: string }[];
        activeBranch: string;
        mustChangePassword?: boolean;
    } | null;
    token: string | null;
    isAuthenticated: boolean;
    mustChangePassword: boolean;
    loading: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    changePassword: (payload: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => Promise<void>;
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
