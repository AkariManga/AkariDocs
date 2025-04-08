"use client";

import React from "react";
import { usePackageManager, PackageManager } from "./package-manager-context";

export function PackageManagerSelector() {
    const { packageManager, setPackageManager } = usePackageManager();
    const options = ["npm", "yarn", "pnpm"];

    return (
        <div className="inline-flex items-center rounded-lg border border-border p-1 bg-muted/40 w-full">
            {options.map((pm) => (
                <button
                    key={pm}
                    onClick={() => setPackageManager(pm as PackageManager)}
                    className={`flex-1 px-3 py-1.5 rounded-md text-sm transition-all ${
                        packageManager === pm
                            ? "bg-positive text-primary-foreground font-medium shadow-sm"
                            : "text-foreground hover:bg-muted"
                    }`}
                    aria-pressed={packageManager === pm}
                >
                    {pm}
                </button>
            ))}
        </div>
    );
}
