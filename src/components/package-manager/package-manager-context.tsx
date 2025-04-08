"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

export type PackageManager = "npm" | "yarn" | "pnpm";

interface PackageManagerContextType {
    packageManager: PackageManager;
    setPackageManager: (pm: PackageManager) => void;
}

const PackageManagerContext = createContext<
    PackageManagerContextType | undefined
>(undefined);

export function PackageManagerProvider({ children }: { children: ReactNode }) {
    // Get initial value from localStorage if available (client-side only)
    const [packageManager, setPackageManagerState] =
        useState<PackageManager>("npm");

    // Initialize from localStorage when mounted
    React.useEffect(() => {
        const storedPM = localStorage.getItem("preferredPackageManager");
        if (
            storedPM &&
            (storedPM === "npm" || storedPM === "yarn" || storedPM === "pnpm")
        ) {
            setPackageManagerState(storedPM);
        }
    }, []);

    // Set and persist package manager choice
    const setPackageManager = (pm: PackageManager) => {
        setPackageManagerState(pm);
        localStorage.setItem("preferredPackageManager", pm);
    };

    return (
        <PackageManagerContext.Provider
            value={{ packageManager, setPackageManager }}
        >
            {children}
        </PackageManagerContext.Provider>
    );
}

export function usePackageManager() {
    const context = useContext(PackageManagerContext);
    if (context === undefined) {
        throw new Error(
            "usePackageManager must be used within a PackageManagerProvider"
        );
    }
    return context;
}
