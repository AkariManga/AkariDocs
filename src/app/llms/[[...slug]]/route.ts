import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { getFilePath, getMdxSlugs } from "@/lib/files";
import { DocSearchResult, clientSearchDocs } from "@/lib/search-data";

export async function generateStaticParams() {
    return getMdxSlugs();
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

function transformFrontmatter(content: string, slug?: string[]): string {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
    return content.replace(frontmatterRegex, (match, fm) => {
        const lines = fm.split("\n");
        let title = "";
        for (const line of lines) {
            if (line.startsWith("title:")) {
                title = line.replace("title:", "").trim();
                break;
            }
        }
        if (title) {
            return `# ${title} - ${
                process.env.NEXT_PUBLIC_BASE_URL
            }/${slug?.join("/")}\n`;
        }
        return "";
    });
}

function processMarkdownContent(content: string, slug?: string[]): string {
    content = content.replace(/\r\n/g, "\n");
    content = transformFrontmatter(content, slug);
    content = transformPackageManagerCode(content);
    content = transformTabs(content);
    return content;
}

function getErrorMessage(error: unknown): string {
    let message =
        typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: unknown }).message)
            : String(error);

    if (message.startsWith("ENOENT: no such file or directory")) {
        message = "Page not found";
    }

    return message;
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
            return new Response(getErrorMessage(error), {
                status: 404,
                headers: { "Content-Type": "text/plain" },
            });
        }
    }

    try {
        const filePath = getFilePath(slug);
        const fileContent = fs.readFileSync(filePath, "utf8");

        return new Response(processMarkdownContent(fileContent, slug), {
            status: 200,
            headers: { "Content-Type": "text/plain" },
        });
    } catch (error) {
        // Try to find similar pages using search data
        try {
            const searchDataPath = path.join(
                process.cwd(),
                "public",
                "search-data.json"
            );
            const searchDataContent = fs.readFileSync(searchDataPath, "utf8");
            const searchIndex: DocSearchResult[] =
                JSON.parse(searchDataContent);
            const query = slug.join("/");
            const similarPages = clientSearchDocs(query, searchIndex);
            if (similarPages.length > 0) {
                let response =
                    "Page not found. Here are some similar pages:\n\n";
                for (const page of similarPages.slice(0, 5)) {
                    response += `- ${page.title}: ${process.env.NEXT_PUBLIC_BASE_URL}${page.url}\n`;
                }
                return new Response(response, {
                    status: 404,
                    headers: { "Content-Type": "text/plain" },
                });
            }
        } catch {
            // Ignore search errors, proceed to not found
        }
        return new Response(getErrorMessage(error), {
            status: 404,
            headers: { "Content-Type": "text/plain" },
        });
    }
}
