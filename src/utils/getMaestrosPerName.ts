import fs from 'fs';

export function getMaestrosPerName(basePath: string) {
    const folders = fs.readdirSync(basePath);
    return folders.map((folder) => folder.toLocaleUpperCase().includes("MAESTRO") ? folder : "");
}
