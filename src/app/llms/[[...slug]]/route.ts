import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export async function generateStaticParams() {
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
                const slug = path
                    .join(basePath, file.replace(/\.mdx$/, ""))
                    .split(path.sep);
                return [{ slug }];
            }

            return [];
        });
    };

    return getMdxFiles(docsDirectory);
}

function transformPackageManagerCode(content: string): string {
    const regex =
        /^(\s*)<PackageManagerCode\s+npm="([^"]*)"\s+yarn="([^"]*)"\s+pnpm="([^"]*)"\s*\/>/gm;
    return content.replace(regex, (match, indent, npm) => {
        if (!npm) return match;
        const code = npm.replace(/\\n/g, "\n" + indent);
        return indent + code;
    });
}

function dedent(content: string): string {
    const lines = content.split("\n");
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
    if (nonEmptyLines.length === 0) return content;

    const minIndent = Math.min(
        ...nonEmptyLines.map((line) => {
            const match = line.match(/^(\s*)/);
            return match ? match[0].length : 0;
        })
    );

    return lines.map((line) => line.slice(minIndent)).join("\n");
}

function transformTabs(content: string): string {
    // Regex to match entire <Tabs> blocks (multiline, non-greedy)
    const tabsRegex = /<Tabs[^>]*>(.*?)<\/Tabs>/gs;
    return content.replace(tabsRegex, (match, inner) => {
        // Extract tab triggers and contents
        const triggerRegex =
            /<TabTrigger[^>]*id="([^"]*)"[^>]*>(.*?)<\/TabTrigger>/g;
        const contentRegex =
            /<TabContent[^>]*id="([^"]*)"[^>]*>(.*?)<\/TabContent>/gs;

        const triggers: { [key: string]: string } = {};
        let triggerMatch;
        while ((triggerMatch = triggerRegex.exec(inner)) !== null) {
            triggers[triggerMatch[1]] = triggerMatch[2].trim();
        }

        let result = "";
        let contentMatch;
        while ((contentMatch = contentRegex.exec(inner)) !== null) {
            const id = contentMatch[1];
            let tabContent = contentMatch[2];
            tabContent = dedent(tabContent).trim(); // Dedent and trim
            if (triggers[id]) {
                // Check if the content already starts with the heading
                const heading = `## ${triggers[id]}`;
                if (tabContent.startsWith(heading)) {
                    result += `${tabContent}\n\n`;
                } else {
                    result += `${heading}\n\n${tabContent}\n\n`;
                }
            }
        }
        return result.trim();
    });
}

function processMarkdownContent(content: string): string {
    content = transformPackageManagerCode(content);
    content = transformTabs(content);
    return content;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug?: string[] }> }
) {
    const { slug = [] } = await params;

    // Handle root/index case
    if (slug.length === 0) {
        try {
            const filePath = path.join(
                process.cwd(),
                "src/content/docs",
                "index.mdx"
            );
            const fileContent = fs.readFileSync(filePath, "utf8");

            return new Response(processMarkdownContent(fileContent), {
                status: 200,
                headers: { "Content-Type": "text/plain" },
            });
        } catch (error) {
            console.error("Error loading index MDX file:", error);
            return Response.json({ error: "Not found" }, { status: 404 });
        }
    }

    const url = slug.join("/");

    try {
        const filePath = path.join(
            process.cwd(),
            "src/content/docs",
            `${url}.mdx`
        );
        const fileContent = fs.readFileSync(filePath, "utf8");

        return new Response(processMarkdownContent(fileContent), {
            status: 200,
            headers: { "Content-Type": "text/plain" },
        });
    } catch (error) {
        console.error("Error loading MDX file:", error);
        return Response.json({ error: "Not found" }, { status: 404 });
    }
}
