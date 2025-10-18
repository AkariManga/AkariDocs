"use client";

import { Header } from "./header";
import { HomeIcon, CodeIcon } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuLink,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";

export function BaseLayout({
    children,
    gutter,
}: {
    children: React.ReactNode;
    gutter?: boolean;
}) {
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

                            <SidebarMenuItem>
                                <SidebarMenuLink
                                    tooltip="API"
                                    href="/api/latest"
                                >
                                    <CodeIcon />
                                    <span>API</span>
                                </SidebarMenuLink>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>
                <main
                    className="bg-background flex-1 flex flex-col md:border-t md:rounded-tl-xl md:border-l md:overflow-y-auto px-4"
                    style={{ scrollbarGutter: gutter ? "stable" : "auto" }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
