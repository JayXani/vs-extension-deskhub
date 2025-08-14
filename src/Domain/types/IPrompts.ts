// Interface para abstrair prompts
export interface IPrompts {
  promptMaestro(...args: any): Promise<any>;
  promptGetToken(...args: any): Promise<any>;
  promptGetKey(...args: any): Promise<any>;
  promptPublicKey(...args: any): Promise<any>;
  promptApiKey(...args: any): Promise<any>;
  promptConfirmMerge(...args: any): Promise<any>;
}
