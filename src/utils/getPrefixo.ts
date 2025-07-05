export function extractPrefixFromUrl(url: string): string | null {
    const urlObj = new URL(url);
    let token = urlObj.searchParams.get("token");

    if (!token) {
        token = urlObj.searchParams.get("tokentmp");
        if (!token) { return null; }
    }

    const parts = token.split('.');
    return parts.length > 0 ? parts[0] : null;
}