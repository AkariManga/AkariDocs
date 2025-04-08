"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { clientSearchDocs, DocSearchResult } from "@/lib/search-data";
import { Search } from "lucide-react";
import searchData from "../../../public/search-data.json";

export default function SearchButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState<DocSearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when dialog opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Reset search when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setSearchText("");
            setSearchResults([]);
        }
    }, [isOpen]);

    const handleSearchInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const query = e.target.value;
        setSearchText(query);

        if (query.length >= 2) {
            const results = clientSearchDocs(
                query,
                searchData as DocSearchResult[]
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Close dialog on escape
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden border touch-manipulation"
                onClick={() => setIsOpen(true)}
                aria-label="Search documentation"
            >
                <Search className="h-5 w-5" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent
                    className="sm:max-w-md"
                    onKeyDown={handleKeyDown}
                >
                    <DialogHeader>
                        <DialogTitle>Search Documentation</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Input
                            ref={inputRef}
                            type="search"
                            placeholder="Search docs..."
                            value={searchText}
                            onChange={handleSearchInputChange}
                            className="w-full"
                            autoComplete="off"
                        />

                        <div className="max-h-[60vh] overflow-y-auto">
                            {searchResults.length > 0 ? (
                                <div className="space-y-2">
                                    {searchResults.map((result) => (
                                        <Link
                                            href={result.url}
                                            key={result.url}
                                            onClick={() => setIsOpen(false)}
                                            className="block p-3 hover:bg-accent rounded-lg"
                                            prefetch={true}
                                        >
                                            <div className="font-medium">
                                                {result.title}
                                            </div>
                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                {result.description}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : searchText.length >= 2 ? (
                                <div className="text-center text-muted-foreground p-4">
                                    No matching documentation found
                                </div>
                            ) : searchText.length > 0 ? (
                                <div className="text-center text-muted-foreground p-4">
                                    Keep typing to search the docs
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground p-4">
                                    Start typing to search the docs
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
