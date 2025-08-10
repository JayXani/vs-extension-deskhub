import * as fs from 'fs';
import * as path from 'path';

export const recursiveSearch = (
    dir: string,
    key: string,
    onlyFolders: boolean = true
): string | null => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const currentPath = path.join(dir, entry.name);

        // Se for diretório
        if (entry.isDirectory()) {
            if (entry.name.toLowerCase().includes(key.toLowerCase()) && onlyFolders) {
                return currentPath;
            }
            const result = recursiveSearch(currentPath, key, onlyFolders);
            if (result) { return result; }
        }

        // Se for arquivo e onlyFolders = false
        if (!onlyFolders && entry.isFile()) {
            console.log(entry.name);
            if (entry.name.toLowerCase().includes(key.toLowerCase())) { return currentPath; }
        }
    }

    return null;
};
