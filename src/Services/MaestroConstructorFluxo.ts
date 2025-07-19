import { RequestsValidatorsController } from "../Controller/RequestsValidatorsController";
import { getMaestrosPerName } from "../utils/getMaestrosPerName";
import { showMessage } from "../utils/showMessage";


export class MaestroConstructorFlux {
    async run(basePath: string, vscode: any) {
        const validator = new RequestsValidatorsController();
        const maestro = getMaestrosPerName(basePath);
        const maestroNames = maestro.filter((m) => m !== "");
        if (!maestroNames.length) { return showMessage('warning', 'ATENÇÃO ! Nenhuma pasta de maestro encontrada.', vscode); }
        
    }
}