import { notFound } from "next/navigation";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import mdxComponents from "@/components/mdx-components";
import matter from "gray-matter";
import { DocSidebar } from "@/components/doc-sidebar";
import { DocHeader } from "@/components/doc-header";

// Update interface to make params and searchParams Promises
interface DocPageProps {
    params: Promise<{
        slug?: string[];
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
    const docsDirectory = path.join(process.cwd(), "src/content/docs");

    // Function to recursively get all MDX files
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

export async function generateMetadata(props: DocPageProps): Promise<Metadata> {
    // Await the params Promise
    const params = await props.params;
    const slug = params.slug || [];
    const url = slug.join("/");

    try {
        const filePath = path.join(
            process.cwd(),
            "src/content/docs",
            `${url}.mdx`
        );
        const fileContent = fs.readFileSync(filePath, "utf8");

        // Use gray-matter to parse frontmatter
        const { data } = matter(fileContent);
        const title = data.title || "Documentation";
        const description = data.description;

        return {
            title,
            description,
        };
    } catch {
        return {
            title: "Documentation",
        };
    }
}

export default async function DocPage(props: DocPageProps) {
    // Await the params Promise
    const params = await props.params;
    const slug = params.slug || [];

    // Handle root/index case
    if (slug.length === 0) {
        try {
            const filePath = path.join(
                process.cwd(),
                "src/content/docs",
                "index.mdx"
            );
            const fileContent = fs.readFileSync(filePath, "utf8");
            const { content, data } = matter(fileContent);

            return renderDocPage(content, data as DocFrontmatter);
        } catch (error) {
            // If index.mdx doesn't exist, try to show a default page
            console.error("Error loading index MDX file:", error);
            return (
                <div className="container mx-auto p-4 mt-4">
                    <div className="flex flex-row justify-center gap-6">
                        <div className="flex-1 max-w-3xl">
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <DocHeader title="Documentation" />
                                <p>
                                    Welcome to the documentation. Please select
                                    a topic from the sidebar.
                                </p>
                            </div>
                        </div>
                        <DocSidebar title="Documentation" />
                    </div>
                </div>
            );
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

        const { content, data } = matter(fileContent);
        return renderDocPage(content, data as DocFrontmatter);
    } catch (error) {
        console.error("Error loading MDX file:", error);
        notFound();
    }
}

interface DocFrontmatter {
    title: string;
    description: string;
}

function renderDocPage(content: string, data: DocFrontmatter) {
    return (
        <div className="container mx-auto p-4 mt-4">
            <div className="flex flex-row justify-center gap-6">
                <div className="flex-1 max-w-3xl">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <DocHeader title={data.title} />
                        <MDXRemote
                            source={content}
                            components={mdxComponents}
                            options={{
                                mdxOptions: {
                                    development:
                                        process.env.NODE_ENV === "development",
                                    remarkPlugins: [],
                                    rehypePlugins: [],
                                },
                            }}
                        />
                    </div>
                </div>
                <DocSidebar title={data.title} />
            </div>
        </div>
    );
}
