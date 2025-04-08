import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BaseLayout } from "@/components/base-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { PackageManagerProvider } from "@/components/package-manager/package-manager-context";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} h-dvh flex flex-col antialiased bg-background overflow-y-auto`}
            >
                <SidebarProvider defaultOpen={false}>
                    <PackageManagerProvider>
                        <BaseLayout>
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="system"
                                enableSystem
                                disableTransitionOnChange
                            >
                                <div className="flex justify-center w-full">
                                    {children}
                                </div>
                            </ThemeProvider>
                        </BaseLayout>
                    </PackageManagerProvider>
                </SidebarProvider>
            </body>
        </html>
    );
}
