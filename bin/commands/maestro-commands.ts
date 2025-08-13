#!/usr/bin/env node


import { MaestroDomainService } from '../../src/App/Services/MaestroDomainService';
import { MaestroInitService } from '../../src/App/Services/MaestroInitService';
import { MaestroMergeService } from '../../src/App/Services/MaestroMergeService';
import { MaestroUploadService } from '../../src/App/Services/MaestroUploadService';

const args = process.argv.slice(2);
const currentDirectory = process.cwd(); // Pega o diretório atual que o CMD está aberto
const service = new MaestroDomainService(false);

if (args.includes('--init')) {
  const maestroService = new MaestroInitService();
  maestroService.run(currentDirectory, false);
}

if (args.includes("--upload")) {
  const maestroService = new MaestroUploadService(service);
  maestroService.run(currentDirectory);
}

if (args.includes("--merge")) {
  const maestroService = new MaestroMergeService(false);
  maestroService.run(currentDirectory);
}
