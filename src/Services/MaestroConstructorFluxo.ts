import { RequestsValidatorsController } from "../Controller/RequestsValidatorsController";
import { getMaestrosPerName } from "../utils/getMaestrosPerName";
import { getTreeHtml } from "../utils/getTreeHTML";
import fs from 'fs';
import * as path from 'path';
import { showMessage } from "../utils/showMessage";


export class MaestroConstructorFlux {
    async run(basePath: string, vscode: any) {
        const validator = new RequestsValidatorsController();
        const maestro = getMaestrosPerName(basePath);
        const maestroNames = maestro.filter((m) => m !== "");
        if (!maestroNames.length) { return showMessage('warning', 'ATENÇÃO ! Nenhuma pasta de maestro encontrada.', vscode); }
        const folders = fs.readdirSync(basePath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        const foundFolder = folders.find(folderName => folderName.includes("62777"));
        return getTreeHtml(path.join(basePath, foundFolder));
    }
}