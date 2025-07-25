import { getTreeHtml } from "../utils/getTreeHTML";
import fs from 'fs';
import * as path from 'path';
import { showMessage } from "../utils/showMessage";
import { promptGetKey } from "../utils/prompts";


export class MaestroConstructorFlux {
    async run(basePath: string, vscode: any) {
        const maestroChoose = await promptGetKey(vscode);
        if (!maestroChoose) { return showMessage('warning', 'ATENÇÃO ! É necessário informar a chave do maestro para a construção do fluxo.', vscode); }

        const folders = fs.readdirSync(basePath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        const foundFolder = folders.find(folderName => folderName.includes(maestroChoose));
        if (!foundFolder) { return showMessage('warning', 'ATENÇÃO ! Não encontramos nenhum maestro com a chave informada.', vscode); }
        return getTreeHtml([
    [
      "BEGIN_init"
    ],
    [
      "BEGIN_init",
      "IF_574734561997"
    ],
    [
      "BEGIN_init",
      "IF_574734561997",
      "FALSE_574734561997"
    ],
    [
      "BEGIN_init",
      "IF_574734561997",
      "FALSE_574734561997",
      "PARSE_928282161395"
    ],
    [
      "BEGIN_init",
      "IF_574734561997",
      "TRUE_574734561997"
    ],
    [
      "BEGIN_init",
      "IF_574734561997",
      "TRUE_574734561997",
      "PARSE_711872215920"
    ],
    [
      "BEGIN_init",
      "IF_574734561997",
      "TRUE_574734561997",
      "PARSE_711872215920",
      "LOOP_978705144752"
    ],
    [
      "BEGIN_init",
      "IF_574734561997",
      "TRUE_574734561997",
      "PARSE_711872215920",
      "LOOP_978705144752",
      "START_978705144752"
    ],
    [
      "BEGIN_init",
      "IF_574734561997",
      "TRUE_574734561997",
      "PARSE_711872215920",
      "LOOP_978705144752",
      "STOP_978705144752"
    ],
    [
      "BEGIN_init",
      "IF_574734561997",
      "TRUE_574734561997",
      "PARSE_711872215920",
      "LOOP_978705144752",
      "STOP_978705144752",
      "CASE_860827644457"
    ],
    [
      "BEGIN_init",
      "IF_574734561997",
      "TRUE_574734561997",
      "PARSE_711872215920",
      "LOOP_978705144752",
      "STOP_978705144752",
      "CASE_860827644457",
      "HTTP_186349967720"
    ]]);
    }
}