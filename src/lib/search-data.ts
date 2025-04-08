export interface DocSearchResult {
    title: string;
    content: string;
    description: string;
    url: string;
    excerpt: string;
}

export const searchIndex: DocSearchResult[] = [];

// Client-side search function
export function clientSearchDocs(
    query: string,
    docs: DocSearchResult[]
): DocSearchResult[] {
    if (!query || query.trim() === "") return [];

    const searchTerms = query
        .toLowerCase()
        .split(" ")
        .filter((term) => term.length > 0);

    return docs
        .filter((doc) => {
            const titleMatch = doc.title
                .toLowerCase()
                .includes(query.toLowerCase());
            const contentMatch = doc.content
                .toLowerCase()
                .includes(query.toLowerCase());
            const descriptionMatch =
                doc.description?.toLowerCase().includes(query.toLowerCase()) ||
                false;

            // Check if all search terms appear somewhere in the document
            const allTermsMatch = searchTerms.every(
                (term) =>
                    doc.title.toLowerCase().includes(term) ||
                    doc.content.toLowerCase().includes(term) ||
                    (doc.description &&
                        doc.description.toLowerCase().includes(term))
            );

            return (
                titleMatch || contentMatch || descriptionMatch || allTermsMatch
            );
        })
        .sort((a, b) => {
            // Title matches are prioritized over content matches
            const aInTitle = a.title
                .toLowerCase()
                .includes(query.toLowerCase());
            const bInTitle = b.title
                .toLowerCase()
                .includes(query.toLowerCase());

            if (aInTitle && !bInTitle) return -1;
            if (!aInTitle && bInTitle) return 1;
            return 0;
        })
        .slice(0, 10); // Limit to 10 results
}
