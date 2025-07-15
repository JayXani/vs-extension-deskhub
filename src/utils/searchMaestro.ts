import * as path from 'path';
import fs from 'fs';
import { messages } from './messages';

export const searchMaestro = (key: string, basePath: string) => {
    const folders = fs.readdirSync(basePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const foundFolder = folders.find(folderName => folderName.includes(key));

    if (!foundFolder) {
        return {
            success: false,
            message: messages.errors.folder_not_found,
            path: ""
        };
    }

    const fullPath = path.join(basePath, foundFolder);

    return {
        success: true,
        message: "Pasta encontrada.",
        path: fullPath
    };
};
