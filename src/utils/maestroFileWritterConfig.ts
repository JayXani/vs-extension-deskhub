import * as fs from 'fs';

export function saveMaestroConfig(configPath: string, configData: any): boolean {
    if (fs.existsSync(configPath)) { return false; }
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    return true;
}
