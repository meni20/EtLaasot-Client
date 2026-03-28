import { createContext, useContext } from "react";

export interface IBranchContext {
    activeBranch: string | null;
    availableBranches: { id: string; name: string }[];
    switchBranch: (branchId: string) => void;
    isSuperAdmin: boolean;
}

export const BranchContext = createContext<IBranchContext | null>(null);

export const useBranch = () => {
    const context = useContext(BranchContext);
    if (!context) {
        throw new Error("useBranch must be used within a BranchProvider");
    }
    return context;
};
