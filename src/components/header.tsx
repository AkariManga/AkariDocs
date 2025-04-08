"use client";

import { useEffect, useState } from "react";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";
import SearchBar from "./search/search-bar";

export function Header() {
    const pathname = usePathname();
    const [segments, setSegments] = useState<string[]>([]);
    const { state: sidebarState } = useSidebar();
    const isSidebarCollapsed = sidebarState === "collapsed";

    useEffect(() => {
        const pathSegments = pathname.split("/").filter(Boolean);
        if (pathSegments.length === 0) {
            pathSegments.push("home");
        }

        setSegments(pathSegments);
    }, [pathname]);

    const getSegmentDisplayName = (
        segment: string,
        index: number,
        segments: string[],
        maxLength: number = 35
    ) => {
        segment = segment.replace(/-s-/g, "'s ");
        segment = segment.replace(/-/g, " ");

        const capitalizedSegment =
            segment.charAt(0).toUpperCase() + segment.slice(1);

        return capitalizedSegment.length > maxLength
            ? `${capitalizedSegment.substring(0, maxLength)}...`
            : capitalizedSegment;
    };

    return (
        <header className="fixed top-0 left-0 right-0 md:sticky z-50 bg-sidebar border-b md:border-b-0">
            <div className="py-1 pr-4 md:pr-11 pl-11 mx-auto flex items-center justify-between">
                <SidebarTrigger className="absolute left-4 md:left-2" />
                <div
                    className={`hidden md:block flex h-full items-center pr-2 transition-all pl-4 ${
                        isSidebarCollapsed ? "md:pl-3" : "md:pl-2"
                    }`}
                >
                    <Breadcrumb>
                        <BreadcrumbList>
                            {segments.map((segment, index) => (
                                <React.Fragment key={index}>
                                    {index != 0 && <BreadcrumbSeparator />}
                                    <BreadcrumbItem>
                                        {index != 0 ? (
                                            <BreadcrumbLink
                                                href={`/${segments
                                                    .slice(0, index + 1)
                                                    .join("/")}`}
                                            >
                                                {getSegmentDisplayName(
                                                    segment,
                                                    index,
                                                    segments
                                                )}
                                            </BreadcrumbLink>
                                        ) : (
                                            <span>
                                                {getSegmentDisplayName(
                                                    segment,
                                                    index,
                                                    segments
                                                )}
                                            </span>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex items-center flex-grow justify-end">
                    <SearchBar />
                </div>
            </div>
        </header>
    );
}
