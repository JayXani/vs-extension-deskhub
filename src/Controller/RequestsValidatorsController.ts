import { IValidatorProcess } from "../interfaces/IValidatorProcess";
import { URLValidator } from "../Validators/URLValidator";

// Garante que qualquer Classe, funcao e metodo que precisem realizar qualquer validacao, eu uso somente essa classe para realizar todas as validacoes
export class RequestsValidatorsController {
    private validatorMapper: Map<String, Array<IValidatorProcess>> = new Map();
    constructor() {
        this.addValidators();
    }
    public valid(nameValidator: String, objValidate: any) {
        const processesValidators = this.validatorMapper.get(nameValidator.toLowerCase());
        for (const validator of processesValidators) { return validator.process(objValidate); }
    }

    private addValidators() {
        this.validatorMapper.set("init", [
            new URLValidator()
        ]);
    }
}