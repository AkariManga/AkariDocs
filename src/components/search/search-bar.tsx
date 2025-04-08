"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { clientSearchDocs, DocSearchResult } from "@/lib/search-data";
import searchData from "../../../public/search-data.json";

export default function SearchBar() {
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState<DocSearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchInputChange = (e: { target: { value: string } }) => {
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

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (
            popupRef.current &&
            !popupRef.current.contains(e.relatedTarget as Node)
        ) {
            setShowPopup(false);
        }
    };

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setShowPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popupRef]);

    return (
        <div
            className={`relative transition-all w-auto flex-grow lg:grow-0 lg:w-96 xl:w-128 ${
                isFocused ? "xl:w-[40rem] lg:w-128" : ""
            }`}
        >
            <div className="flex gap-2 relative">
                <Input
                    ref={inputRef}
                    type="search"
                    placeholder="Search docs..."
                    value={searchText}
                    onChange={handleSearchInputChange}
                    onBlur={handleInputBlur}
                    onFocus={() => {
                        setIsFocused(true);
                        setShowPopup(true);
                    }}
                    className="w-full hidden md:block h-8"
                />
            </div>
            {showPopup && (
                <Card
                    ref={popupRef}
                    className="hidden absolute p-2 z-10 mt-1 m-auto md:w-full md:block"
                >
                    <CardContent className="p-2">
                        {searchResults.length > 0 ? (
                            <>
                                {searchResults.map((result) => (
                                    <Link
                                        href={result.url}
                                        key={result.url}
                                        onClick={() => setShowPopup(false)}
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
                            </>
                        ) : searchText.length >= 2 ? (
                            <div className="text-center text-muted-foreground p-4">
                                No matching documentation found
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground p-4">
                                Start typing to search the docs
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
