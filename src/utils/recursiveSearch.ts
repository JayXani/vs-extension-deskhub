import * as fs from 'fs';
import * as path from 'path';

export const recursiveSearch = (dir: string, key: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const currentPath = path.join(dir, entry.name);
            if (entry.name.toLowerCase().includes(key.toLowerCase())) { return currentPath; }
            const result = recursiveSearch(currentPath, key);
            if (result) { return result; }
        }
    }
    return null;
};