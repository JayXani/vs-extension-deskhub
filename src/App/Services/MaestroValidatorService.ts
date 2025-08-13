import { IValidatorProcess } from "../../Domain/types/IValidatorProcess";
import { Base64Validator } from "../../Domain/validators/Base64Validator";
import { FolderValidator } from "../../Domain/validators/FolderValidator";
import { MaestroListValidator } from "../../Domain/validators/MaestroListValidator";
import { MaestroNameValidator } from "../../Domain/validators/MaestroNameValidator";
import { RequestValidator } from "../../Domain/validators/RequestValidator";

// Garante que qualquer Classe, funcao e metodo que precisem realizar qualquer validacao, eu uso somente essa classe para realizar todas as validacoes
export class MaestroValidatorService {
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