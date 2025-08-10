import * as fs from "fs";
import * as path from "path";
import { messages } from "./messages"; // ajuste conforme seu projeto

export const searchMaestroInFolder = (
    key: string,
    basePath: string
): {
    success: boolean;
    message: string;
    root: Array<{ Nome: string; Chave: string; Path: string}>;
} => {

    const searchMaestros = (dir: string, maestros: any[]) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {

                // Comparação case-insensitive
                if (entry.name.toUpperCase().includes(key.toUpperCase())) {
                    const parts = entry.name.split("-");
                    if ((parts.length < 1) || !(parts[1]?.trim() || "")) { continue; }
                    maestros.push({
                        Nome: entry.name,
                        Chave: parts[1]?.trim() || "",
                        Path: path.join(dir, entry.name)
                    });
                    continue;
                }

                // Continua a busca recursiva sem interromper o loop
                searchMaestros(path.join(dir, entry.name), maestros);
            }
        }

        return maestros;
    };

    const result = searchMaestros(basePath, []);

    if (!result || !result.length) {
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
