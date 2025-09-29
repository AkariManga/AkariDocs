import Link from "next/link";
import pkg from "../../package.json";

export function Home() {
    const version = pkg.version;

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with diagonal design element */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-background to-muted -z-10"></div>
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-positive/5"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-positive/3 blur-3xl rounded-full transform translate-x-1/2"></div>
                </div>

                <div className="container mx-auto px-4 pt-20 pb-32 text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-1 mb-8 bg-muted rounded-full">
                        <span className="px-3 py-1 text-xs font-medium text-foreground">
                            Documentation
                        </span>
                        <span className="px-3 py-1 text-xs font-medium bg-background text-foreground rounded-full">
                            v{version}
                        </span>
                    </div>

                    <h1 className="text-6xl font-bold mb-6 text-foreground">
                        <span className="text-positive">灯</span> - Akari
                    </h1>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <span className="px-3 py-1 bg-positive text-primary-foreground text-xs font-medium rounded-full">
                            Next.js 15
                        </span>
                        <span className="px-3 py-1 border border-border text-foreground text-xs font-medium rounded-full">
                            React 19
                        </span>
                        <span className="px-3 py-1 border border-border text-foreground text-xs font-medium rounded-full">
                            TailwindCSS
                        </span>
                    </div>

                    <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
                        An enhanced manga reading experience with a clean,
                        minimalist interface and powerful features for Manganato
                        users.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/getting-started"
                            className="px-7 py-3 bg-positive hover:bg-opacity-90 text-primary-foreground font-medium rounded-lg transition-all"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="https://github.com/sn0w12/Akari"
                            target="_blank"
                            rel="noopener"
                            className="px-7 py-3 bg-secondary hover:bg-opacity-90 text-secondary-foreground font-medium rounded-lg transition-all border border-border"
                        >
                            <span className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                GitHub
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
            </div>

            {/* Main Features with offset grid */}
            <div className="container mx-auto px-4 py-24">
                <div className="flex flex-col md:flex-row items-start gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-10">
                            <span className="text-positive font-medium text-sm tracking-wider uppercase">
                                Features
                            </span>
                            <h2 className="text-4xl font-bold mt-2 mb-6 text-foreground">
                                What makes Akari different?
                            </h2>
                            <p className="text-muted-foreground">
                                An elegant reading experience designed for manga
                                enthusiasts who value simplicity and
                                functionality.
                            </p>

                            <div className="mt-10">
                                <Link
                                    href="/features"
                                    className="inline-flex items-center text-positive hover:underline font-medium"
                                >
                                    View all features
                                    <svg
                                        className="ml-2 w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        ></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Feature 1 */}
                        <div className="border border-border rounded-xl p-6 hover:border-positive transition-colors">
                            <div className="w-12 h-12 bg-positive/10 rounded-lg flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-positive"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">
                                Enhanced Reader
                            </h3>
                            <p className="text-muted-foreground">
                                Clean, distraction-free reading with support for
                                both manga and manhwa view modes.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="border border-border rounded-xl p-6 hover:border-positive transition-colors mt-0 md:mt-12">
                            <div className="w-12 h-12 bg-positive/10 rounded-lg flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-positive"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">
                                Bookmark Sync
                            </h3>
                            <p className="text-muted-foreground">
                                Seamless synchronization with your Manganato and
                                MyAnimeList accounts.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="border border-border rounded-xl p-6 hover:border-positive transition-colors mb-0 md:mb-12">
                            <div className="w-12 h-12 bg-positive/10 rounded-lg flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-positive"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">
                                Customization
                            </h3>
                            <p className="text-muted-foreground">
                                Personalize your reading experience with themes
                                and adjustable settings.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="border border-border rounded-xl p-6 hover:border-positive transition-colors mt-0 md:mt-0">
                            <div className="w-12 h-12 bg-positive/10 rounded-lg flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-positive"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">
                                Responsive Design
                            </h3>
                            <p className="text-muted-foreground">
                                Perfectly optimized for both desktop and mobile
                                reading experiences.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documentation Section with asymmetrical layout */}
            <div className="py-24 relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                <div className="absolute right-0 top-1/4 -translate-y-1/2 w-64 h-64 bg-positive/5 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-lg mb-16">
                        <span className="text-positive font-medium text-sm tracking-wider uppercase">
                            Documentation
                        </span>
                        <h2 className="text-4xl font-bold mt-2 mb-6 text-foreground">
                            Everything you need to know
                        </h2>
                        <p className="text-muted-foreground">
                            Comprehensive guides to help you get the most out of
                            Akari.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Doc Section 1 */}
                        <Link
                            href="/getting-started"
                            className="group block bg-background"
                        >
                            <div className="border border-border rounded-xl p-6 hover:bg-positive/5 transition-all hover:border-positive h-full">
                                <div className="w-10 h-10 bg-positive/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-positive/20 transition-colors">
                                    <span className="font-bold text-positive">
                                        01
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-foreground">
                                    Getting Started
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Quick setup guide for both online usage and
                                    local installation.
                                </p>
                                <span className="text-positive font-medium inline-flex items-center">
                                    Read guide
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </Link>

                        {/* Doc Section 2 */}
                        <Link
                            href="/features"
                            className="group block bg-background"
                        >
                            <div className="border border-border rounded-xl p-6 hover:bg-positive/5 transition-all hover:border-positive h-full">
                                <div className="w-10 h-10 bg-positive/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-positive/20 transition-colors">
                                    <span className="font-bold text-positive">
                                        02
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-foreground">
                                    Features
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Detailed walkthrough of reader experience
                                    and manga management.
                                </p>
                                <span className="text-positive font-medium inline-flex items-center">
                                    Read guide
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </Link>

                        {/* Doc Section 3 */}
                        <Link
                            href="/settings"
                            className="group block bg-background"
                        >
                            <div className="border border-border rounded-xl p-6 hover:bg-positive/5 transition-all hover:border-positive h-full">
                                <div className="w-10 h-10 bg-positive/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-positive/20 transition-colors">
                                    <span className="font-bold text-positive">
                                        03
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-foreground">
                                    Settings
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Learn how to customize Akari to suit your
                                    preferences perfectly.
                                </p>
                                <span className="text-positive font-medium inline-flex items-center">
                                    Read guide
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="bg-muted/30 border border-border rounded-2xl p-8 md:p-16 relative">
                    <div className="absolute bottom-20 left-22 -mb-10 -ml-10 w-40 h-25 bg-positive/10 rounded-full blur-3xl"></div>

                    <div className="relative max-w-xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                            Ready to transform your manga reading experience?
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Take your manga reading to the next level with
                            Akari&apos;s enhanced features and clean interface.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/getting-started"
                                className="px-6 py-3 bg-positive hover:bg-opacity-90 text-primary-foreground font-medium rounded-lg transition-all"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="https://akarimanga.dpdns.org/"
                                target="_blank"
                                rel="noopener"
                                className="px-6 py-3 bg-muted hover:bg-muted/80 text-muted-foreground font-medium rounded-lg transition-all border border-border"
                            >
                                Visit Akari App
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
