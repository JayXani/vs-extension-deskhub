import { IValidatorProcess } from "../interfaces/IValidatorProcess";
import { Base64Validator } from "../Validators/Base64Validator";
import { FolderValidator } from "../Validators/FolderValidator";
import { MaestroListValidator } from "../Validators/MaestroListValidator";
import { MaestroNameValidator } from "../Validators/MaestroNameValidator";
import { RequestValidator } from "../Validators/RequestValidator";

// Garante que qualquer Classe, funcao e metodo que precisem realizar qualquer validacao, eu uso somente essa classe para realizar todas as validacoes
export class RequestsValidatorsController {
    private validatorMapper: Map<String, Array<IValidatorProcess>> = new Map();
    constructor() {
        this.addValidators();
    }
    public async valid(name: string, ...args: any) {
        const processesValidators = this.validatorMapper.get(name.toLowerCase());
        for (const validator of processesValidators) { return validator.process(...args); }
    }

    private addValidators() {
        this.validatorMapper.set("init", [
            new RequestValidator()
        ]);
        this.validatorMapper.set("maestrolist", [
            new MaestroListValidator()
        ]);
        this.validatorMapper.set("maestrotfile", [
            new Base64Validator()
        ]);
        this.validatorMapper.set("folder_to_save", [
            new FolderValidator()
        ]);
        this.validatorMapper.set("to_update", [
            new MaestroNameValidator()
        ]);
    }
}