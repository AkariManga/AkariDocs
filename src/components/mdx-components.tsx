import { ReactNode } from "react";
import { Code } from "@/components/ui/code";
import {
    Tabs,
    TabList,
    TabTrigger,
    TabContent,
    Tab,
} from "@/components/ui/tabs";
import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import { PackageManagerSelector } from "@/components/package-manager/package-manager-selector";
import { PackageManagerCode } from "@/components/package-manager/package-manager-code";
import { Callout } from "@/components/ui/callout";
import { FeatureCard, FeatureGrid } from "@/components/ui/feature-card";
import { List, ListItem } from "@/components/ui/list";
import { slugify } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Import Lucide icons for usage in MDX
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

interface MDXComponentProps {
    children?: ReactNode;
    className?: string;
    id?: string;
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    href?: string;
}

const OfficialBadge = () => (
    <span
        className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
        title="Only available on the official website"
    >
        Official
    </span>
);

const components = {
    ...Object.entries(LucideIcons).reduce(
        (acc, [name, Icon]) => ({
            ...acc,
            [name]: (props: LucideProps) => {
                const LucideIcon = Icon as React.ComponentType<LucideProps>;
                return <LucideIcon {...props} />;
            },
        }),
        {} as Record<string, React.ComponentType<LucideProps>>
    ),
    h1: ({ className, children, ...props }: MDXComponentProps) => {
        const id =
            props.id ||
            (typeof children === "string" ? slugify(children) : undefined);
        return (
            <h1
                id={id}
                className={`scroll-m-20 text-4xl font-bold tracking-tight ${
                    className || ""
                }`}
                {...props}
            >
                {children}
            </h1>
        );
    },
    h2: ({ className, children, ...props }: MDXComponentProps) => {
        const id =
            props.id ||
            (typeof children === "string" ? slugify(children) : undefined);
        return (
            <h2
                id={id}
                className={`mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight ${
                    className || ""
                }`}
                {...props}
            >
                {children}
            </h2>
        );
    },
    h3: ({ className, children, ...props }: MDXComponentProps) => {
        const id =
            props.id ||
            (typeof children === "string" ? slugify(children) : undefined);
        return (
            <h3
                id={id}
                className={`mt-8 scroll-m-20 text-2xl font-semibold tracking-tight ${
                    className || ""
                }`}
                {...props}
            >
                {children}
            </h3>
        );
    },
    p: ({ className, ...props }: MDXComponentProps) => (
        <p
            className={`leading-7 [&:not(:first-child)]:mt-6 ${
                className || ""
            }`}
            {...props}
        />
    ),
    a: ({ href, className, ...props }: MDXComponentProps) => (
        <Link
            href={href || "#"}
            className={`text-primary underline underline-offset-4 hover:text-primary/80 ${
                className || ""
            }`}
            {...props}
        />
    ),
    ul: ({ className, ...props }: MDXComponentProps) => (
        <ul
            className={`my-6 ml-6 list-disc [&>li]:mt-2 ${className || ""}`}
            {...props}
        />
    ),
    ol: ({ className, ...props }: MDXComponentProps) => (
        <ol
            className={`my-6 ml-6 list-decimal [&>li]:mt-2 ${className || ""}`}
            {...props}
        />
    ),
    li: ({ className, ...props }: MDXComponentProps) => (
        <li className={`${className || ""}`} {...props} />
    ),
    blockquote: ({ className, ...props }: MDXComponentProps) => (
        <blockquote
            className={`mt-6 border-l-2 border-primary pl-6 italic ${
                className || ""
            }`}
            {...props}
        />
    ),
    img: ({ className, alt, src, ...props }: MDXComponentProps) => {
        if (!src) {
            console.warn("Image component requires src prop");
            return null;
        }

        return (
            <Image
                className={`rounded-lg border border-border ${className || ""}`}
                alt={alt || "Image"}
                src={src}
                {...props}
            />
        );
    },
    hr: ({ className, ...props }: MDXComponentProps) => (
        <hr className={`my-8 border-border ${className || ""}`} {...props} />
    ),
    table: ({ className, ...props }: MDXComponentProps) => (
        <Table className={className || ""} {...props} />
    ),
    thead: ({ className, ...props }: MDXComponentProps) => (
        <TableHeader className={className || ""} {...props} />
    ),
    tbody: ({ className, ...props }: MDXComponentProps) => (
        <TableBody className={className || ""} {...props} />
    ),
    tfoot: ({ className, ...props }: MDXComponentProps) => (
        <TableFooter className={className || ""} {...props} />
    ),
    tr: ({ className, ...props }: MDXComponentProps) => (
        <TableRow className={className || ""} {...props} />
    ),
    th: ({ className, ...props }: MDXComponentProps) => (
        <TableHead className={className || ""} {...props} />
    ),
    td: ({ className, ...props }: MDXComponentProps) => (
        <TableCell className={className || ""} {...props} />
    ),
    pre: ({ className, ...props }: MDXComponentProps) => (
        <pre className={className} {...props} />
    ),
    code: ({
        className,
        children,
        ...props
    }: MDXComponentProps & { children: string }) => {
        const match = /language-(\w+)/.exec(className || "");
        const isCodeBlock = match && match[1];
        const trimmedChildren = isCodeBlock
            ? children.replace(/\n+$/, "")
            : children;

        if (isCodeBlock) {
            return (
                <Code language={match[1]} variant="numbered" {...props}>
                    {trimmedChildren}
                </Code>
            );
        }

        return (
            <Code variant="inline" {...props}>
                {trimmedChildren}
            </Code>
        );
    },
    // Custom components
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    Tabs,
    TabList,
    TabTrigger,
    TabContent,
    Tab,
    Callout,
    FeatureCard,
    FeatureGrid,
    PackageManagerSelector,
    PackageManagerCode,
    List,
    ListItem,
    OfficialBadge,
};

export default components;
