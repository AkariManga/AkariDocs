"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { PackageManagerSelector } from "./package-manager/package-manager-selector";
import { AlignLeft, Package, HelpCircle, Github, Globe } from "lucide-react";

// Custom hook to track active tab
function useActiveTab() {
    const [activeTabId, setActiveTabId] = useState<string | null>(null);

    useEffect(() => {
        // Initial detection of active tab
        const detectActiveTab = () => {
            const activeTabContent = document.querySelector(
                '[class*="animate-tab-fade-in"]'
            );
            if (activeTabContent) {
                // We'll use a data attribute to identify which tab is active
                const parentTabContent = activeTabContent.closest("[id]");
                if (parentTabContent && parentTabContent.id) {
                    setActiveTabId(parentTabContent.id);
                }
            }
        };

        detectActiveTab();

        // Observer for tab changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "childList" ||
                    mutation.type === "attributes"
                ) {
                    detectActiveTab();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return activeTabId;
}

export function DocSidebar({ title }: { title: string }) {
    const [headings, setHeadings] = useState<
        { id: string; text: string; level: number; element: Element }[]
    >([]);
    const [activeElement, setActiveElement] = useState<Element | null>(null);
    const activeTabId = useActiveTab();

    // Add a ref to track if we're manually scrolling
    const isManualScrollRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleScrollToTop = () => {
        isManualScrollRef.current = true;
        document.getElementById("doc-header")?.scrollIntoView({
            behavior: "smooth",
        });

        setActiveElement(null);
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            isManualScrollRef.current = false;
        }, 1000);
    };

    // Find all headings in the document when component mounts or tab changes
    useEffect(() => {
        // Reset active heading when tab changes
        setActiveElement(null);

        const findHeadings = () => {
            // Always get all headings in the document, regardless of active tab
            const headingElements = document.querySelectorAll("h1, h2, h3");

            const headingsData = Array.from(headingElements)
                .filter((el) => el.id) // Only include headings that have IDs
                .map((el) => ({
                    id: el.id,
                    text: el.textContent || "",
                    level: parseInt(el.tagName.charAt(1)),
                    element: el,
                }));

            setHeadings(headingsData);

            return headingElements;
        };

        // Initial heading detection
        const headingElements = findHeadings();

        // Set up intersection observer to detect active heading
        const observer = new IntersectionObserver(
            (entries) => {
                // Only update active ID if we're not in manual scroll mode
                if (!isManualScrollRef.current) {
                    const intersectingEntries = entries.filter(
                        (entry) => entry.isIntersecting
                    );
                    if (intersectingEntries.length > 0) {
                        const mostVisible = intersectingEntries.reduce(
                            (prev, current) =>
                                prev.intersectionRatio >
                                current.intersectionRatio
                                    ? prev
                                    : current
                        );
                        setActiveElement(mostVisible.target);
                    }
                }
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        headingElements.forEach((heading) => {
            if (heading.id) {
                observer.observe(heading);
            }
        });

        // Also set up a mutation observer to detect when tab content changes
        const contentObserver = new MutationObserver((mutations) => {
            // Check if any mutations affect the visibility of headings
            const shouldRefreshHeadings = mutations.some((mutation) => {
                return (
                    mutation.type === "childList" ||
                    (mutation.type === "attributes" &&
                        mutation.attributeName === "class" &&
                        mutation.target.nodeType === Node.ELEMENT_NODE &&
                        (mutation.target as Element).classList.contains(
                            "animate-tab-fade-in"
                        ))
                );
            });

            if (shouldRefreshHeadings) {
                // Clean up old observers
                headingElements.forEach((el) => {
                    if (el.id) observer.unobserve(el);
                });

                // Find new headings
                const newHeadingElements = findHeadings();

                // Observe new headings
                newHeadingElements.forEach((el) => {
                    if (el.id) observer.observe(el);
                });
            }
        });

        contentObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            headingElements.forEach((heading) => {
                if (heading.id) {
                    observer.unobserve(heading);
                }
            });
            contentObserver.disconnect();
        };
    }, [activeTabId]);

    // Handle manual scroll to a heading
    const handleScrollToHeading = (index: number) => {
        const heading = headings[index];
        if (!heading) return;

        // Set manual scroll mode
        isManualScrollRef.current = true;

        // Immediately set active element for UX
        setActiveElement(heading.element);

        // Scroll to element
        heading.element.scrollIntoView({
            behavior: "smooth",
        });

        // Reset manual scroll mode after scroll animation completes (approximately 1s)
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            isManualScrollRef.current = false;
        }, 1000);
    };

    return (
        <div className="w-[280px] flex-shrink-0 hidden lg:block ml-10">
            <div className="sticky top-8">
                <div className="space-y-4">
                    {/* Table of Contents */}
                    {headings.length > 0 && (
                        <div className="rounded-xl border border-border overflow-hidden">
                            <div className="bg-muted/30 px-4 py-3 border-b border-border">
                                <h4 className="text-sm font-medium flex items-center">
                                    <AlignLeft className="h-4 w-4 mr-2 text-positive" />
                                    On this page
                                </h4>
                            </div>
                            <nav className="p-1">
                                <ul className="space-y-0.5 max-h-100 overflow-y-auto">
                                    {/* Title as top link */}
                                    <li>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleScrollToTop();
                                            }}
                                            className={`group flex items-center py-1.5 px-3 rounded-md font-medium ${
                                                activeElement === null
                                                    ? "text-positive bg-positive/5"
                                                    : "text-foreground hover:bg-muted/50"
                                            } transition-colors`}
                                        >
                                            {activeElement === null && (
                                                <div className="w-1 h-1 rounded-full bg-positive mr-2"></div>
                                            )}
                                            <span className="truncate text-sm">
                                                {title}
                                            </span>
                                        </a>
                                    </li>

                                    {/* Regular headings */}
                                    {headings.map((heading, i) => (
                                        <li key={i}>
                                            <a
                                                href={`#${heading.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleScrollToHeading(i);
                                                }}
                                                className={`group flex items-center py-1.5 px-3 rounded-md ${
                                                    heading.level === 1
                                                        ? ""
                                                        : heading.level === 2
                                                        ? "ml-2"
                                                        : "ml-4"
                                                } ${
                                                    activeElement ===
                                                    heading.element
                                                        ? "text-positive bg-positive/5"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                } transition-colors`}
                                            >
                                                {activeElement ===
                                                    heading.element && (
                                                    <div className="w-1 h-1 rounded-full bg-positive mr-2"></div>
                                                )}
                                                <span className="truncate text-sm">
                                                    {heading.text}
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}

                    {/* Package Manager Selection */}
                    <div className="rounded-xl border border-border overflow-hidden">
                        <div className="bg-muted/30 px-4 py-3 border-b border-border">
                            <h4 className="text-sm font-medium flex items-center">
                                <Package className="h-4 w-4 mr-2 text-positive" />
                                Package Manager
                            </h4>
                        </div>
                        <div className="p-4">
                            <PackageManagerSelector />
                            <p className="text-xs text-muted-foreground mt-2">
                                Code examples will adapt to your selection
                            </p>
                        </div>
                    </div>

                    {/* Help Links - Fixed structure */}
                    <div className="border border-border hover:border-positive transition-colors rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-16 h-16 bg-positive/10 rounded-full blur-xl opacity-70"></div>

                        <div className="w-8 h-8 bg-positive/10 rounded-lg flex items-center justify-center mb-3">
                            <HelpCircle className="h-4 w-4 text-positive" />
                        </div>

                        <h4 className="text-md font-semibold mb-1">
                            Need help?
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                            Have questions or found an issue?
                        </p>

                        <div className="space-y-2 mt-3">
                            <Link
                                href="https://github.com/sn0w12/Akari/issues"
                                target="_blank"
                                rel="noopener"
                                className="flex items-center text-sm text-positive hover:underline"
                            >
                                <Github className="h-3.5 w-3.5 mr-1.5" />
                                Open an issue
                            </Link>
                            <Link
                                href="https://akarimanga.dpdns.org/"
                                target="_blank"
                                rel="noopener"
                                className="flex items-center text-sm text-positive hover:underline"
                            >
                                <Globe className="h-3.5 w-3.5 mr-1.5" />
                                Visit Akari App
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
