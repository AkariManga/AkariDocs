import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import remarkGfm from "remark-gfm";

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
    },
});

const nextConfig: NextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "github.com",
                port: "",
                pathname: "/sn0w12/Akari/raw/dev/images/**",
                search: "",
            },
        ],
        unoptimized: true,
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
            ],
        };
    },
};

export default withMDX(nextConfig);
