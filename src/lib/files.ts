import fs from "fs";
import path from "path";

export function getMdxSlugs(): { slug: string[] }[] {
    const docsDirectory = path.join(process.cwd(), "src/content/docs");

    const getMdxFiles = (
        dir: string,
        basePath: string = ""
    ): { slug: string[] }[] => {
        const files = fs.readdirSync(dir);

        return files.flatMap((file) => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                return getMdxFiles(filePath, path.join(basePath, file));
            }

            if (path.extname(file) === ".mdx") {
                let slug: string[];
                if (file === "index.mdx") {
                    // For index.mdx, use the basePath as the slug (e.g., 'api/v1' -> ['api', 'v1'])
                    slug = basePath ? basePath.split(path.sep) : [];
                } else {
                    // For other .mdx files, include the file name in the slug
                    slug = path
                        .join(basePath, file.replace(/\.mdx$/, ""))
                        .split(path.sep);
                }
                return [{ slug }];
            }

            return [];
        });
    };

    return getMdxFiles(docsDirectory);
}

export function getFilePath(slug: string[]): string {
    const url = slug.join("/");
    const docsDirectory = path.join(process.cwd(), "src/content/docs");

    const directPath = path.join(docsDirectory, `${url}.mdx`);
    if (fs.existsSync(directPath)) {
        return directPath;
    }

    const indexPath = path.join(docsDirectory, url, "index.mdx");
    if (fs.existsSync(indexPath)) {
        return indexPath;
    }

    throw new Error("MDX file not found");
}
