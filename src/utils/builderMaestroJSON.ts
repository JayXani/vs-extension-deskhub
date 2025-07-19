import * as fs from 'fs';
import * as path from 'path';

export const builderMaestroJSON = (basePath: string) => {
    const maestroConfig = {
        config: []
    };
    const treePaths: string[] = [];

    const walk = (currentPath: string, pathStack: string[] = []) => {
        const items = fs.readdirSync(currentPath, { withFileTypes: true });
        const fileMap: Record<string, { code?: string; responseModel?: any }> = {};

        for (const item of items) {
            const fullPath = path.join(currentPath, item.name);
            const name = item.name;
            const lower = name.toLowerCase();

            if (item.isFile()) {
                const ext = path.extname(name).toLowerCase();

                // Arquivos .json
                if (ext === '.json') {
                    const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
                    
                    if (lower.includes("begin_init")) {
                        maestroConfig.config.push({ name, response_model: content });
                    } else if (lower.includes("if_")) {
                        maestroConfig.config.push({ name, statement: content.statement });
                    } else if (lower.includes("true_") || lower.includes("false_")) {
                        maestroConfig.config.push({ name, return: content.return });
                    } else if (lower.includes("start_") || lower.includes("stop_")) {
                        maestroConfig.config.push({ name, return: content.return });
                    } else if (lower.includes("loop")) {
                        maestroConfig.config.push({ name, statement: content.statement });
                    } else if (lower.includes("case")) {
                        maestroConfig.config.push({ name, statement: content.statement });
                    }

                    // parse_*.responseModel.json ou http_*.responseModel.json
                    else if ((lower.includes("parse_") || lower.includes("http_")) && lower.includes("responsemodel")) {
                        const baseName = name.replace(".responseModel.json", "");
                        if (!fileMap[baseName]) { fileMap[baseName] = {}; }
                        fileMap[baseName].responseModel = content;
                    }
                }

                // Arquivos de código: .js ou .py
                else if ((ext === '.js' || ext === '.py') && lower.includes("parse_")) {
                    const baseName = name.replace(ext, ""); // Retira somente a base do nome, retirando a extensão
                    const code = fs.readFileSync(fullPath, 'utf-8'); // Retira o código do arquivo atual
                    if (!fileMap[baseName]) { fileMap[baseName] = {}; }
                    fileMap[baseName].code = code;
                }
            }

            // Se for pasta, continua a recursão
            if (item.isDirectory()) {
                const newStack = [...pathStack, item.name];
                treePaths.push(newStack.join("."));
                walk(fullPath, newStack);
            }
        }

        // Após percorrer a pasta, adiciona os pares encontrados
        for (const [baseName, data] of Object.entries(fileMap)) {
            maestroConfig.config.push({
                name: baseName,
                code: data.code,
                response_model: data.responseModel
            });
        }
    };

    walk(basePath);

    return {
        config: maestroConfig.config,
        tree: treePaths.join("; ")
    };
};