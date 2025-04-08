import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
    },
});

const basePath = "/AkariDocs";

const nextConfig: NextConfig = {
    output: "export",
    basePath,
    assetPrefix: basePath,
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
};

export default withMDX(nextConfig);
