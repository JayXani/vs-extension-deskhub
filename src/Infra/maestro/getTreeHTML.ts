import { IMaestroTree } from "../../Domain/types/IMaestroFile";

export interface HtmlProps{
  success: boolean;
  nonce: string;
  tree: string[][];
  config: IMaestroTree[];
  operatorKey: string;
  apiKey: string;
  message: string;
}

export function getTreeHtml(htmlProps: HtmlProps): string {

  return ``; //Retorne o HTML aqui
}