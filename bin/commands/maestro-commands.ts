#!/usr/bin/env node


import { MaestroInitController } from '../../src/App/Controllers/MaestroInitController';
import { MaestroUpdateController } from '../../src/App/Controllers/MaestroUpdateController';
import { MaestroMergeService } from '../../src/App/Services/MaestroMergeService';

const args = process.argv.slice(2);
const currentDirectory = process.cwd(); // Pega o diretório atual que o CMD está aberto

if (args.includes('--init')) {
  const maestroService = new MaestroInitController(false);
  maestroService.execute(currentDirectory);
}

if (args.includes("--upload")) {
  const maestroService = new MaestroUpdateController(false);
  maestroService.execute(currentDirectory);
}

if (args.includes("--merge")) {
  const maestroService = new MaestroMergeService(false);
  maestroService.run(currentDirectory);
}
