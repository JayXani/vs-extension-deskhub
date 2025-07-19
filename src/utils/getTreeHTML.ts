
import * as path from 'path';
import * as fs from 'fs';


export function getTreeHtml(rootPath: string): string {
  function walk(dir: string): string {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    let html = `<ul>`;
    for (const item of items) {
      if (item.isDirectory()) {
        const subDir = path.join(dir, item.name);
        html += `<li><span>${item.name}</span>${walk(subDir)}</li>`;
      }
    }
    html += `</ul>`;
    return html;
  }

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>
        ul {
          list-style-type: none;
          padding-left: 20px;
        }
        li {
          margin: 4px 0;
        }
        span {
          cursor: pointer;
          color: #3794ff;
        }
        span:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h2>Árvore de Pastas</h2>
      ${walk(rootPath)}
    </body>
    </html>
  `;
}
