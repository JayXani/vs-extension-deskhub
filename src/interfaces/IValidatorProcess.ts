export interface IValidatorProcess {
    process(obj: any): { success: boolean, message: string };
}