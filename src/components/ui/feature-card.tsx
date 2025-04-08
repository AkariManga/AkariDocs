import React from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
}

export function FeatureCard({
    title,
    description,
    icon,
    className,
}: FeatureCardProps) {
    return (
        <div
            className={cn(
                "relative rounded-xl border border-border bg-card p-6 transition-all hover:border-positive/50 hover:shadow-sm",
                className
            )}
        >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                {icon}
            </div>
            <h3 className="mb-2 text-xl font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

export function FeatureGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 my-8">
            {children}
        </div>
    );
}
