import * as fs from 'fs';
import { createMaestroFiles } from './createMaestroFiles';
import { IMaestroResponse } from '../interfaces/IMaestroRequests';

export function maestroFileWritter(configPath: string, maestroResponse: IMaestroResponse): boolean {
    if (fs.existsSync(configPath)) { return false; }
    const fileConverted = createMaestroFiles(configPath, maestroResponse);
    if ("error" in fileConverted) { return false; }

    return true;
}
