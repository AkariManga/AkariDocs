"use client";

import React from "react";

interface DocHeaderProps {
    title: string;
}

export function DocHeader({ title }: DocHeaderProps) {
    return (
        <div className="mb-4" id="doc-header">
            {/* Title display */}
            <h1 className="text-3xl font-bold tracking-tight mb-1">{title}</h1>
            <div className="h-1 w-20 bg-gradient-to-r from-positive to-positive/50 rounded-full"></div>
        </div>
    );
}
