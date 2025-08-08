export interface IValidatorProcess {
    process(...args: any): { success: boolean, message: string };
}