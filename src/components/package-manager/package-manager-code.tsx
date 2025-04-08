"use client";

import React from "react";
import { usePackageManager } from "./package-manager-context";
import { Code } from "../ui/code";

interface PackageManagerCodeProps {
    npm: string;
    yarn: string;
    pnpm: string;
}

export function PackageManagerCode({
    npm,
    yarn,
    pnpm,
}: PackageManagerCodeProps) {
    const { packageManager } = usePackageManager();

    const commands = {
        npm,
        yarn,
        pnpm,
    };

    const content = commands[packageManager].split("\\n").join("\n");

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">
                    Using {packageManager}
                </div>
            </div>
            <Code language="bash" variant="numbered">
                {content}
            </Code>
        </div>
    );
}
