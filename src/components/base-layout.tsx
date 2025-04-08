"use client";

import { Header } from "./header";
import { CodeIcon, HomeIcon, RocketIcon } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuLink,
    SidebarMenuItem,
    SidebarSection,
    useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";

export function BaseLayout({
    children,
    gutter,
}: {
    children: React.ReactNode;
    gutter?: boolean;
}) {
    const { state: sidebarState } = useSidebar();
    const isSidebarCollapsed = sidebarState === "collapsed";

    const introductionItems = [
        { name: "Getting Started", id: "getting-started" },
        { name: "Features", id: "features" },
        { name: "Settings", id: "settings" },
    ];

    const apiItems = [{ name: "API Overview", id: "api" }];

    return (
        <div className="flex flex-col w-full md:overflow-hidden">
            <Header />
            <div className="bg-sidebar flex flex-1 mt-12 md:mt-0 md:overflow-y-auto">
                <Sidebar collapsible="icon">
                    <SidebarContent data-scrollbar-custom="true">
                        <SidebarMenu className="p-2 pt-3">
                            <Separator className="hidden md:block" />

                            <SidebarMenuItem>
                                <SidebarMenuLink tooltip="Home" href="/">
                                    <HomeIcon />
                                    <span>Home</span>
                                </SidebarMenuLink>
                            </SidebarMenuItem>

                            <SidebarSection
                                title={"Introduction"}
                                icon={<RocketIcon />}
                                items={introductionItems}
                                isSidebarCollapsed={isSidebarCollapsed}
                                basePath="/docs"
                                isActive={false}
                                onNavigate={() => {}}
                                isItemActive={() => false}
                            />

                            <SidebarSection
                                title={"Api"}
                                icon={<CodeIcon />}
                                items={apiItems}
                                isSidebarCollapsed={isSidebarCollapsed}
                                basePath="/docs"
                                isActive={false}
                                onNavigate={() => {}}
                                isItemActive={() => false}
                            />
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>
                <main
                    className="bg-background flex-1 flex flex-col md:border-t md:rounded-tl-xl md:border-l md:overflow-y-auto"
                    style={{ scrollbarGutter: gutter ? "stable" : "auto" }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
