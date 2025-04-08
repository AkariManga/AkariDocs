import React, { ReactNode } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

type ListVariant = "bullet" | "numbered" | "check" | "x" | "arrow" | "none";

interface ListProps {
    children: ReactNode;
    variant?: ListVariant;
    className?: string;
}

interface ListItemProps {
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
    variant?: ListVariant;
}

export function List({ children, variant = "bullet", className }: ListProps) {
    const Component = variant === "numbered" ? "ol" : "ul";
    const variantStyles = {
        bullet: "list-none",
        numbered: "list-none",
        check: "list-none",
        x: "list-none",
        arrow: "list-none",
        none: "list-none",
    };

    return (
        <Component
            className={cn(
                "my-6 ml-6 space-y-2",
                variantStyles[variant],
                className
            )}
        >
            {React.Children.map(children, (child) => {
                if (React.isValidElement<ListItemProps>(child)) {
                    return React.cloneElement(child, {
                        variant: child.props.icon ? undefined : variant,
                    });
                }
                return child;
            })}
        </Component>
    );
}
export function ListItem({
    children,
    icon,
    className,
    variant,
}: ListItemProps) {
    let itemIcon = icon;
    if (!itemIcon && variant) {
        // Use appropriate icon based on variant
        if (variant === "check") {
            itemIcon = (
                <LucideIcons.CheckCircle className="h-5 w-5 text-positive mr-2 flex-shrink-0" />
            );
        } else if (variant === "x") {
            itemIcon = (
                <LucideIcons.XCircle className="h-5 w-5 text-negative mr-2 flex-shrink-0" />
            );
        } else if (variant === "arrow") {
            itemIcon = (
                <LucideIcons.ArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
            );
        } else if (variant === "bullet") {
            itemIcon = (
                <LucideIcons.Circle className="h-2 w-2 text-foreground mr-2 flex-shrink-0 fill-current" />
            );
        } else if (variant === "numbered") {
            itemIcon = null;
        }
    }

    return (
        <li className={cn("flex items-center mt-2", className)}>
            {itemIcon && (
                <span className={cn("mr-2 flex-shrink-0")}>{itemIcon}</span>
            )}
            <span className="flex-1 pt-0">{children}</span>
        </li>
    );
}
