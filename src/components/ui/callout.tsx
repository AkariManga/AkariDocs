import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

type CalloutType = "info" | "warning" | "error" | "success";

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const icons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
};

const styles = {
    info: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
    warning:
        "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900",
    error: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900",
    success:
        "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900",
};

export function Callout({
    type = "info",
    title,
    children,
    className,
}: CalloutProps) {
    return (
        <div
            className={cn(
                "my-6 rounded-lg border p-4",
                styles[type],
                className
            )}
        >
            <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">{icons[type]}</div>
                <div>
                    {title && (
                        <h4 className="text-sm font-medium mb-1">{title}</h4>
                    )}
                    <div className="text-sm">{children}</div>
                </div>
            </div>
        </div>
    );
}
