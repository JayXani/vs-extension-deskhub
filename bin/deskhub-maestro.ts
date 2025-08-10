#!/usr/bin/env node


import { MaestroInitService } from '../src/Services/MaestroInitService';
import { MaestroMergeService } from '../src/Services/MaestroMergeService';
import { MaestroUploadService } from '../src/Services/MaestroUploadService';

const args = process.argv.slice(2);
const currentDirectory = process.cwd(); // Pega o diretório atual que o CMD está aberto
if (args.includes('--init')) {
  const maestroService = new MaestroInitService();
  maestroService.run(currentDirectory, false);
}

if(args.includes("--upload")){
  const maestroService = new MaestroUploadService(false);
  maestroService.run(currentDirectory);
}

if(args.includes("--merge")){
  const maestroService = new MaestroMergeService();
  maestroService.run(currentDirectory, false);
}
