import { IMaestroTree } from "../../Domain/types/IMaestroFile";

export interface HtmlProps {
  success: boolean;
  nonce: string;
  tree: string[][];
  config: IMaestroTree[];
  operatorKey: string;
  apiKey: string;
  message: string;
}

export function getTreeHtml(htmlProps: HtmlProps, cspSource: any, script_uri: any): string {

  return `
  <!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'none';
      img-src ${cspSource} https:;
      style-src ${cspSource} 'unsafe-inline' https:;
      script-src 'nonce-${htmlProps.nonce}' https://cdn.botframework.com; // Aqui você adiciona somente os scripts quer acessar.
    "/>


    <title>Bot Chat</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
      }

      /* Botão de abrir/fechar chat */
      #chat-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #0078d7;
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      /* Janela de chat */
      #chat-container {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 350px;
        height: 500px;
        border: 1px solid #ccc;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: none; /* começa fechado */
        overflow: hidden;
      }

      #webchat {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <!-- Botão flutuante -->
    <button id="chat-toggle">💬</button>

    <!-- Container do chat -->
    <div id="chat-container">
      <div id="webchat"></div>
    </div>

    <script nonce="${htmlProps.nonce}" src="${script_uri}"></script>
  </body>
</html>
`; //Retorne o HTML aqui
}