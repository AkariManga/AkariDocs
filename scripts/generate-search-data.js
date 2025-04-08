import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Make sure the output directory exists
const outputDir = path.join(process.cwd(), "public");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to clean content for search
function cleanContentForSearch(content) {
    // Remove JSX/HTML tags and their contents for components that aren't useful for search
    let cleanedContent = content
        // Remove JSX component tags with their content
        .replace(
            /<(Tabs|TabList|TabTrigger|TabContent|FeatureGrid|FeatureCard|Callout|PackageManagerCode|Table|TableHeader|TableRow|TableHead|TableBody|TableCell)[^>]*>[\s\S]*?<\/\1>/g,
            " "
        )
        // Remove remaining HTML/JSX tags but keep their content
        .replace(/<[^>]*>/g, " ")
        // Remove markdown link syntax
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
        // Replace multiple spaces with a single space
        .replace(/\s+/g, " ")
        .trim();

    return cleanedContent;
}

function getAllDocs() {
    const docsDirectory = path.join(process.cwd(), "src/content/docs");

    // Function to recursively get all MDX files
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

                // Clean content for search
                const cleanedContent = cleanContentForSearch(content);

                // Create a clean excerpt
                const excerpt =
                    cleanedContent.substring(0, 160) +
                    (cleanedContent.length > 160 ? "..." : "");

                return [
                    {
                        title: data.title || url,
                        description: data.description || "",
                        url: `/docs/${url}`,
                        content: cleanedContent,
                        excerpt,
                    },
                ];
            }

            return [];
        });
    };

    return getMdxFiles(docsDirectory);
}

// Generate search data
async function generateSearchData() {
    console.log("Generating search data...");

    try {
        const allDocs = getAllDocs();

        // Write search data to JSON file
        fs.writeFileSync(
            path.join(outputDir, "search-data.json"),
            JSON.stringify(allDocs),
            "utf8"
        );

        console.log("Search data generated successfully!");
    } catch (error) {
        console.error("Error generating search data:", error);
        process.exit(1);
    }
}

generateSearchData();
