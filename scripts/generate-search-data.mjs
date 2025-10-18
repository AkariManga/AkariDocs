import fs from "fs";
import path from "path";
import matter from "gray-matter";

const outputDir = path.join(process.cwd(), "public");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function cleanContentForSearch(content) {
    let cleanedContent = content
        .replace(
            /<(Tabs|TabList|TabTrigger|TabContent|FeatureGrid|FeatureCard|Callout|PackageManagerCode)[^>]*>[\s\S]*?<\/\1>/g,
            " "
        )
        .replace(/<[^>]*>/g, " ")
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
        .replace(/^\s*\|[\s\-\|:]+\|\s*$/gm, "")
        .replace(/^\s*\|(.+)\|\s*$/gm, (match, row) => {
            const cells = row
                .split("|")
                .map((cell) => cell.trim())
                .filter((cell) => cell);
            return cells.join(" ");
        })
        .replace(/\s+/g, " ")
        .trim();

    return cleanedContent;
}

function getAllDocs() {
    const docsDirectory = path.join(process.cwd(), "src/content/docs");

    const getMdxFiles = (dir, basePath = "") => {
        const files = fs.readdirSync(dir);

        return files.flatMap((file) => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                return getMdxFiles(filePath, path.join(basePath, file));
            }

            if (path.extname(file) === ".mdx") {
                const url = path
                    .join(basePath, file.replace(/\.mdx$/, ""))
                    .split(path.sep)
                    .join("/");
                const fileContent = fs.readFileSync(filePath, "utf8");
                const { content, data } = matter(fileContent);

                const cleanedContent = cleanContentForSearch(content);

                const excerpt =
                    cleanedContent.substring(0, 160).trim() +
                    (cleanedContent.length > 160 ? "..." : "");

                const doc = {
                    title: data.title || url,
                    description: data.description || "",
                    url: `/${url}`,
                    content: cleanedContent,
                    excerpt,
                    contentLength: cleanedContent.length,
                };
                doc.jsonSize = JSON.stringify(doc).length;
                doc.formattedSize = formatBytes(doc.jsonSize);

                return [doc];
            }

            return [];
        });
    };

    return getMdxFiles(docsDirectory);
}

async function generateSearchData() {
    const start = Date.now();

    try {
        const allDocs = getAllDocs();

        console.log(
            `\x1b[32m✓\x1b[0m Processed ${allDocs.length} documents...`
        );
        const outputPath = path.join(outputDir, "search-data.json");
        fs.writeFileSync(outputPath, JSON.stringify(allDocs), "utf8");

        const time = Date.now() - start;
        console.log(
            `\x1b[32m✓\x1b[0m Search data generated successfully in ${time}ms`
        );
        console.log("");

        // Build tree
        const tree = {};
        allDocs.forEach((doc) => {
            const parts = doc.url.slice(1).split("/");
            let current = tree;
            parts.forEach((part, index) => {
                if (!current[part]) {
                    current[part] = index === parts.length - 1 ? { doc } : {};
                }
                current = current[part];
            });
        });

        // Calculate max lengths
        const maxLen = Math.max(
            ...allDocs.map((d) => d.contentLength.toString().length)
        );
        const maxFormattedSizeLen = Math.max(
            ...allDocs.map((d) => d.formattedSize.length)
        );
        const charsWidth = Math.max(maxLen, "Chars".length);
        const sizeWidth = Math.max(maxFormattedSizeLen, "Size".length);
        let maxNamePart = 0;
        function calculateMaxNamePart(node, prefix = "") {
            const keys = Object.keys(node).sort();
            keys.forEach((key, index) => {
                const isLast = index === keys.length - 1;
                const branch = isLast ? "└" : "├";
                if (node[key].doc) {
                    const namePart =
                        prefix.length + branch.length + 1 + key.length;
                    maxNamePart = Math.max(maxNamePart, namePart);
                } else {
                    const newPrefix = prefix + (isLast ? "    " : "│   ");
                    calculateMaxNamePart(node[key], newPrefix);
                }
            });
        }
        calculateMaxNamePart(tree);

        const namePadding = maxNamePart - "Document".length + 1;
        const charsPadding = charsWidth - "Chars".length;
        const sizePadding = sizeWidth - "Size".length;

        console.log(
            `\x1b[4mDocument\x1b[0m${" ".repeat(namePadding)}${" ".repeat(
                charsPadding
            )}\x1b[4mChars\x1b[0m ${" ".repeat(sizePadding)}\x1b[4mSize\x1b[0m`
        );

        // Print tree
        function printTree(node, prefix = "") {
            const keys = Object.keys(node).sort();
            keys.forEach((key, index) => {
                const isLast = index === keys.length - 1;
                let branch;
                if (index === 0) {
                    if (isLast) {
                        branch = "└";
                    } else {
                        branch = "├";
                    }
                } else if (isLast) {
                    branch = "└";
                } else {
                    branch = "├";
                }
                const newPrefix = prefix + (isLast ? "    " : "│   ");
                if (node[key].doc) {
                    const doc = node[key].doc;
                    const docContentLength = doc.contentLength;
                    const namePad =
                        maxNamePart - prefix.length - branch.length - 1;
                    console.log(
                        `${prefix}${branch} ${key.padEnd(
                            namePad
                        )} ${docContentLength
                            .toString()
                            .padStart(charsWidth)} ${doc.formattedSize.padStart(
                            sizeWidth
                        )}`
                    );
                } else {
                    console.log(`${prefix}${branch} ${key}/`);
                    printTree(node[key], newPrefix);
                }
            });
        }

        printTree(tree);
        console.log("");
    } catch (error) {
        console.error("\x1b[31m✗\x1b[0m Error generating search data:", error);
        process.exit(1);
    }
}

generateSearchData();
