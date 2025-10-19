import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import remarkGfm from "remark-gfm";

function generateCacheHeaders(
    time: number,
    staleWhileRevalidate?: number,
    staleIfError: number = 0,
    cacheTag: string = "docs-page"
): Array<{ key: string; value: string }> {
    const swr = staleWhileRevalidate ?? Math.round(time * 2);
    const cacheControl = `public, max-age=${time}, stale-while-revalidate=${swr}, stale-if-error=${staleIfError}`;

    return [
        { key: "Cache-Control", value: cacheControl },
        { key: "CDN-Cache-Control", value: cacheControl },
        {
            key: "Cache-Tag",
            value: cacheTag,
        },
    ];
}

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
    },
});

const nextConfig: NextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    experimental: {
        reactCompiler: true,
    },
    async headers() {
        return [
            {
                source: "/:path((?!.*\\.).*)",
                headers: generateCacheHeaders(14400, 31536000),
            },
            {
                source: "/:path(.*\\.(?:jpg|jpeg|png|gif|webp|svg))",
                headers: generateCacheHeaders(
                    31536000,
                    63072000,
                    0,
                    "docs-image"
                ),
            },
        ];
    },
    rewrites: async () => {
        return {
            beforeFiles: [
                {
                    source: "/:slug*",
                    destination: "/llms/:slug*",
                    has: [
                        {
                            type: "header",
                            key: "accept",
                            value: "(.*)(text/markdown|text/plain)(.*)",
                        },
                    ],
                },
                {
                    source: "/api/latest/:path*",
                    destination: "/api/v1/:path*",
                },
            ],
        };
    },
};

export default withMDX(nextConfig);
