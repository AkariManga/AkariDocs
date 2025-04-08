"use client";

import React, { useState, createContext, useContext, ReactNode } from "react";

interface TabsContextType {
    activeTab: string | undefined;
    setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({
    children,
    defaultTab,
}: {
    children: ReactNode;
    defaultTab?: string;
}) {
    // Find the first tab's ID to use as default if none specified
    const firstChild = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && child.type === Tab
    );
    const firstTabId = React.isValidElement(firstChild)
        ? (firstChild as React.ReactElement<{ id: string }>).props.id
        : undefined;

    const [activeTab, setActiveTab] = useState(defaultTab || firstTabId);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className="mt-6 mb-8">{children}</div>
        </TabsContext.Provider>
    );
}

export function TabList({ children }: { children: ReactNode }) {
    return (
        <div className="flex border-b border-border relative overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2">{children}</div>
        </div>
    );
}

export function TabTrigger({
    children,
    id,
}: {
    children: ReactNode;
    id: string;
}) {
    const tabsContext = useContext(TabsContext);
    if (!tabsContext) throw new Error("TabTrigger must be used within Tabs");

    const { activeTab, setActiveTab } = tabsContext;
    const isActive = activeTab === id;

    return (
        <button
            className={`px-4 py-3 text-sm font-medium relative ${
                isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
            }`}
            onClick={() => setActiveTab(id)}
        >
            {children}
            {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-positive transition-all duration-300" />
            )}
        </button>
    );
}

export function TabContent({
    children,
    id,
}: {
    children: ReactNode;
    id: string;
}) {
    const tabsContext = useContext(TabsContext);
    if (!tabsContext) throw new Error("TabContent must be used within Tabs");

    const { activeTab } = tabsContext;

    if (activeTab !== id) return null;

    return (
        <div className="py-2 animate-tab-fade-in" id={id} data-tab-id={id}>
            {children}
        </div>
    );
}

export function Tab({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    title,
}: {
    children: ReactNode;
    id: string;
    title: string;
}) {
    // This is a convenience component that combines TabTrigger and TabContent
    // It's used internally by the MDX components
    return null;
}
