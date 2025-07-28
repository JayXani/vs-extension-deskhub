import * as path from 'path';
import fs from 'fs';
import { messages } from './messages';

export const searchMaestroInFolder = (key: string, basePath: string): {
    success: boolean;
    message: string;
    path: string;
} => {

    const recursiveSearch = (dir: string): string | null => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                const currentPath = path.join(dir, entry.name);

                // Verifica se o nome da pasta contém a chave
                if (entry.name.includes(key)) {
                    return currentPath;
                }

                // Chamada recursiva para procurar em subpastas
                const result = recursiveSearch(currentPath);
                if (result) {
                    return result;
                }
            }
        }

        return null;
    };

    const resultPath = recursiveSearch(basePath);

    if (!resultPath) {
        return {
            success: false,
            message: messages.errors.folder_not_found,
            path: ""
        };
    }

    return {
        success: true,
        message: "Pasta encontrada.",
        path: resultPath
    };
};
