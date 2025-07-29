import * as path from 'path';
import fs from 'fs';
import { messages } from './messages';

export const searchMaestroInFolder = (key: string, basePath: string): {
    success: boolean;
    message: string;
    root: Array<Object>;
} => {

    const searchMaestros = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const maestros = [];

        for (const entry of entries) {
            if (entry.isDirectory()) {
                // Verifica se o nome da pasta contém o termo maestro 
                if (entry.name.toUpperCase().includes(key)) {
                    const key = entry.name.split("-");
                    maestros.push({
                        Nome: entry.name,
                        Chave: key[1].trim()
                    });
                }
            }
        }
        return maestros;
    };

    const result = searchMaestros(basePath);
    if (!result) {
        return {
            success: false,
            message: messages.errors.folder_not_found,
            root: []
        };
    }

    return {
        success: true,
        message: "Pasta encontrada.",
        root: result
    };
};
